import handlerQuery from "@/app/utils/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        let query = 'SELECT * FROM part_induk'
        let value = []

        let data = await handlerQuery(query, value)

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: "Error on route" })
    }
}

export async function POST(req) {
    const request = await req.json();
    const id_pi = request.key;

    try {
        let query = 'SELECT * FROM part_induk WHERE id_pi = $1'
        let value = [id_pi]

        let data = await handlerQuery(query, value)

        return NextResponse.json(data)
    } catch (error) {
        return NextResponse.json({ error: "Error on route" })
    }
}