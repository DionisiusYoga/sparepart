import handlerQuery from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function POST(req) {
  const request = await req.json();
  const id_pi = request.id_pi;

  try {
    let query = `
        SELECT 
            pg.id_gabungan,
            pg.id_pa,
            pg.id_pi,
            pa.nama,
            pa.no_part,
            pa.no_part_update,
            pa.no_cmw,
            dwg.nama AS nama_dwg,
            material.nama AS nama_material,
            lokal.nama AS nama_lokal,
            maker.nama AS nama_maker,
            impor.nama AS nama_impor
        FROM 
            part_gabungan pg
        JOIN 
            part_anak pa ON pa.id_pa = pg.id_pa
        LEFT JOIN 
            dwg_supplier dwg ON dwg.id_dwg = pa.id_dwg
        LEFT JOIN 
            material ON material.id_material = pa.id_material
        LEFT JOIN 
            supp_lokal lokal ON lokal.id_lokal = pa.id_lokal
        LEFT JOIN 
            maker ON maker.id_maker = pa.id_maker
        LEFT JOIN 
            supp_impor impor ON impor.id_impor = pa.id_impor
        WHERE 
            pg.id_pi = $1
    `;
    let value = [id_pi];

    let data = await handlerQuery(query, value);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error on route" });
  }
}
