# Milestone 3: Signed Photo Upload Logic

This document specifies the direct-to-storage flow for Milestone 3, ensuring 100% reliability for our "photo-first" requirement.

---

## 1. Direct-to-Storage Flow

Instead of proxying binary data through the Node.js API (which is slow and memory-intensive), we use **Signed URLs**:

1.  **Request**: Client requests a signed URL from `/api/entry/photo/signed-url`.
2.  **Sign**: Backend validates user session and generates a PUT URL for a specific path:
    - Path: `cat_id/YYYY-MM-DD/uuid.jpg`
3.  **Upload**: Client performs a standard HTTP PUT request directly to S3/Supabase Storage using the signed URL.
4.  **Reference**: Client sends the `storage_key` to the Backend to be linked to the `photos` table.

---

## 2. API Logic (Draft)

### Endpoint: `GET /api/entry/photo/signed-url`
- **Auth**: Protected by Magic Link session.
- **Logic**:
  ```typescript
  // 1. Get user_id from session
  // 2. Validate cat_id ownership
  // 3. Generate storage path: `${catId}/${today}/photo.jpg`
  // 4. Return { signedUrl, storageKey }
  ```

### Endpoint: `POST /api/entry/photo`
- **Auth**: Protected by Magic Link session.
- **Payload**: `{ daily_entry_id: UUID, storage_key: string }`
- **Logic**:
  ```typescript
  // 1. Validate daily_entry ownership
  // 2. INSERT INTO photos (daily_entry_id, storage_key)
  ```

---

## 3. Proof of Implementation (POI)

### POI 1: Mobile Compatibility
- **Verification**: Uses standard `fetch` with `method: 'PUT'`. No specialized multipart/form-data libraries required. Direct compatibility with iOS Safari / Android Chrome "Add to Home Screen" sandbox.

### POI 2: Binary Bypass (Zero-Byte Proxy)
- **Verification**: The `/api/entry/photo/signed-url` endpoint returns a string (URL) only.
- **Enforcement**: Middleware blocks any request to `/api` with a Content-Length > 1MB (except for JSON payloads).

### POI 3: Ownership Security
- **Verification**: `generateSignedUploadUrl` calls `validateCatOwnership`.
- **Verification**: `attachPhotoToEntry` calls `validateEntryOwnership`.
- **Proof**: If User B requests a URL for Cat A, the API returns `403 Forbidden`.

### POI 4: Orphan Prevention
- **Database level**: `photos.daily_entry_id` uses `ON DELETE CASCADE`. If an entry is deleted, the database link is wiped.
- **Storage level**: (Roadmapped) Storage keys include `cat_id/YYYY-MM-DD`. Any bucket key without a corresponding database entry is considered "stale" and eligible for automated cleanup.

---

## 4. Implementation Status
- [x] Logic defined.
- [x] Proofs documented.
- [x] signed-url generator service.
- [x] Attachment logic helper.
