import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { prisma } from "@/lib/db/prisma";
import {
  SEVERITY_RGB,
  severityFromStatus,
  severityFromZ,
  toTrafficLight,
} from "@/lib/growth/severity-colors";
import { buildChartPayload } from "@/lib/services/chart-service";
import { getAlerts } from "@/lib/services/visit-service";
import type { ChartSeries } from "@/types/charts";

function csvEscape(value: unknown): string {
  if (value == null) return "";
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
}

export async function buildVisitsCsv(humanPatientId: string): Promise<string> {
  const patient = await prisma.patient.findUnique({
    where: { patientId: humanPatientId },
    include: {
      visits: {
        orderBy: [{ visitDate: "asc" }, { createdAt: "asc" }],
        include: { measurements: true },
      },
    },
  });

  if (!patient) {
    throw Object.assign(new Error("Patient not found"), { status: 404 });
  }

  const headers = [
    "visitDate",
    "ageYears",
    "ageMonths",
    "ageDays",
    "ageTotalMonths",
    "weightKg",
    "heightCm",
    "bmi",
    "headCircumferenceCm",
    "weightForAgeZ",
    "heightForAgeZ",
    "bmiForAgeZ",
    "weightForHeightZ",
    "hcForAgeZ",
    "nutritionalStatus",
    "clinicalFlags",
    "severityColor",
    "growthVelocityKgPerMonth",
    "notes",
    "doctorAdvice",
    "vaccinationStatus",
    "nextVisitDue",
  ];

  const lines = [headers.join(",")];

  for (const v of patient.visits) {
    const m = v.measurements[0];
    const color = severityFromStatus(m?.nutritionalStatus, m?.clinicalFlags);
    const row = [
      v.visitDate.toISOString().slice(0, 10),
      v.ageYears,
      v.ageMonths,
      v.ageDays,
      v.ageTotalMonths.toFixed(2),
      v.weightKg ?? "",
      v.heightCm ?? "",
      v.bmi != null ? v.bmi.toFixed(2) : "",
      v.headCircumferenceCm ?? "",
      m?.weightForAgeZ?.toFixed(2) ?? "",
      m?.heightForAgeZ?.toFixed(2) ?? "",
      m?.bmiForAgeZ?.toFixed(2) ?? "",
      m?.weightForHeightZ?.toFixed(2) ?? "",
      m?.hcForAgeZ?.toFixed(2) ?? "",
      m?.nutritionalStatus ?? "",
      (m?.clinicalFlags ?? []).join("|"),
      color,
      m?.growthVelocityKgPerMonth?.toFixed(3) ?? "",
      v.notes ?? "",
      v.doctorAdvice ?? "",
      v.vaccinationStatus ?? "",
      v.nextVisitDue?.toISOString().slice(0, 10) ?? "",
    ].map(csvEscape);
    lines.push(row.join(","));
  }

  return lines.join("\n");
}

function drawColorLegend(
  doc: jsPDF,
  x: number,
  y: number,
): number {
  const items: Array<{ label: string; key: "green" | "orange" | "red" }> = [
    { label: "Green = Normal", key: "green" },
    { label: "Orange = Watch / mild–moderate", key: "orange" },
    { label: "Red = Severe risk", key: "red" },
  ];
  doc.setFontSize(8);
  let cx = x;
  for (const item of items) {
    const [r, g, b] = SEVERITY_RGB[item.key];
    doc.setFillColor(r, g, b);
    doc.rect(cx, y - 6, 8, 8, "F");
    doc.setTextColor(40);
    doc.text(item.label, cx + 11, y);
    cx += doc.getTextWidth(item.label) + 28;
  }
  return y + 14;
}

function drawStatusPill(
  doc: jsPDF,
  text: string,
  x: number,
  y: number,
  color: "green" | "orange" | "red",
) {
  const [r, g, b] = SEVERITY_RGB[color];
  const w = Math.max(56, doc.getTextWidth(text) + 14);
  doc.setFillColor(r, g, b);
  doc.roundedRect(x, y - 9, w, 14, 3, 3, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(8);
  doc.text(text, x + 7, y);
  doc.setTextColor(0);
}

/**
 * Draw a color-banded growth chart (percentile zones + patient trend).
 */
function drawColorChart(
  doc: jsPDF,
  series: ChartSeries,
  title: string,
  originX: number,
  originY: number,
  width: number,
  height: number,
) {
  const curves = Object.fromEntries(
    series.curves.map((c) => [c.percentile, c.points]),
  ) as Record<string, Array<{ x: number; y: number | null }>>;

  const p3 = (curves.p3 ?? []).filter((p) => p.y != null) as Array<{
    x: number;
    y: number;
  }>;
  const p15 = (curves.p15 ?? []).filter((p) => p.y != null) as Array<{
    x: number;
    y: number;
  }>;
  const p50 = (curves.p50 ?? []).filter((p) => p.y != null) as Array<{
    x: number;
    y: number;
  }>;
  const p85 = (curves.p85 ?? []).filter((p) => p.y != null) as Array<{
    x: number;
    y: number;
  }>;
  const p97 = (curves.p97 ?? []).filter((p) => p.y != null) as Array<{
    x: number;
    y: number;
  }>;
  const patient = series.patientPoints.filter(
    (p) => p.y != null,
  ) as Array<{
    x: number;
    y: number;
    severityColor?: string;
  }>;

  if (!p50.length && !patient.length) {
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(`${title}: no chart data`, originX, originY + 12);
    doc.setTextColor(0);
    return;
  }

  const xs = [
    ...p3.map((p) => p.x),
    ...p97.map((p) => p.x),
    ...patient.map((p) => p.x),
  ];
  const ys = [
    ...p3.map((p) => p.y),
    ...p97.map((p) => p.y),
    ...p50.map((p) => p.y),
    ...patient.map((p) => p.y),
  ];
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys) * 0.92;
  const maxY = Math.max(...ys) * 1.08;
  const spanX = Math.max(maxX - minX, 1e-6);
  const spanY = Math.max(maxY - minY, 1e-6);

  const plotX = originX;
  const plotY = originY + 16;
  const plotW = width;
  const plotH = height - 16;

  const sx = (x: number) => plotX + ((x - minX) / spanX) * plotW;
  const sy = (y: number) => plotY + plotH - ((y - minY) / spanY) * plotH;

  doc.setFontSize(10);
  doc.setTextColor(20);
  doc.text(title, originX, originY + 8);

  // Frame
  doc.setDrawColor(180);
  doc.setLineWidth(0.4);
  doc.rect(plotX, plotY, plotW, plotH);

  const n = Math.min(p3.length, p15.length, p85.length, p97.length);
  // Draw vertical slices as colored bands between percentiles
  for (let i = 0; i < n - 1; i++) {
    const a3 = p3[i]!;
    const b3 = p3[i + 1]!;
    const a15 = p15[i]!;
    const b15 = p15[i + 1]!;
    const a85 = p85[i]!;
    const b85 = p85[i + 1]!;
    const a97 = p97[i]!;
    const b97 = p97[i + 1]!;

    // Orange: p3–p15
    doc.setFillColor(255, 220, 190);
    doc.triangle(sx(a3.x), sy(a3.y), sx(b3.x), sy(b3.y), sx(a15.x), sy(a15.y), "F");
    doc.triangle(sx(b3.x), sy(b3.y), sx(b15.x), sy(b15.y), sx(a15.x), sy(a15.y), "F");

    // Green: p15–p85
    doc.setFillColor(200, 235, 210);
    doc.triangle(sx(a15.x), sy(a15.y), sx(b15.x), sy(b15.y), sx(a85.x), sy(a85.y), "F");
    doc.triangle(sx(b15.x), sy(b15.y), sx(b85.x), sy(b85.y), sx(a85.x), sy(a85.y), "F");

    // Orange: p85–p97
    doc.setFillColor(255, 220, 190);
    doc.triangle(sx(a85.x), sy(a85.y), sx(b85.x), sy(b85.y), sx(a97.x), sy(a97.y), "F");
    doc.triangle(sx(b85.x), sy(b85.y), sx(b97.x), sy(b97.y), sx(a97.x), sy(a97.y), "F");
  }

  function strokeCurve(
    pts: Array<{ x: number; y: number }>,
    rgb: [number, number, number],
    widthPt = 0.8,
  ) {
    if (pts.length < 2) return;
    doc.setDrawColor(...rgb);
    doc.setLineWidth(widthPt);
    for (let i = 0; i < pts.length - 1; i++) {
      doc.line(sx(pts[i]!.x), sy(pts[i]!.y), sx(pts[i + 1]!.x), sy(pts[i + 1]!.y));
    }
  }

  strokeCurve(p3, SEVERITY_RGB.red, 0.7);
  strokeCurve(p15, SEVERITY_RGB.orange, 0.7);
  strokeCurve(p50, [11, 79, 108], 1.2);
  strokeCurve(p85, SEVERITY_RGB.orange, 0.7);
  strokeCurve(p97, SEVERITY_RGB.red, 0.7);

  // Patient trend
  if (patient.length >= 2) {
    doc.setDrawColor(11, 79, 108);
    doc.setLineWidth(1.3);
    for (let i = 0; i < patient.length - 1; i++) {
      doc.line(
        sx(patient[i]!.x),
        sy(patient[i]!.y),
        sx(patient[i + 1]!.x),
        sy(patient[i + 1]!.y),
      );
    }
  }

  for (const pt of patient) {
    const color = toTrafficLight(
      (pt.severityColor as "green" | "orange" | "red" | "yellow") ?? "green",
    );
    const [r, g, b] = SEVERITY_RGB[color];
    doc.setFillColor(r, g, b);
    doc.circle(sx(pt.x), sy(pt.y), 2.6, "F");
  }

  doc.setTextColor(0);
  doc.setDrawColor(0);
}

export async function buildPatientPdf(
  humanPatientId: string,
): Promise<Buffer> {
  const patient = await prisma.patient.findUnique({
    where: { patientId: humanPatientId },
    include: {
      visits: {
        orderBy: [{ visitDate: "asc" }, { createdAt: "asc" }],
        include: { measurements: true },
      },
    },
  });

  if (!patient) {
    throw Object.assign(new Error("Patient not found"), { status: 404 });
  }

  const alerts = await getAlerts(humanPatientId);
  const chartPayload = await buildChartPayload(humanPatientId);
  const appName =
    process.env.NEXT_PUBLIC_APP_NAME || "Dr. Chaitanya Growth Monitor";

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;

  doc.setFontSize(16);
  doc.setTextColor(11, 79, 108);
  doc.text(appName, margin, y);
  y += 20;

  doc.setFontSize(12);
  doc.setTextColor(0);
  doc.text("Pediatric Growth Monitoring Report", margin, y);
  y += 16;

  y = drawColorLegend(doc, margin, y);

  doc.setFontSize(10);
  const summaryLines = [
    `Patient ID: ${patient.patientId}`,
    `Name: ${patient.name}`,
    `Sex: ${patient.sex}`,
    `Date of Birth: ${patient.dateOfBirth.toISOString().slice(0, 10)}`,
    `Parent: ${patient.parentName}`,
    `Mobile: ${patient.mobileNumber}`,
    patient.email ? `Email: ${patient.email}` : null,
    patient.address ? `Address: ${patient.address}` : null,
    patient.birthWeightKg != null
      ? `Birth weight: ${patient.birthWeightKg} kg`
      : null,
  ].filter(Boolean) as string[];

  for (const line of summaryLines) {
    doc.text(line, margin, y);
    y += 13;
  }

  // Latest status pill
  const latest = patient.visits[patient.visits.length - 1];
  const lm = latest?.measurements[0];
  if (lm) {
    y += 4;
    const traffic = severityFromStatus(lm.nutritionalStatus, lm.clinicalFlags);
    doc.setFontSize(10);
    doc.text("Latest nutrition status:", margin, y);
    drawStatusPill(doc, lm.nutritionalStatus, margin + 120, y, traffic);
    y += 18;
  }

  y += 6;
  doc.setFontSize(12);
  doc.text("Visit history (color-coded status)", margin, y);
  y += 8;

  autoTable(doc, {
    startY: y,
    head: [
      [
        "Date",
        "Age (m)",
        "Wt",
        "Ht",
        "BMI",
        "WAZ",
        "HAZ",
        "BMIZ",
        "Status",
      ],
    ],
    body: patient.visits.map((v) => {
      const m = v.measurements[0];
      return [
        v.visitDate.toISOString().slice(0, 10),
        v.ageTotalMonths.toFixed(1),
        v.weightKg != null ? v.weightKg.toFixed(2) : "—",
        v.heightCm != null ? v.heightCm.toFixed(1) : "—",
        v.bmi != null ? v.bmi.toFixed(1) : "—",
        m?.weightForAgeZ?.toFixed(2) ?? "—",
        m?.heightForAgeZ?.toFixed(2) ?? "—",
        m?.bmiForAgeZ?.toFixed(2) ?? "—",
        m?.nutritionalStatus ?? "—",
      ];
    }),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [11, 79, 108], textColor: 255 },
    margin: { left: margin, right: margin },
    didParseCell: (data) => {
      if (data.section !== "body") return;
      // Status column
      if (data.column.index === 8) {
        const status = String(data.cell.raw ?? "");
        const color = severityFromStatus(status);
        const [r, g, b] = SEVERITY_RGB[color];
        data.cell.styles.fillColor = [r, g, b];
        data.cell.styles.textColor = [255, 255, 255];
        data.cell.styles.fontStyle = "bold";
        return;
      }
      // WAZ / HAZ / BMIZ columns (5,6,7)
      if (data.column.index >= 5 && data.column.index <= 7) {
        const raw = String(data.cell.raw ?? "");
        if (raw === "—" || raw === "") return;
        const z = Number(raw);
        if (!Number.isFinite(z)) return;
        const color = toTrafficLight(severityFromZ(z));
        const [r, g, b] = SEVERITY_RGB[color];
        data.cell.styles.textColor = [r, g, b];
        data.cell.styles.fontStyle = "bold";
      }
    },
  });

  // Color Z-score cells lightly by |Z|
  // (handled above for Status; add second pass via didParse for WAZ/HAZ/BMIZ)
  // Re-run not needed — enhance with another didParse in same call:
  // Actually combine into one didParseCell:

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = ((doc as any).lastAutoTable?.finalY ?? y) + 18;

  doc.setFontSize(12);
  doc.text("Z-scores & interpretation", margin, y);
  y += 14;
  doc.setFontSize(9);

  if (lm) {
    const zRows: Array<{ label: string; z: number | null | undefined }> = [
      { label: "WAZ", z: lm.weightForAgeZ },
      { label: "HAZ", z: lm.heightForAgeZ },
      { label: "BMIZ", z: lm.bmiForAgeZ },
      { label: "WHZ", z: lm.weightForHeightZ },
      { label: "HCZ", z: lm.hcForAgeZ },
    ];

    for (const row of zRows) {
      if (y > 760) {
        doc.addPage();
        y = margin;
      }
      const traffic = toTrafficLight(severityFromZ(row.z));
      const [r, g, b] = SEVERITY_RGB[traffic];
      doc.setFillColor(r, g, b);
      doc.circle(margin + 4, y - 2, 3.5, "F");
      doc.setTextColor(0);
      const pct =
        row.label === "WAZ"
          ? lm.weightForAgePercentile
          : row.label === "HAZ"
            ? lm.heightForAgePercentile
            : row.label === "BMIZ"
              ? lm.bmiForAgePercentile
              : null;
      const line = `${row.label}: ${row.z?.toFixed(2) ?? "—"} (P${pct?.toFixed(0) ?? "—"}) · ${traffic.toUpperCase()}`;
      doc.text(line, margin + 12, y);
      y += 12;
    }

    y += 4;
    doc.setTextColor(0);
    const extras = [
      `Reference: ${lm.referenceSource} ${lm.referenceVersion}`,
      lm.clinicalFlags?.length
        ? `Flags: ${lm.clinicalFlags.join(", ")}`
        : null,
      lm.expectedWeightKg != null
        ? `Expected weight (M): ${lm.expectedWeightKg.toFixed(2)} kg`
        : null,
      lm.expectedHeightCm != null
        ? `Expected height (M): ${lm.expectedHeightCm.toFixed(1)} cm`
        : null,
      latest?.doctorAdvice ? `Doctor advice: ${latest.doctorAdvice}` : null,
      latest?.notes ? `Notes: ${latest.notes}` : null,
    ].filter(Boolean) as string[];

    for (const line of extras) {
      if (y > 760) {
        doc.addPage();
        y = margin;
      }
      const wrapped = doc.splitTextToSize(line, 515);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 12;
    }
  } else {
    doc.text("No growth measurements available.", margin, y);
    y += 14;
  }

  if (alerts.length) {
    y += 10;
    if (y > 720) {
      doc.addPage();
      y = margin;
    }
    doc.setFontSize(12);
    doc.text("Clinical alerts", margin, y);
    y += 14;
    doc.setFontSize(9);
    for (const a of alerts) {
      if (y > 760) {
        doc.addPage();
        y = margin;
      }
      const traffic =
        a.severity === "critical"
          ? "red"
          : a.severity === "warning"
            ? "orange"
            : "green";
      const [r, g, b] = SEVERITY_RGB[traffic];
      doc.setFillColor(r, g, b);
      doc.roundedRect(margin, y - 9, 52, 12, 2, 2, "F");
      doc.setTextColor(255);
      doc.text(traffic.toUpperCase(), margin + 6, y);
      doc.setTextColor(0);
      const line = `${a.type}: ${a.message}`;
      const wrapped = doc.splitTextToSize(line, 450);
      doc.text(wrapped, margin + 58, y);
      y += Math.max(14, wrapped.length * 12);
    }
  }

  // Color-coded charts page
  doc.addPage();
  y = margin;
  doc.setFontSize(13);
  doc.setTextColor(11, 79, 108);
  doc.text("Growth charts (Green / Orange / Red zones)", margin, y);
  y += 12;
  doc.setTextColor(0);
  y = drawColorLegend(doc, margin, y);
  y += 4;

  const chartH = 170;
  const chartW = 515;

  drawColorChart(
    doc,
    chartPayload.charts.WFA,
    "Weight vs Age",
    margin,
    y,
    chartW,
    chartH,
  );
  y += chartH + 18;

  drawColorChart(
    doc,
    chartPayload.charts.HFA,
    "Height vs Age",
    margin,
    y,
    chartW,
    chartH,
  );
  y += chartH + 18;

  if (y + chartH > 780) {
    doc.addPage();
    y = margin;
  }

  drawColorChart(
    doc,
    chartPayload.charts.BMI,
    "BMI vs Age",
    margin,
    y,
    chartW,
    chartH,
  );

  y += chartH + 20;
  if (y > 760) {
    doc.addPage();
    y = margin;
  }
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(
    `Generated ${new Date().toISOString()} · Confidential medical record · Zones: Green P15–P85, Orange P3–P15/P85–P97, Red <P3/>P97`,
    margin,
    y,
  );

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
