"use client";

import {
  Apple,
  CalendarDays,
  Ear,
  Eye,
  FlaskConical,
  LineChart,
  Pill,
  Puzzle,
  Smile,
  Stethoscope,
  Syringe,
} from "lucide-react";
import type { DashboardModuleRow, ModuleTone } from "@/lib/dashboard/types";
import { cn } from "@/lib/utils/cn";

const ICONS = {
  growth: LineChart,
  development: Puzzle,
  vaccination: Syringe,
  nutrition: Apple,
  vision: Eye,
  hearing: Ear,
  dental: Smile,
  labs: FlaskConical,
  illness: Stethoscope,
  next: CalendarDays,
  dosage: Pill,
} as const;

function dotClass(tone: ModuleTone): string {
  if (tone === "ok") return "bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.7)]";
  if (tone === "watch") return "bg-amber-300 shadow-[0_0_12px_rgba(251,191,36,0.7)]";
  if (tone === "due") return "bg-orange-400";
  return "bg-white/30";
}

type ModuleStatusBoardProps = {
  childName: string;
  ageLabel: string;
  modules: DashboardModuleRow[];
};

export function ModuleStatusBoard({
  childName,
  ageLabel,
  modules,
}: ModuleStatusBoardProps) {
  return (
    <section
      aria-label="Module status"
      className="relative overflow-hidden rounded-3xl px-5 py-6 text-white sm:px-7 sm:py-8"
      style={{
        background:
          "linear-gradient(165deg, #04121c 0%, #0b2a3a 42%, #123024 72%, #1a2038 100%)",
      }}
    >
      <div
        className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full opacity-40 blur-3xl"
        style={{ background: "#2dd4bf" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-16 left-10 h-48 w-48 rounded-full opacity-30 blur-3xl"
        style={{ background: "#fb923c" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute right-1/3 top-1/2 h-32 w-32 rounded-full opacity-25 blur-3xl"
        style={{ background: "#60a5fa" }}
        aria-hidden
      />

      <p className="relative text-center text-sm font-medium tracking-wide text-white/80">
        Child Health Dashboard
      </p>
      <p className="relative mt-3 text-center font-display text-2xl font-semibold sm:text-3xl">
        Child: {childName}{" "}
        <span className="text-white/70">| {ageLabel}</span>
      </p>

      <div className="relative mx-auto mt-8 max-w-lg">
        <div className="grid grid-cols-[1fr_auto] px-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/55">
          <span>Module</span>
          <span>Status</span>
        </div>
        <ul className="mt-2">
          {modules.map((row, i) => {
            const Icon = ICONS[row.id as keyof typeof ICONS] ?? LineChart;
            return (
              <li key={row.id}>
                <a
                  href={row.href}
                  className="grid grid-cols-[1fr_auto] items-center gap-3 border-t border-white/15 py-3.5 transition-transform duration-200 hover:translate-x-0.5"
                >
                  <span className="flex items-center gap-3">
                    <span
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-[#04121c] transition-transform duration-200 hover:scale-105"
                      style={{
                        background: row.accent,
                        animationDelay: `${i * 40}ms`,
                      }}
                    >
                      <Icon className="h-5 w-5" aria-hidden />
                    </span>
                    <span className="text-base font-medium">{row.label}</span>
                  </span>
                  <span className="flex items-center justify-end gap-2 text-right text-sm">
                    {row.showDot ? (
                      <span
                        className={cn("h-3.5 w-3.5 rounded-full", dotClass(row.tone))}
                        aria-hidden
                      />
                    ) : null}
                    <span className={row.tone === "empty" ? "text-white/50" : "text-white"}>
                      {row.statusText}
                    </span>
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
