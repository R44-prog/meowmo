import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zoczwqsznkbltivertqk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvY3p3cXN6bmtibHRpdmVydHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NzA5ODYsImV4cCI6MjA4NTU0Njk4Nn0.G80TndMM6O6OP9NfpFCSq4SjWHNIZyayNXgnukQjiT0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verify() {
    console.log("🚀 Starting Supabase Verification (Attempt 2)...");

    const catId = "6a09dc55-3015-43d3-85a0-d0c1a822ad22";

    // 1. Try to create the missing cat (Optional, usually fails if seeded)
    console.log(`🐱 Attempting to find/create Cat: ${catId}`);
    /*
    const { data: catData, error: catError } = await supabase
        .from('cats')
        .upsert({
            id: catId,
            name: "Alpha Cat",
            owner_id: "00000000-0000-0000-0000-000000000000"
        })
        .select()
        .single();
    */

    /*
    if (catError) {
        console.error("❌ Cat Creation Failed!");
        console.error("Error details:", catError);
        return; // Stop if we can't create the cat
    }
    console.log("✅ Cat Created/Found:", catData);
    */

    const testData = {
        cat_id: catId,
        date: new Date().toISOString().split('T')[0],
        vibe_score: 5,
        note: "Automated verification log",
        appetite: "good",
        litter: "normal"
    };

    console.log(`📝 Attempting to upsert entry...`);
    const { data: entryData, error: entryError } = await supabase
        .from('daily_entries')
        .upsert(testData, { onConflict: 'cat_id,date' })
        .select()
        .single();

    if (entryError) {
        console.error("❌ Entry Failed!", entryError);
    } else {
        console.log("✅ Entry Success!", entryData);
    }
}

verify();
