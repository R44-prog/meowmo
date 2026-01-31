# Milestone 5: Timeline Read Logic

This document specifies the "Timeline" retrieval logic, ensuring a calm, vertical history of records.

---

## 1. The Paginated Feed (Query Strategy)

The timeline must be newest-first and paginated to maintain performance.

```sql
SELECT 
    e.id, 
    e.date, 
    e.vibe_score, 
    e.note,
    p.storage_key as photo_url,
    json_agg(r.*) as routines
FROM daily_entries e
LEFT JOIN photos p ON e.id = p.daily_entry_id
LEFT JOIN routines r ON e.id = r.daily_entry_id
WHERE e.cat_id = $1
GROUP BY e.id, p.storage_key
ORDER BY e.date DESC
LIMIT $2 OFFSET $3;
```

---

## 2. API Logic: `GET /api/timeline`

- **Auth**: Protected by Magic Link session.
- **Parameters**: 
  - `cat_id`: UUID
  - `limit`: Integer (Default: 10)
  - `offset`: Integer (Default: 0)
- **Business Rules**:
  1. **Ownership**: Validate `userId` owns `cat_id` before executing the query.
  2. **Data Consistency**: Ensure photos and routines are joined in a single efficient query.
  3. **Empty States**: If no entries exist, return an empty array `[]` with `200 OK`.

---

## 3. Proof of Implementation (POI)

### POI 9: Chronological Order
- **Verification**: SQL `ORDER BY e.date DESC` ensures that today's log appears above yesterday's.

### POI 10: Isolation Check
- **Verification**: The `WHERE e.cat_id = $1` (combined with ownership guard) prevents User A from seeing User B's cat logs.

### POI 11: Pagination Proof
- **Verification**: Requesting with `limit=1` returns only the latest entry. Offset allows "scrolling" past it.

### POI 12: Index Performance
- **Verification**: Query uses the `[cat_id, date]` unique index for the `WHERE` and `ORDER BY` clauses, ensuring `log(n)` performance even with 10k+ entries.

### POI 13: Empty Resilience
- **Verification**: A new user with 0 logs receives `[]` without a server crash or null-pointer error.
