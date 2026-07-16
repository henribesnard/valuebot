import { NextRequest, NextResponse } from "next/server";
import { createTip, getPublicValueBotData, settleTip, updateTip } from "@/lib/valuebot-data";
import { userFromAuthorization } from "../../_lib/local-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function requireAdmin(req: NextRequest) {
  const user = await userFromAuthorization(req.headers.get("authorization"));
  if (!user) return { error: NextResponse.json({ detail: "Non authentifié" }, { status: 401 }) } as const;
  const adminEmails = (process.env.VALUEBOT_ADMIN_EMAILS || "besnard.hounwanou@gmail.com,henri.hounwanou@gmail.com,henri2032@gmail.com")
    .split(",")
    .map((x) => x.trim().toLowerCase())
    .filter(Boolean);
  if (user.role !== "admin" && !adminEmails.includes(user.email.toLowerCase())) {
    return { error: NextResponse.json({ detail: "Accès admin requis" }, { status: 403 }) } as const;
  }
  return { user } as const;
}

export async function GET(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;
  const data = await getPublicValueBotData();
  return NextResponse.json({ tips: data.tips, metrics: data.bankrollKpis });
}

export async function POST(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;
  const body = await req.json().catch(() => ({}));
  try {
    const tip = await createTip(body);
    return NextResponse.json({ tip }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ detail: err instanceof Error ? err.message : "Conseil invalide" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  const auth = await requireAdmin(req);
  if ("error" in auth) return auth.error;
  const body = await req.json().catch(() => ({}));
  const id = Number(body.id);
  if (!Number.isFinite(id)) return NextResponse.json({ detail: "id requis" }, { status: 400 });
  try {
    if (body.action === "settle") {
      const tip = await settleTip(id, body.status, String(body.source || "Admin ValueBot"));
      return NextResponse.json({ tip });
    }
    const { id: _id, action: _action, ...patch } = body;
    const tip = await updateTip(id, patch);
    return NextResponse.json({ tip });
  } catch (err) {
    return NextResponse.json({ detail: err instanceof Error ? err.message : "Modification impossible" }, { status: 400 });
  }
}
