import handlerQuery from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
      SELECT * FROM draft;
    `;
    const value = [];
    let data = await handlerQuery(query, value);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error on route" });
  }
}
