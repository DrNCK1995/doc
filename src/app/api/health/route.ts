import { NextResponse } from "next/server";
import { prisma } from "@/lib/db/prisma";
import { resolveDatabaseUrls } from "@/lib/db/resolve-database-url";

export async function GET() {
  const { host } = resolveDatabaseUrls(process.env);
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "ok",
      service: "growth-monitor",
      database: "connected",
      storage: "postgresql",
      dbHost: host,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error("GET /api/health", err);
    const local =
      !host || host === "127.0.0.1" || host === "localhost";
    return NextResponse.json(
      {
        status: "degraded",
        service: "growth-monitor",
        database: "unavailable",
        dbHost: host,
        hint: local
          ? "Vercel DATABASE_URL still points to localhost. Delete it in Project → Settings → Environment Variables, reconnect Neon or Prisma Postgres Storage to Production, redeploy."
          : "Cloud DB URL is set but connection failed. Check password, allow public access, and that migrations ran on THIS same host.",
        timestamp: new Date().toISOString(),
      },
      { status: 503 },
    );
  }
}
