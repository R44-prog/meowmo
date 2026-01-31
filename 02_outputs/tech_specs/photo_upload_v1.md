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

## 3. Implementation Status
- [x] Logic defined.
- [ ] signed-url generator service.
- [ ] Attachment logic helper.
