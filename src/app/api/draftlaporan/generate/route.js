import handlerQuery from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const query = `
      SELECT 
          pg.id_gabungan,
          pg.id_pa,
          pg.id_pi,
          pa.nama,
          pa.no_part,
          pa.no_part_update,
          pa.no_cmw,
          dwg_supplier.nama AS nama_dwg,
          material.nama AS nama_material,
          supp_lokal.nama AS nama_lokal,
          maker.nama AS nama_maker,
          supp_impor.nama AS nama_impor,
          pi.no_part AS no_part_induk,
          pi.no_part_update AS no_part_update_induk
      FROM 
          part_gabungan pg
      JOIN 
          part_anak pa ON pg.id_pa = pa.id_pa
      LEFT JOIN 
          dwg_supplier ON pa.id_dwg = dwg_supplier.id_dwg
      LEFT JOIN 
          material ON pa.id_material = material.id_material
      LEFT JOIN 
          supp_lokal ON pa.id_lokal = supp_lokal.id_lokal
      LEFT JOIN 
          maker ON pa.id_maker = maker.id_maker
      LEFT JOIN 
          supp_impor ON pa.id_impor = supp_impor.id_impor
      JOIN 
          part_induk pi ON pg.id_pi = pi.id_pi
      WHERE 
          EXISTS (SELECT 1 FROM draft d WHERE d.id_pi = pg.id_pi);
    `;
    const value = [];
    let data = await handlerQuery(query, value);

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Error on route" });
  }
}
