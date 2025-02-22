import { NextResponse } from "next/server";

async function handler() {
  try {
    const response = await fetch("https://api.imgflip.com/get_memes");
    if (!response.ok) {
      throw new Error("Failed to fetch memes");
    }
    const data = await response.json();
    return NextResponse.json(data.data.memes);
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export { handler as GET, handler as POST };