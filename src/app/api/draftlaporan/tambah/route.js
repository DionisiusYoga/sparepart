import handlerQuery from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const request = await req.json();
  const no_part = request.no_part;
  const no_part_update = request.no_part_update;

  try {
    let checkQuery = `
      SELECT * FROM draft WHERE no_part = $1;
    `;
    let checkValue = [no_part];
    let existingData = await handlerQuery(checkQuery, checkValue);

    if (existingData.rows.length > 0) {
      return NextResponse.json({ error: "Data sudah ada di database" });
    } else {
      let insertQuery = `
          INSERT INTO draft(no_part, no_part_update)
          VALUES ($1, $2);
        `;
      let insertValue = [no_part, no_part_update];
      let data = await handlerQuery(insertQuery, insertValue);
      return NextResponse.json(data);
    }
  } catch (error) {
    return NextResponse.json({ error: "Error on route" });
  }
}
