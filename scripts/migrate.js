import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const { Client } = pg;

// Helper for __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// User provided connection string: postgresql://postgres:[1plus1isVier]@db.zoczwqsznkbltivertqk.supabase.co:5432/postgres
const connectionString = 'postgresql://postgres:1plus1isVier@db.zoczwqsznkbltivertqk.supabase.co:5432/postgres';

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function migrate() {
    try {
        console.log("🔌 Connecting to database...");
        await client.connect();
        console.log("✅ Connected.");

        const migrations = [
            'migrations/001_initial_schema.sql'
        ];

        for (const file of migrations) {
            console.log(`\n📄 Running ${file}...`);
            const filePath = path.join(__dirname, '..', file);
            const sql = fs.readFileSync(filePath, 'utf8');

            // Execute the SQL file content
            await client.query(sql);
            console.log(`✅ ${file} applied successfully.`);
        }

        console.log("\n🚀 All migrations completed successfully.");

    } catch (err) {
        console.error("❌ Migration failed:", err);
    } finally {
        await client.end();
    }
}

migrate();
