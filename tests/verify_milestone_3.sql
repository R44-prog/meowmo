-- Verification: Milestone 3 Acceptance Checks (Photos)
-- This script tests the database constraints for photos.

DO $$
DECLARE
    test_user_id UUID;
    test_cat_id UUID;
    test_entry_id UUID;
    test_photo_id UUID;
BEGIN
    -- Setup
    INSERT INTO users (email) VALUES ('photo_tester@example.com') RETURNING id INTO test_user_id;
    INSERT INTO cats (owner_id, name) VALUES (test_user_id, 'Pixel') RETURNING id INTO test_cat_id;
    INSERT INTO daily_entries (cat_id, date, vibe_score) VALUES (test_cat_id, CURRENT_DATE, 5) RETURNING id INTO test_entry_id;

    -- [CHECK] Photo attaches to the correct daily entry
    INSERT INTO photos (daily_entry_id, storage_key) VALUES (test_entry_id, 'cats/pixel/today.jpg') RETURNING id INTO test_photo_id;
    
    -- [CHECK] Orphan Prevention (FK Enforcement)
    -- If we delete the daily entry, the photo record MUST disappear
    DELETE FROM daily_entries WHERE id = test_entry_id;
    
    IF EXISTS (SELECT 1 FROM photos WHERE id = test_photo_id) THEN
        RAISE EXCEPTION 'Orphan photo record detected! ON DELETE CASCADE failed.';
    END IF;

    -- Cleanup
    DELETE FROM users WHERE id = test_user_id;

    RAISE NOTICE 'Milestone 3 DB Continuity: PASS';
END $$;
