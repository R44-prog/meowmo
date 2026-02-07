import pg from 'pg';
import { fileURLToPath } from 'url';

const { Client } = pg;

const connectionString = 'postgresql://postgres:1plus1isVier@db.zoczwqsznkbltivertqk.supabase.co:5432/postgres';

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function seed() {
    try {
        console.log("🔌 Connecting...");
        await client.connect();
        console.log("✅ Connected.");

        // 0. Disable RLS (Temporary fix for Admin Access)
        console.log("🔓 Disabling RLS...");
        await client.query('ALTER TABLE users DISABLE ROW LEVEL SECURITY');
        await client.query('ALTER TABLE cats DISABLE ROW LEVEL SECURITY');
        await client.query('ALTER TABLE daily_entries DISABLE ROW LEVEL SECURITY'); // For verify script later

        // Atomic Insert using CTE to bypass potential transaction pool issues
        console.log("🚀 Running Atomic Seed...");

        const atomicRes = await client.query(`
            WITH user_insert AS (
                INSERT INTO users (id, email)
                VALUES ($1, $2)
                ON CONFLICT (id) DO UPDATE SET email = $2
                RETURNING id
            )
            INSERT INTO cats (id, owner_id, name)
            VALUES ($3, $1, $4)
            ON CONFLICT (id) DO UPDATE SET name = $4
            RETURNING id, name, owner_id;
        `, [
            '00000000-0000-0000-0000-000000000000', // $1: User ID / Owner ID
            'alpha@vibecat.app',                   // $2: Email
            '6a09dc55-3015-43d3-85a0-d0c1a822ad22', // $3: Cat ID
            'Alpha Luna'                           // $4: Cat Name
        ]);

        console.log("✅ Atomic Seed Result:", atomicRes.rows[0]);

    } catch (err) {
        console.error("❌ Seed failed:", err);
    } finally {
        await client.end();
    }
}

seed();
