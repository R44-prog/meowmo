import { TrophyGenerator } from '../src/services/ai/TrophyGenerator';

async function simulateTrophyFlow() {
    console.log("--- Starting Non-Interactive AI Trophy Simulation ---");
    const catName = "Luna";
    const selectedBehaviors = ['loaf', 'sploot', 'shrimp', 'unknown_behavior'];

    for (const behavior of selectedBehaviors) {
        console.log(`\n[Test] Simulating capture for: ${behavior}`);
        try {
            const trophy = await TrophyGenerator.generateScene(catName, behavior);

            console.log(`✅ Success: Trophy Generated`);
            console.log(`   - Trophy ID: ${trophy.id}`);
            console.log(`   - Prompt: ${trophy.description}`);
            console.log(`   - Image URL: ${trophy.imageUrl}`);
            console.log(`   - Clinical Footnote: ${trophy.clinicalFootnote}`);

            // Verification assertions
            if (!trophy.clinicalFootnote) throw new Error("Missing clinical footnote!");
            if (!trophy.description.includes(catName)) throw new Error("Missing personalization (catName)!");
            console.log(`✅ Logic Verified for ${behavior}`);
        } catch (error) {
            console.error(`❌ Error verifying ${behavior}:`, error);
            process.exit(1);
        }
    }

    console.log("\n--- Simulation Complete: All Logic Paths Verified ---");
}

simulateTrophyFlow();
