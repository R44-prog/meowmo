import pg from 'pg';
import { fileURLToPath } from 'url';

const { Client } = pg;
const connectionString = 'postgresql://postgres:1plus1isVier@db.zoczwqsznkbltivertqk.supabase.co:5432/postgres';

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function reset() {
    try {
        console.log("🔥 Connecting for RESET...");
        await client.connect();

        // Drop in dependency order
        const tables = ['routines', 'photos', 'daily_entries', 'cats', 'users'];
        for (const t of tables) {
            console.log(`💥 Dropping ${t}...`);
            await client.query(`DROP TABLE IF EXISTS ${t} CASCADE`);
        }
        console.log("✅ RESET COMPLETE.");

    } catch (err) {
        console.error("❌ Reset failed:", err);
    } finally {
        await client.end();
    }
}

reset();
