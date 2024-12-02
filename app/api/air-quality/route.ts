import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const stationId = searchParams.get("stationId");

  if (!stationId) {
    return NextResponse.json(
      { error: "Station ID is required" },
      { status: 400 }
    );
  }

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/feed/@${stationId}/?token=${process.env.NEXT_PUBLIC_WAQI_API_TOKEN}`
  );

  const data = await response.json();
  return NextResponse.json(data);
}
