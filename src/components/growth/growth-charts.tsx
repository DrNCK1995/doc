"use client";

import * as React from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Scatter,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  SEVERITY_HEX,
  ZONE_FILL,
  toTrafficLight,
} from "@/lib/growth/severity-colors";
import type { ChartPayload, ChartSeries } from "@/types/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CURVE_COLORS: Record<string, string> = {
  p3: SEVERITY_HEX.red,
  p15: SEVERITY_HEX.orange,
  p50: "#0b4f6c",
  p85: SEVERITY_HEX.orange,
  p97: SEVERITY_HEX.red,
};

type GrowthChartsProps = {
  payload: ChartPayload;
};

type MergedRow = {
  x: number;
  patient?: number | null;
  p3?: number | null;
  p15?: number | null;
  p50?: number | null;
  p85?: number | null;
  p97?: number | null;
  /** Stacked zone heights (from y=0). */
  zoneRedLow?: number | null;
  zoneOrangeLow?: number | null;
  zoneGreen?: number | null;
  zoneOrangeHigh?: number | null;
};

function mergeSeries(series: ChartSeries): MergedRow[] {
  const map = new Map<number, MergedRow>();

  for (const curve of series.curves) {
    for (const pt of curve.points) {
      if (pt.y == null) continue;
      const row = map.get(pt.x) ?? { x: pt.x };
      row[curve.percentile] = pt.y;
      map.set(pt.x, row);
    }
  }

  for (const pt of series.patientPoints) {
    if (pt.y == null) continue;
    // Snap patient onto nearest curve x when needed, else own x
    const row = map.get(pt.x) ?? { x: pt.x };
    row.patient = pt.y;
    map.set(pt.x, row);
  }

  const rows = Array.from(map.values()).sort((a, b) => a.x - b.x);

  for (const row of rows) {
    const p3 = row.p3;
    const p15 = row.p15;
    const p85 = row.p85;
    const p97 = row.p97;
    if (p3 != null && p15 != null && p85 != null && p97 != null) {
      row.zoneRedLow = p3;
      row.zoneOrangeLow = Math.max(0, p15 - p3);
      row.zoneGreen = Math.max(0, p85 - p15);
      row.zoneOrangeHigh = Math.max(0, p97 - p85);
    }
  }

  return rows;
}

function ColorLegend() {
  const items = [
    { label: "Normal (P15–P85)", color: SEVERITY_HEX.green },
    { label: "Watch (P3–P15 / P85–P97)", color: SEVERITY_HEX.orange },
    { label: "Risk (<P3 / >P97)", color: SEVERITY_HEX.red },
  ];
  return (
    <div className="mb-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
      {items.map((item) => (
        <span key={item.label} className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-2.5 w-2.5 rounded-sm"
            style={{ background: item.color }}
            aria-hidden
          />
          {item.label}
        </span>
      ))}
    </div>
  );
}

function PatientDot(props: {
  cx?: number;
  cy?: number;
  payload?: { x?: number };
  series: ChartSeries;
}) {
  const { cx, cy, payload, series } = props;
  if (cx == null || cy == null || payload?.x == null) return null;
  const pt = series.patientPoints.find(
    (p) => p.y != null && Math.abs(p.x - payload.x!) < 1e-6,
  );
  const color =
    SEVERITY_HEX[
      toTrafficLight(pt?.severityColor ?? "green")
    ];
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={6}
        fill={color}
        stroke="#fff"
        strokeWidth={2}
      />
      <circle cx={cx} cy={cy} r={2.5} fill="#fff" />
    </g>
  );
}

function SingleChart({
  title,
  series,
}: {
  title: string;
  series: ChartSeries;
}) {
  const data = React.useMemo(() => mergeSeries(series), [series]);
  const hasCurves = series.curves.some((c) => c.points.length > 0);
  const hasPatient = series.patientPoints.some((p) => p.y != null);
  const hasZones = data.some((d) => d.zoneGreen != null);

  if (!hasCurves && !hasPatient) {
    return (
      <Card className="chart-print-block">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            No data available for this chart yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="chart-print-block">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">{title}</CardTitle>
        <p className="text-xs text-muted-foreground">
          {series.referenceSource} {series.referenceVersion} · {series.xLabel}{" "}
          vs {series.yLabel}
        </p>
      </CardHeader>
      <CardContent>
        {hasZones ? <ColorLegend /> : null}
        <div className="h-72 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 8, right: 12, left: 0, bottom: 8 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis
                dataKey="x"
                type="number"
                domain={["dataMin", "dataMax"]}
                tick={{ fontSize: 11 }}
                label={{
                  value: series.xLabel,
                  position: "insideBottom",
                  offset: -2,
                  fontSize: 11,
                }}
              />
              <YAxis
                tick={{ fontSize: 11 }}
                domain={["auto", "auto"]}
                label={{
                  value: series.yLabel,
                  angle: -90,
                  position: "insideLeft",
                  fontSize: 11,
                }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  border: "1px solid var(--border)",
                  borderRadius: 8,
                  fontSize: 12,
                }}
                formatter={(value: number | string, name: string) => {
                  if (
                    typeof name === "string" &&
                    name.startsWith("zone")
                  ) {
                    return [null, null];
                  }
                  return [value, name];
                }}
              />
              <Legend
                wrapperStyle={{ fontSize: 12 }}
                payload={[
                  { value: "P3", type: "line", color: CURVE_COLORS.p3 },
                  { value: "P15", type: "line", color: CURVE_COLORS.p15 },
                  { value: "P50", type: "line", color: CURVE_COLORS.p50 },
                  { value: "P85", type: "line", color: CURVE_COLORS.p85 },
                  { value: "P97", type: "line", color: CURVE_COLORS.p97 },
                  {
                    value: "Patient",
                    type: "circle",
                    color: SEVERITY_HEX.green,
                  },
                ]}
              />

              {hasZones ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="zoneRedLow"
                    stackId="zones"
                    stroke="none"
                    fill={ZONE_FILL.red}
                    name="Below P3"
                    legendType="none"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="zoneOrangeLow"
                    stackId="zones"
                    stroke="none"
                    fill={ZONE_FILL.orange}
                    name="P3–P15"
                    legendType="none"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="zoneGreen"
                    stackId="zones"
                    stroke="none"
                    fill={ZONE_FILL.green}
                    name="P15–P85"
                    legendType="none"
                    isAnimationActive={false}
                  />
                  <Area
                    type="monotone"
                    dataKey="zoneOrangeHigh"
                    stackId="zones"
                    stroke="none"
                    fill={ZONE_FILL.orange}
                    name="P85–P97"
                    legendType="none"
                    isAnimationActive={false}
                  />
                </>
              ) : null}

              {(["p3", "p15", "p50", "p85", "p97"] as const).map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key.toUpperCase()}
                  stroke={CURVE_COLORS[key]}
                  strokeWidth={key === "p50" ? 2.25 : 1.4}
                  strokeDasharray={key === "p50" ? undefined : "4 3"}
                  dot={false}
                  connectNulls
                  isAnimationActive={false}
                  legendType="none"
                />
              ))}

              <Line
                type="monotone"
                dataKey="patient"
                name="Patient"
                stroke="#0b4f6c"
                strokeWidth={2.25}
                dot={false}
                connectNulls
                isAnimationActive={false}
                legendType="none"
              />
              <Scatter
                dataKey="patient"
                name="Patient points"
                legendType="none"
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                shape={(props: any) => (
                  <PatientDot {...props} series={series} />
                )}
                isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

export function GrowthCharts({ payload }: GrowthChartsProps) {
  const charts = [
    { key: "WFA", title: "Weight vs Age", series: payload.charts.WFA },
    { key: "HFA", title: "Height vs Age", series: payload.charts.HFA },
    { key: "BMI", title: "BMI vs Age", series: payload.charts.BMI },
    { key: "WFH", title: "Weight vs Height", series: payload.charts.WFH },
    { key: "HC", title: "Head Circumference vs Age", series: payload.charts.HC },
    {
      key: "velocity",
      title: "Growth Velocity",
      series: payload.charts.velocity,
    },
  ] as const;

  return (
    <div className="grid gap-6">
      {charts.map((c) => (
        <SingleChart key={c.key} title={c.title} series={c.series} />
      ))}
    </div>
  );
}
