import handlerQuery from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const request = await req.json();
  const no_part = request.no_part;

  try {
    let query = `
        DELETE FROM 
            draft
	    WHERE 
            no_part = $1;
      `;
    let value = [no_part];
    let data = await handlerQuery(query, value);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error on route" });
  }
}
