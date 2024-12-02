import { NextResponse } from "next/server";

export async function GET() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/feed/here/?token=${process.env.NEXT_PUBLIC_WAQI_API_TOKEN}`
  );
  const data = await response.json();
  return NextResponse.json(data);
}
