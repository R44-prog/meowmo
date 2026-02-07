-- Migration: 002_alpha_seed.sql
-- Purpose: Insert the hardcoded Alpha Cat so the V1 App works immediately.

BEGIN;

-- 1. Create a dummy user owner (required for FK)
-- Note: In a real app, this would be the logged-in user.
-- For Alpha V1, we use a shared "Founder" user or similar generic ID if RLS allows.
-- If RLS is strict, we might need to insert into auth.users (which requires service_role which we don't have).
-- WORKAROUND: We assume public access or we insert a 'users' record in the public table defined in 001_schema.

INSERT INTO users (id, email)
VALUES ('00000000-0000-0000-0000-000000000000', 'alpha@vibecat.app')
ON CONFLICT (id) DO NOTHING;

-- 2. Insert the specific Alpha Cat
INSERT INTO cats (id, owner_id, name)
VALUES 
    ('6a09dc55-3015-43d3-85a0-d0c1a822ad22', '00000000-0000-0000-0000-000000000000', 'Alpha Luna')
ON CONFLICT (id) DO NOTHING;

COMMIT;
