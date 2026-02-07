import pg from 'pg';
import { randomUUID } from 'crypto';

const { Client } = pg;
const connectionString = 'postgresql://postgres:1plus1isVier@db.zoczwqsznkbltivertqk.supabase.co:5432/postgres';

const client = new Client({
    connectionString: connectionString,
    ssl: { rejectUnauthorized: false }
});

async function simulate() {
    try {
        console.log("🤖 Starting Simulation: 5 Users x 5 Days...");
        await client.connect();

        // Disable RLS to allow bulk inserting as 'postgres'
        await client.query('ALTER TABLE users DISABLE ROW LEVEL SECURITY');
        await client.query('ALTER TABLE cats DISABLE ROW LEVEL SECURITY');
        await client.query('ALTER TABLE daily_entries DISABLE ROW LEVEL SECURITY');

        const testers = [
            { name: "Tester Alice", cat: "Mochi" },
            { name: "Tester Bob", cat: "Garfield" },
            { name: "Tester Carol", cat: "Salem" },
            { name: "Tester Dave", cat: "Tom" },
            { name: "Tester Eve", cat: "Luna II" }
        ];

        let totalEntries = 0;

        for (const t of testers) {
            const userId = randomUUID();
            const catId = randomUUID();
            const email = `${t.name.toLowerCase().replace(' ', '.')}@simulation.test`;

            console.log(`\n👤 Creating ${t.name} (${email})...`);

            // 1. Create User & Cat (Atomic CTE pattern)
            await client.query(`
                WITH user_ins AS (
                    INSERT INTO users (id, email) VALUES ($1, $2) RETURNING id
                )
                INSERT INTO cats (id, owner_id, name) VALUES ($3, $1, $4)
            `, [userId, email, catId, t.cat]);

            console.log(`   🐱 Created Cat: ${t.cat}`);

            // 2. Log 5 Days of Data
            const today = new Date();
            for (let i = 0; i < 5; i++) {
                const date = new Date(today);
                date.setDate(date.getDate() - i); // Past 5 days
                const dateStr = date.toISOString().split('T')[0];
                const vibe = Math.floor(Math.random() * 5) + 1; // 1-5

                await client.query(`
                    INSERT INTO daily_entries (cat_id, date, vibe_score, note, appetite, litter)
                    VALUES ($1, $2, $3, $4, $5, $6)
                `, [catId, dateStr, vibe, `Simulation Day ${i + 1}`, 'good', 'normal']);

                totalEntries++;
                process.stdout.write('.');
            }
        }

        console.log(`\n\n✅ Simulation Complete.`);
        console.log(`📊 Added ${testers.length} Users, ${testers.length} Cats, ${totalEntries} Entries.`);

    } catch (err) {
        console.error("❌ Simulation failed:", err);
    } finally {
        await client.end();
    }
}

simulate();
