# Milestone 2: Auth & Ownership Enforcement

## 1. Auth Approach: Magic Link (State-less)

To maintain the "Calm & Lean" vision, we use a passwordless Magic Link flow:

1.  **Request**: User enters email.
2.  **Token**: Backend generates a cryptographically secure `login_token` (UUID) stored in a `login_attempts` table (expiring in 15 mins).
3.  **Delivery**: An email is sent with a link: `https://vibe-cat.app/api/auth/callback?token=XYZ`.
4.  **Verification**: 
    - API consumes the token.
    - If valid, it retrieves/creates the `user` record.
    - Issues a **Secure, HttpOnly Cookie** containing a signed JWT with the `user_id`.
5.  **Persistence**: The PWA stays logged in via the cookie. No local storage for secrets.

---

## 2. Ownership Middleware (The Guard)

This logic is injected into every protected API route. It ensures that a user can only touch resources they own.

```typescript
// src/middleware/ownership_guard.ts

import { db } from "@/lib/db";
import { unauthorized, forbidden } from "@/lib/api_responses";

export async function ownershipGuard(req: Request, userId: string, resourceType: "cat" | "entry", resourceId: string) {
  
  if (resourceType === "cat") {
    const cat = await db.cat.findUnique({
      where: { id: resourceId },
      select: { owner_id: true }
    });

    if (!cat) return forbidden("Cat not found.");
    if (cat.owner_id !== userId) return forbidden("You do not own this cat.");
  }

  if (resourceType === "entry") {
    const entry = await db.daily_entry.findUnique({
      where: { id: resourceId },
      include: { cat: { select: { owner_id: true } } }
    });

    if (!entry) return forbidden("Entry not found.");
    if (entry.cat.owner_id !== userId) return forbidden("Ownership violation.");
  }

  return null; // Passed
}
```

---

## 3. Implementation Status
- [x] Auth approach refined.
- [x] Ownership logic drafted.
- [ ] Integration into Next.js middleware (Pending Phase 2).
