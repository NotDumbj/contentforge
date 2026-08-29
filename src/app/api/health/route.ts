import { NextResponse } from "next/server";

const startedAt = Date.now();

export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "contentforge",
    uptimeSeconds: Math.round((Date.now() - startedAt) / 1000),
    timestamp: new Date().toISOString(),
  });
}
