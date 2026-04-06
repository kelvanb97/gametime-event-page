import { NextResponse } from "next/server";
import { getTicketsForEvent } from "@/data/tickets";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const inventory = getTicketsForEvent(slug);

  return NextResponse.json(inventory, {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}