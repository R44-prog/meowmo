import { createClient } from '@supabase/supabase-js';

// Reusing keys from previous context
const SUPABASE_URL = 'https://zoczwqsznkbltivertqk.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvY3p3cXN6bmtibHRpdmVydHFrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njk5NzA5ODYsImV4cCI6MjA4NTU0Njk4Nn0.G80TndMM6O6OP9NfpFCSq4SjWHNIZyayNXgnukQjiT0';

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function verifyStorage() {
    console.log("📦 Verifying Storage Bucket 'vibe-cat-photos'...");

    // Create a dummy file buffer
    const buffer = Buffer.from('Integration Test Content', 'utf-8');
    const fileName = `verify_${Date.now()}.txt`;

    const { data, error } = await supabase.storage
        .from('vibe-cat-photos')
        .upload(fileName, buffer);

    if (error) {
        console.error("❌ Storage Verification Failed!");
        console.error(error);
        if (error.message.includes("Bucket not found")) {
            console.log("💡 diagnosis: The bucket 'vibe-cat-photos' does not exist.");
        }
    } else {
        console.log("✅ Storage Verification Success!");
        console.log("Uploaded:", data);

        // Cleanup
        await supabase.storage.from('vibe-cat-photos').remove([fileName]);
    }
}

verifyStorage();
