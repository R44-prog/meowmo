/**
 * scripts/engagement_triggers.mjs
 * 
 * Milestone 7: Engagement Loop Hardening
 * Detects inactive users and simulates email triggers.
 */

import { readFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = resolve(__dirname, '..', 'src', 'data', 'ARCHIVED_simulation_users.json');

function analyzeEngagement() {
    console.log("Loading simulation data...");

    let simulationData;
    try {
        const rawData = readFileSync(dataPath, 'utf8');
        simulationData = JSON.parse(rawData);
    } catch (err) {
        console.error(`Failed to read simulation data at ${dataPath}:`, err.message);
        process.exit(1);
    }

    // We treat 'current date' as the latest entry date in the simulation + 1 day
    const allEntries = simulationData.daily_entries;
    const latestEntryDate = new Date(Math.max(...allEntries.map((e) => new Date(e.date).getTime())));
    const now = new Date(latestEntryDate.getTime() + 86400000); // +1 day

    console.log(`Analyzing ${simulationData.users.length} users and ${allEntries.length} entries...`);
    console.log(`Simulated current date: ${now.toISOString().split('T')[0]}`);

    const userSummaries = simulationData.users.map((user) => {
        const userEntries = allEntries.filter((e) => e.userId === user.id || e.cat_id === user.cats[0]?.id);
        const lastSeenDate = userEntries.length > 0
            ? new Date(Math.max(...userEntries.map((e) => new Date(e.date).getTime())))
            : new Date(latestEntryDate.getTime() - 30 * 86400000); // 30 days ago if never active

        const daysInactive = Math.floor((now.getTime() - lastSeenDate.getTime()) / (1000 * 60 * 60 * 24));

        let status = 'Active';
        if (daysInactive > 14) status = 'Churned';
        else if (daysInactive >= 3) status = 'At Risk';

        return {
            userId: user.id,
            email: user.email,
            lastSeen: lastSeenDate.toISOString().split('T')[0],
            daysInactive,
            status
        };
    });

    const activeCount = userSummaries.filter(u => u.status === 'Active').length;
    const atRiskCount = userSummaries.filter(u => u.status === 'At Risk').length;
    const churnedCount = userSummaries.filter(u => u.status === 'Churned').length;

    console.log("\n--- SIMULATION ANALYSIS ---");
    console.log(`Total Users: ${userSummaries.length}`);
    console.log(`Active (Logged in last 3 days): ${activeCount}`);
    console.log(`At Risk / Trigger Needed (Inactive 3-14 days): ${atRiskCount}`);
    console.log(`Churned (Inactive > 14 days): ${churnedCount}`);
    console.log("---------------------------\n");

    console.log("[EXECUTING TRIGGERS]");
    userSummaries
        .filter(u => u.status === 'At Risk')
        .forEach(u => {
            console.log(`>> FIRING EMAIL to ${u.email} (Last seen: ${u.lastSeen}, ${u.daysInactive} days ago)`);
            console.log('   "Hey! It\'s been a few days. How is your cat doing?"');
        });

    console.log("\nSimulation Complete. System ready for Milestone 7 integration.");
}

analyzeEngagement();
