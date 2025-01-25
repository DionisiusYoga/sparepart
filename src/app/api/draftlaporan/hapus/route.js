import handlerQuery from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const request = await req.json();
  const id_draft = request.id_draft;

  try {
    if (id_draft != "clear") {
      let query = `
        DELETE FROM draft WHERE id_draft = $1;
      `;
      let value = [id_draft];
      let data = await handlerQuery(query, value);
    } else {
      let query = `
        DELETE FROM draft;
      `;
      let value = [];
      let data = await handlerQuery(query, value);
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error on route" });
  }
}
