"use client";

import * as React from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { ChartPayload, ChartSeries } from "@/types/charts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CURVE_COLORS: Record<string, string> = {
  p3: "var(--chart-p3)",
  p15: "var(--chart-p15)",
  p50: "var(--chart-p50)",
  p85: "var(--chart-p85)",
  p97: "var(--chart-p97)",
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
    const row = map.get(pt.x) ?? { x: pt.x };
    row.patient = pt.y;
    map.set(pt.x, row);
  }

  return Array.from(map.values()).sort((a, b) => a.x - b.x);
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
        <div className="h-72 w-full sm:h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
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
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              {(["p3", "p15", "p50", "p85", "p97"] as const).map((key) => (
                <Line
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={key.toUpperCase()}
                  stroke={CURVE_COLORS[key]}
                  strokeWidth={key === "p50" ? 2.25 : 1.25}
                  strokeDasharray={key === "p50" ? undefined : "4 3"}
                  dot={false}
                  connectNulls
                  isAnimationActive={false}
                />
              ))}
              <Line
                type="monotone"
                dataKey="patient"
                name="Patient"
                stroke="var(--chart-patient)"
                strokeWidth={2.5}
                dot={{ r: 4, fill: "var(--chart-patient)" }}
                activeDot={{ r: 6 }}
                connectNulls
                isAnimationActive={false}
              />
            </LineChart>
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
