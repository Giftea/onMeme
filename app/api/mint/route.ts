import { NextResponse } from "next/server";
import { mintNFT } from "@/lib/queries/dbQueries";

export async function POST(req: Request) {
  try {
    const { token, owner, metadata } = await req.json();
    const newNFT = await mintNFT(token, owner, metadata);
    return NextResponse.json(newNFT);
  } catch (error) {
    return NextResponse.json({ error: "Failed to mint NFT" }, { status: 500 });
  }
}
