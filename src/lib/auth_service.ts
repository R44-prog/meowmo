// src/lib/auth_service.ts

/**
 * Milestone 2: Magic Link Logic
 * 100% Lean. No passwords. No complex OAuth.
 */

export async function requestMagicLink(email: string) {
    // 1. Validate email
    // 2. Generate UUID token
    // 3. Store in DB with expiry
    // 4. (Simulated) Send email
    console.log(`[AUTH] Magic Link requested for ${email}`);
}

export async function verifySession(token: string) {
    // 1. Lookup token
    // 2. If valid, find/create user
    // 3. Issue JWT
    return { userId: "uuid-from-db" };
}
