# Tech Spec: Nova Foundation (V1 Lean)

This document defines the minimal technical foundation required to support the V1 Lean Product Shape, strictly governed by `locked_requirements.md`.

---

## 1) Minimal System Architecture

- **Frontend**: Single Page Application (SPA) built with React/Vite (PWA-enabled).
- **Backend**: Serverless API (Supabase Functions or Node.js) for database interactions.
- **Database**: Relational (PostgreSQL) for strict data integrity and unique constraints.
- **Storage**: Object Storage (S3/Supabase Storage) for cat photos.
- **Communication**: RESTful JSON API. Client handles signed uploads directly to Storage.

---

## 2) Data Model

### Entities & Fields
- **Cat**
  - `id`: UUID (PK)
  - `owner_id`: UUID (Indexed)
  - `name`: String (Required)
  - `created_at`: Timestamp
- **Daily Entry**
  - `id`: UUID (PK)
  - `cat_id`: UUID (FK -> Cat)
  - `date`: DATE (Required, Unique index: `[cat_id, date]`)
  - `vibe_score`: Integer (1-5, Required)
  - `note`: Text (Optional)
  - `created_at`: Timestamp
- **Photo**
  - `id`: UUID (PK)
  - `daily_entry_id`: UUID (FK -> Daily Entry)
  - `storage_key`: String (Required, unique bucket path)
  - `created_at`: Timestamp
- **Routine**
  - `id`: UUID (PK)
  - `daily_entry_id`: UUID (FK -> Daily Entry)
  - `type`: String (e.g., 'appetite', 'litter')
  - `value`: String (Optional)
  - `created_at`: Timestamp

---

## 3) Storage Strategy (Signed Uploads)

1. **Request**: Client requests a signed upload URL from the Backend (providing file metadata).
2. **Issue**: Backend validates ownership and generates a time-limited PUT/POST URL for a specific bucket path (e.g., `cat_id/YYYY-MM-DD/uuid.jpg`).
3. **Upload**: Client uploads the image file directly to Storage.
4. **Reference**: Client submits the `storage_key` to the Backend during the `upsert daily entry` flow to link the photo to the record.

---

## 4) Core API Surface

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/cat` | `POST` | Create a cat (Onboarding). |
| `/cat` | `GET` | Fetch cat details. |
| `/entry` | `POST` | Upsert daily entry (vibe, note, routines). |
| `/entry/photo/signed-url` | `GET` | Get a signed URL for photo upload. |
| `/entry/photo` | `POST` | Attach a `storage_key` to a daily entry. |
| `/timeline` | `GET` | Get paginated entries (newest first). |

---

## 5) Execution Order (Runnable First)

- **Step 1**: Provision Database and apply schemas/unique constraints (`cat_id` + `date`).
- **Step 2**: Implement Magic Link Auth and establish `owner_id` context.
- **Step 3**: Implement `/entry/photo/signed-url` and verify direct client-to-storage uploads.
- **Step 4**: Build the `POST /entry` logic to link vibe and photo URL.
- **Step 5**: implement `GET /timeline` with basic pagination.

---

## 6) Explicit Non-Goals (Verbatim)
- **Medical Diagnosis**: No clinical advice, prescriptive warnings, or "Your cat has [X]" alerts.
- **Complex Analytics**: No line charts, scatter plots, or multi-dimensional data viz.
- **Community/Social**: No sharing feeds, "friends" lists, or public galleries.
- **Messaging Integration**: No WhatsApp, Telegram, or SMS-based logging.
- **Multi-Cat Support**: No switching between cats or aggregate views for multiple cats.
- **Medical Taxonomy**: No complex clinical enums (e.g., specific stool types, blood markers).
- **Baseline Computation**: No backend “normal baseline” calculation endpoints in V1.
- **Export/PDF**: No export or vet summary generation in V1.
- **Notifications**: No alerts/push notifications in V1.
- **AI Insights**: No AI analysis/insights in V1.

---

## 7) Drift Self-Check
- **Computation**: I was tempted to add a "Last 7 days" average calculation to the `/cat` endpoint. **Excluded** (per Non-Goal: Baseline Computation).
- **Taxonomy**: I considered hard-coding `routine_types` (e.g., 'Bowl', 'Box'). **Excluded** (Keeping field generic to avoid Medical Taxonomy creep).

---

## 8) Open Questions
- None. Requirements are clear.
