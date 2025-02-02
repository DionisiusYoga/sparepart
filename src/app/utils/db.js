import { Pool } from "pg";

export const pool = new Pool({
  user: process.env.USER_NAME,
  host: process.env.HOST_NAME,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.PORT_NUMBER,
});

export default async function handlerQuery(query, values) {
  const client = await pool.connect();
  try {
    const hasil = await client.query(query, values);
    return hasil;
  } finally {
    client.release();
  }
}

// import { Pool } from "pg";

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL, // Ambil dari DATABASE_URL
//   ssl:
//     process.env.NODE_ENV === "production"
//       ? { rejectUnauthorized: false }
//       : false, // SSL untuk Supabase
// });

// export default async function handlerQuery(query, values) {
//   const client = await pool.connect();
//   try {
//     const hasil = await client.query(query, values);
//     return hasil;
//   } catch (err) {
//     console.error("Database query error:", err);
//     throw err; // Lempar error untuk ditangani di tempat lain
//   } finally {
//     client.release();
//   }
// }
