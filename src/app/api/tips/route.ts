import { NextResponse } from "next/server";
import { getPublicValueBotData } from "@/lib/valuebot-data";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const data = await getPublicValueBotData();
  return NextResponse.json(data);
}
