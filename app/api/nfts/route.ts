import { NextResponse } from "next/server";
import { getAllNFTs } from "@/lib/queries/dbQueries";

export async function GET() {
  try {
    const nfts = await getAllNFTs();
    return NextResponse.json(nfts);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch NFTs" }, { status: 500 });
  }
}
