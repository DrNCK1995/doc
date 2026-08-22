import type { DashboardModuleRow, HealthChecks, ScreenStatus } from "./types";

function screenRow(
  status: ScreenStatus,
  okText = "OK",
): Pick<DashboardModuleRow, "tone" | "statusText" | "showDot"> {
  if (status === "ok") return { tone: "ok", statusText: okText, showDot: true };
  if (status === "concern")
    return { tone: "watch", statusText: "Concern", showDot: true };
  return { tone: "due", statusText: "Not screened", showDot: false };
}

export function buildModuleRows(data: {
  nutritionLabel: string;
  nutritionGaps: number;
  includeNutrition: boolean;
  includeDevelopment: boolean;
  developmentOk: boolean;
  developmentNeeds: boolean;
  adhd: boolean;
  autism: boolean;
  checks: HealthChecks;
  illnessCount: number;
}): DashboardModuleRow[] {
  const growthWatch =
    data.nutritionLabel.includes("undernutrition") ||
    data.nutritionLabel.includes("overweight") ||
    data.nutritionLabel.includes("Low BMI") ||
    data.nutritionLabel.includes("Obesity");
  const growthBad =
    data.nutritionLabel.includes("severe") || data.nutritionLabel.includes("Severe");

  let growth: Pick<DashboardModuleRow, "tone" | "statusText" | "showDot"> = {
    tone: "ok",
    statusText: "On track",
    showDot: true,
  };
  if (growthBad)
    growth = { tone: "watch", statusText: "Review now", showDot: true };
  else if (growthWatch)
    growth = { tone: "watch", statusText: "Watch", showDot: true };

  let development: Pick<DashboardModuleRow, "tone" | "statusText" | "showDot"> = {
    tone: "ok",
    statusText: "Typical",
    showDot: true,
  };
  if (!data.includeDevelopment)
    development = { tone: "empty", statusText: "Not included", showDot: false };
  else if (data.adhd || data.autism)
    development = { tone: "watch", statusText: "Assess", showDot: true };
  else if (data.developmentNeeds)
    development = { tone: "watch", statusText: "Review", showDot: true };

  const vaxDue = Math.max(0, data.checks.vaccinesDue);
  const vaccination: Pick<DashboardModuleRow, "tone" | "statusText" | "showDot"> =
    vaxDue > 0
      ? { tone: "watch", statusText: `${vaxDue} due`, showDot: true }
      : { tone: "ok", statusText: "Enrol / track", showDot: true };

  const nutrition: Pick<DashboardModuleRow, "tone" | "statusText" | "showDot"> =
    !data.includeNutrition
      ? { tone: "empty", statusText: "Not included", showDot: false }
      : data.nutritionGaps > 0
        ? {
            tone: "watch",
            statusText: `${data.nutritionGaps} gap${data.nutritionGaps === 1 ? "" : "s"}`,
            showDot: true,
          }
        : { tone: "ok", statusText: "On track", showDot: true };

  const dental =
    data.checks.dental === "ok"
      ? { tone: "ok" as const, statusText: "OK", showDot: true }
      : data.checks.dental === "due"
        ? { tone: "due" as const, statusText: "Due", showDot: false }
        : { tone: "due" as const, statusText: "Not screened", showDot: false };

  const labs =
    data.checks.labs === "done"
      ? { tone: "ok" as const, statusText: "Done", showDot: true }
      : data.checks.labs === "pending"
        ? { tone: "watch" as const, statusText: "Pending", showDot: true }
        : { tone: "empty" as const, statusText: "—", showDot: false };

  const episodes = Math.max(data.checks.illnessEpisodes, data.illnessCount);

  return [
    { id: "growth", label: "Growth", href: "#dash-growth", accent: "#34d399", ...growth },
    { id: "development", label: "Development", href: "#dash-development", accent: "#60a5fa", ...development },
    { id: "vaccination", label: "Vaccination", href: "#dash-vaccination", accent: "#fbbf24", ...vaccination },
    { id: "nutrition", label: "Nutrition", href: "#dash-nutrition", accent: "#a3e635", ...nutrition },
    { id: "vision", label: "Vision", href: "#dash-checks", accent: "#22d3ee", ...screenRow(data.checks.vision) },
    { id: "hearing", label: "Hearing", href: "#dash-checks", accent: "#c084fc", ...screenRow(data.checks.hearing) },
    { id: "dental", label: "Dental", href: "#dash-checks", accent: "#fb7185", ...dental },
    { id: "labs", label: "Labs", href: "#dash-checks", accent: "#94a3b8", ...labs },
    {
      id: "illness",
      label: "Illness history",
      href: "#dash-illness",
      accent: "#fb923c",
      tone: episodes > 0 ? "info" : "empty",
      statusText: episodes > 0 ? `${episodes} episode${episodes === 1 ? "" : "s"}` : "None noted",
      showDot: false,
    },
    {
      id: "next",
      label: "Next visit",
      href: "#dash-checks",
      accent: "#2dd4bf",
      tone: data.checks.nextVisit.trim() ? "info" : "empty",
      statusText: formatVisitDate(data.checks.nextVisit) || "Not set",
      showDot: false,
    },
    {
      id: "dosage",
      label: "Common drugs",
      href: "#dash-dosage",
      accent: "#f472b6",
      tone: "ok",
      statusText: "Ready",
      showDot: true,
    },
  ];
}

export function emptyHealthChecks(): HealthChecks {
  return {
    vision: "not_screened",
    hearing: "not_screened",
    dental: "not_screened",
    labs: "none",
    vaccinesDue: 0,
    illnessEpisodes: 0,
    nextVisit: "",
  };
}

export function formatVisitDate(iso: string): string {
  const trimmed = iso.trim();
  if (!trimmed) return "";
  const d = new Date(`${trimmed}T00:00:00`);
  if (Number.isNaN(d.getTime())) return trimmed;
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short" });
}
