import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { prisma } from "@/lib/db/prisma";
import { getAlerts } from "@/lib/services/visit-service";

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
    "growthVelocityKgPerMonth",
    "notes",
    "doctorAdvice",
    "vaccinationStatus",
    "nextVisitDue",
  ];

  const lines = [headers.join(",")];

  for (const v of patient.visits) {
    const m = v.measurements[0];
    const row = [
      v.visitDate.toISOString().slice(0, 10),
      v.ageYears,
      v.ageMonths,
      v.ageDays,
      v.ageTotalMonths.toFixed(2),
      v.weightKg,
      v.heightCm,
      v.bmi.toFixed(2),
      v.headCircumferenceCm ?? "",
      m?.weightForAgeZ?.toFixed(2) ?? "",
      m?.heightForAgeZ?.toFixed(2) ?? "",
      m?.bmiForAgeZ?.toFixed(2) ?? "",
      m?.weightForHeightZ?.toFixed(2) ?? "",
      m?.hcForAgeZ?.toFixed(2) ?? "",
      m?.nutritionalStatus ?? "",
      (m?.clinicalFlags ?? []).join("|"),
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
  const appName =
    process.env.NEXT_PUBLIC_APP_NAME || "Dr. Chaitanya Growth Monitor";

  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 40;
  let y = margin;

  doc.setFontSize(16);
  doc.text(appName, margin, y);
  y += 22;

  doc.setFontSize(12);
  doc.text("Pediatric Growth Monitoring Report", margin, y);
  y += 20;

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
    y += 14;
  }

  y += 8;
  doc.setFontSize(12);
  doc.text("Visit history", margin, y);
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
        v.weightKg.toFixed(2),
        v.heightCm.toFixed(1),
        v.bmi.toFixed(1),
        m?.weightForAgeZ?.toFixed(2) ?? "—",
        m?.heightForAgeZ?.toFixed(2) ?? "—",
        m?.bmiForAgeZ?.toFixed(2) ?? "—",
        m?.nutritionalStatus ?? "—",
      ];
    }),
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [30, 90, 120] },
    margin: { left: margin, right: margin },
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  y = ((doc as any).lastAutoTable?.finalY ?? y) + 20;

  doc.setFontSize(12);
  doc.text("Z-scores & interpretation", margin, y);
  y += 14;
  doc.setFontSize(9);

  const latest = patient.visits[patient.visits.length - 1];
  const lm = latest?.measurements[0];
  if (lm) {
    const interp = [
      `Reference: ${lm.referenceSource} ${lm.referenceVersion}`,
      `WAZ: ${lm.weightForAgeZ?.toFixed(2) ?? "—"} (P${lm.weightForAgePercentile?.toFixed(0) ?? "—"})`,
      `HAZ: ${lm.heightForAgeZ?.toFixed(2) ?? "—"} (P${lm.heightForAgePercentile?.toFixed(0) ?? "—"})`,
      `BMIZ: ${lm.bmiForAgeZ?.toFixed(2) ?? "—"} (P${lm.bmiForAgePercentile?.toFixed(0) ?? "—"})`,
      `WHZ: ${lm.weightForHeightZ?.toFixed(2) ?? "—"}`,
      `HCZ: ${lm.hcForAgeZ?.toFixed(2) ?? "—"}`,
      `Status: ${lm.nutritionalStatus}`,
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

    for (const line of interp) {
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
      const line = `[${a.severity.toUpperCase()}] ${a.type}: ${a.message}`;
      const wrapped = doc.splitTextToSize(line, 515);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 12;
    }
  }

  y += 16;
  if (y > 760) {
    doc.addPage();
    y = margin;
  }
  doc.setFontSize(8);
  doc.setTextColor(100);
  doc.text(
    `Generated ${new Date().toISOString()} · Confidential medical record`,
    margin,
    y,
  );

  const arrayBuffer = doc.output("arraybuffer");
  return Buffer.from(arrayBuffer);
}
