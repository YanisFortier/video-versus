"use server";

import {db} from "@vercel/postgres";

const client = await db.connect();

export async function updateElo(winnerId: string, loserId: string) {
    try {
        await client.sql`BEGIN`;
        await client.sql`SELECT update_elo(${winnerId}, ${loserId})`;
        await client.sql`COMMIT`;

        return {message: 'Vote effectué !', status: 200};
    } catch (error: any) {
        await client.sql`ROLLBACK`;
        return {error: error.message, status: 500};
    }
}
