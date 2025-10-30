import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const { username, password } = await request.json();

  const validUser = process.env.ADMIN_USERNAME;
  const validPass = process.env.ADMIN_PASSWORD;

  if (username === validUser && password === validPass) {
    return NextResponse.json({ success: true });
  }

  return NextResponse.json({ success: false }, { status: 401 });
}
