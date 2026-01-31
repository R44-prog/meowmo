-- Verification: Milestone 1 Acceptance Checks
-- This script tests the schema constraints and requirements.

-- 1. Setup Test Data
DO $$
DECLARE
    test_user_id UUID;
    test_cat_id UUID;
    test_entry_id UUID;
BEGIN
    -- [CHECK] Can create a user
    INSERT INTO users (email) VALUES ('test@example.com') 
    RETURNING id INTO test_user_id;

    -- [CHECK] Can create a cat
    INSERT INTO cats (owner_id, name) VALUES (test_user_id, 'Luna')
    RETURNING id INTO test_cat_id;

    -- [CHECK] Can insert a daily entry for today
    INSERT INTO daily_entries (cat_id, date, vibe_score, note) 
    VALUES (test_cat_id, CURRENT_DATE, 5, 'Happy cat!')
    RETURNING id INTO test_entry_id;

    -- [CHECK] Second insert for same date does not duplicate (Expected Failure)
    BEGIN
        INSERT INTO daily_entries (cat_id, date, vibe_score) 
        VALUES (test_cat_id, CURRENT_DATE, 1);
        RAISE EXCEPTION 'Unique constraint [cat_id, date] FAILED TO ENFORCE';
    EXCEPTION WHEN unique_violation THEN
        -- Correct behavior
        NULL;
    END;

    -- [CHECK] Foreign keys enforce ownership
    BEGIN
        INSERT INTO cats (owner_id, name) VALUES ('00000000-0000-0000-0000-000000000000', 'Void Cat');
        RAISE EXCEPTION 'Foreign key owner_id FAILED TO ENFORCE';
    EXCEPTION WHEN foreign_key_violation THEN
        -- Correct behavior
        NULL;
    END;

    -- Cleanup
    DELETE FROM users WHERE id = test_user_id;

    RAISE NOTICE 'Milestone 1 Acceptance Checks: PASS';
END $$;
