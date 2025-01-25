import handlerQuery from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const request = await req.json();
  const id_pi = request.id_pi;

  try {
    let query = `
        SELECT 
            COUNT(id_pi) as jumlah
        FROM 
            draft
        JOIN 
            part_induk pi ON pi.no_part = draft.no_part
        WHERE 
            id_pi = $1
      `;
    let value = [id_pi];
    let data = await handlerQuery(query, value);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error on route" });
  }
}
