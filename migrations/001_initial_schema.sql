-- Migration: 001_initial_schema.sql
-- Description: Create core tables for Cat Health Tracker V1 Lean

BEGIN;

-- 1. Users table (Simple placeholder for auth)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Cats table
CREATE TABLE IF NOT EXISTS cats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Daily Entries table
-- Unique constraint on [cat_id, date] to ensure only one entry per cat per day
CREATE TABLE IF NOT EXISTS daily_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    cat_id UUID NOT NULL REFERENCES cats(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    vibe_score INTEGER NOT NULL CHECK (vibe_score >= 1 AND vibe_score <= 5),
    note TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE (cat_id, date)
);

-- 4. Photos table
CREATE TABLE IF NOT EXISTS photos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_entry_id UUID NOT NULL REFERENCES daily_entries(id) ON DELETE CASCADE,
    storage_key TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Routines table
CREATE TABLE IF NOT EXISTS routines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    daily_entry_id UUID NOT NULL REFERENCES daily_entries(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- e.g., 'appetite', 'litter'
    value TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS (Security) - Basics
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE cats ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE routines ENABLE ROW LEVEL SECURITY;

COMMIT;
