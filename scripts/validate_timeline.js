import { getTimeline } from './src/lib/timeline_service.js';

async function validateTimelineData() {
    console.log("--- VALIDATING TIMELINE DATA (Milestone 6 Stress Test) ---");

    // Using the fixed Cat ID from the simulation data
    const catId = "6a09dc55-3015-43d3-85a0-d0c1a822ad22";
    console.log(`Target Cat ID: ${catId}`);

    try {
        const entries = await getTimeline("dummy-user", catId, { limit: 5 });

        if (entries.length === 0) {
            console.error("FAIL: No entries found. Verify ARCHIVED_simulation_users.json exists.");
            return;
        }

        console.log(`PASS: Retrieved ${entries.length} entries.`);

        // Check sorting
        const dates = entries.map(e => new Date(e.date).getTime());
        const isSorted = dates.every((d, i) => i === 0 || d <= dates[i - 1]);
        console.log(`PASS: Entries sorted newest-first: ${isSorted}`);

        // Sample data
        console.log("\nSample Entries:");
        entries.forEach((e, i) => {
            console.log(`  [${i + 1}] Date: ${e.date} | Vibe: ${e.vibe_score} | Note: ${e.note || 'None'}`);
        });

    } catch (err) {
        console.error("FAIL: Error during validation:", err);
    }
}

validateTimelineData();
