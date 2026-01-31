# Milestone 4: Daily Entry Upsert Logic

This document specifies the "upsert" (update-or-insert) logic for the Core Daily Loop, ensuring data integrity and deduplication.

---

## 1. The "Daily Guard" (Upsert Strategy)

To prevent duplicate entries per cat/date, we use a `UPSERT` (INSERT ... ON CONFLICT) pattern:

```sql
INSERT INTO daily_entries (cat_id, date, vibe_score, note)
VALUES ($1, $2, $3, $4)
ON CONFLICT (cat_id, date) 
DO UPDATE SET 
    vibe_score = EXCLUDED.vibe_score,
    note = EXCLUDED.note
RETURNING id;
```

---

## 2. API Logic: `POST /api/entry`

- **Auth**: Protected by Magic Link session.
- **Payload**: 
  ```json
  {
    "cat_id": "UUID",
    "vibe_score": 1,
    "note": "string (optional)",
    "routines": [{ "type": "appetite", "value": "low" }]
  }
  ```
- **Business Rules**:
  1. **Ownership**: Validate `userId` owns `cat_id`.
  2. **Persistence**: Perform the SQL Upsert for the `daily_entry`.
  3. **Attachment**: 
     - If routines are provided, DELETE existing routines for this `daily_entry_id` and INSERT new ones.
     - (Photos are attached separately via Milestone 3 logic).

---

## 3. Proof of Implementation (POI)

### POI 5: Deduplication Proof
- **Verification**: Submitting a log for "Luna" on 2026-01-31 twice results in the SAME `daily_entry.id`.
- **Constraint**: Relies on the `UNIQUE (cat_id, date)` index verified in Milestone 1.

### POI 6: Reactive Update
- **Verification**: If Step 1 sends `vibe: 5` and Step 2 sends `vibe: 1`, the database record reflects `vibe: 1`.

### POI 7: Tethering Accuracy
- **Verification**: Child records (`routines`) are linked via `daily_entry_id`. CASCADE ensures they are wiped only if the parent is replaced/deleted.

### POI 8: Ownership Lockdown
- **Verification**: Middleware rejects `/api/entry` if the session's `owner_id` does not match the cat's `owner_id`.
