import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get("lat");
  const lon = searchParams.get("lon");

  let url = `${process.env.NEXT_PUBLIC_API_URL}/feed/here/?token=${process.env.NEXT_PUBLIC_WAQI_API_TOKEN}`;

  if (lat && lon) {
    url = `${process.env.NEXT_PUBLIC_API_URL}/feed/geo:${lat};${lon}/?token=${process.env.NEXT_PUBLIC_WAQI_API_TOKEN}`;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error fetching geo-localized data:", error);
    return NextResponse.json(
      { error: "Failed to fetch data" },
      { status: 500 }
    );
  }
}
