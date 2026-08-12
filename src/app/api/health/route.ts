import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      service: "growth-monitor",
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("GET /api/health", err);
    return NextResponse.json(
      {
        status: "degraded",
        service: "growth-monitor",
        database: "unavailable",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
