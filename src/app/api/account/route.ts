import { NextRequest, NextResponse } from "next/server";
import { publicUser, userFromAuthorization } from "../_lib/local-auth";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const user = await userFromAuthorization(req.headers.get("authorization"));
  if (!user) {
    return NextResponse.json({ detail: "Non authentifié" }, { status: 401 });
  }
  return NextResponse.json(publicUser(user));
}
