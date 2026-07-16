import { NextRequest, NextResponse } from "next/server";
import { createToken, findUserById, publicUser, verifyToken } from "../../_lib/local-auth";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}));
  const refreshToken = String(body.refresh_token || "");
  const payload = verifyToken(refreshToken);
  if (!payload || payload.type !== "refresh") {
    return NextResponse.json({ detail: "Refresh token invalide ou expiré" }, { status: 401 });
  }
  const user = await findUserById(payload.sub);
  if (!user) {
    return NextResponse.json({ detail: "Utilisateur introuvable" }, { status: 401 });
  }
  return NextResponse.json({
    access_token: createToken(user.id, "access"),
    refresh_token: createToken(user.id, "refresh"),
    token_type: "bearer",
    user: publicUser(user),
  });
}
