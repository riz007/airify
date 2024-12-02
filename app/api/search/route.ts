import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const keyword = searchParams.get("keyword");

  if (!keyword) {
    return NextResponse.json({ error: "Keyword is required" }, { status: 400 });
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/search/?keyword=${keyword}&token=${process.env.NEXT_PUBLIC_WAQI_API_TOKEN}`
  );
  const data = await response.json();
  return NextResponse.json(data);
}
