import pg from 'pg';
import { fileURLToPath } from 'url';

const { Client } = pg;

const connectionString = 'postgresql://postgres:1plus1isVier@db.zoczwqsznkbltivertqk.supabase.co:5432/postgres';

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function debug() {
    try {
        await client.connect();
        console.log("✅ Connected.");

        // 1. List Tables
        console.log("\n📊 Tables:");
        const tablesRes = await client.query(`
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public'
        `);
        if (tablesRes.rows.length === 0) {
            console.log("No tables found in public schema.");
        } else {
            console.table(tablesRes.rows);

            // 2. Count rows for each table
            for (const row of tablesRes.rows) {
                const tableName = row.table_name;
                const countRes = await client.query(`SELECT COUNT(*) FROM "${tableName}"`);
                console.log(`- ${tableName}: ${countRes.rows[0].count} rows`);
                // 3. Dump Users
                if (tableName === 'users') {
                    const users = await client.query('SELECT * FROM users');
                    console.log("Users:", users.rows);
                }
            }
        }

    } catch (err) {
        console.error("❌ Debug failed:", err);
    } finally {
        await client.end();
    }
}

debug();
