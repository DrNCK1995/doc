import { NextResponse } from "next/server";

export function errorStatus(err: unknown): number | null {
  if (err && typeof err === "object" && "status" in err) {
    const status = (err as { status: unknown }).status;
    return typeof status === "number" ? status : null;
  }
  return null;
}

export function errorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  if (err && typeof err === "object" && "message" in err) {
    const msg = (err as { message: unknown }).message;
    if (typeof msg === "string" && msg) return msg;
  }
  return fallback;
}

export function jsonError(err: unknown, fallback: string, fallbackStatus = 500) {
  const status = errorStatus(err);
  if (status != null) {
    return NextResponse.json(
      { error: errorMessage(err, fallback) },
      { status },
    );
  }
  console.error(fallback, err);
  return NextResponse.json({ error: fallback }, { status: fallbackStatus });
}
