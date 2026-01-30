# Locked Requirements — Cat Health Tracker (MVP)

This document is the authoritative source of truth for the product scope. Any conflict with other documents is resolved in favor of this one.

---

## 1. Core Requirements

### 1.1 Single Cat MVP
- The system must support exactly one cat per user account for V1.
- Onboarding requires two steps: Cat Name and a "Normal Baseline" photo.

### 1.2 Photo-First Logging
- A photo is **mandatory** for every daily check-in.
- Daily check-ins must be limited to **one entry per cat per date** (unique constraint).

### 1.3 The Vibe Score
- Every check-in must include a "Vibe Score" (1-5 scale).
- UI must represent these as icons, not just numbers (Happy, Quiet, Off, Hide-y, Energetic).

### 1.4 Visual Timeline
- The primary interface is a newest-first vertical timeline.
- Emphasis on side-by-side photo comparison and visual continuity.

### 1.5 Minimal Web App (PWA)
- Strictly a web-based implementation.
- Must include a manifest for "Add to Home Screen" (PWA).

---

## 2. Minimal Data Fields
- **Cat**: Name, ID, Owner ID.
- **Check-in**: ID, Cat ID, Photo URL, Vibe Score (Required), Note (Optional), Routine Flags (Optional), Timestamp.

---

## 3. Non-Goals (Strictly Excluded)
- **Medical Diagnosis**: No clinical advice, prescriptive warnings, or "Your cat has [X]" alerts.
- **Complex Analytics**: No line charts, scatter plots, or multi-dimensional data viz.
- **Community/Social**: No sharing feeds, "friends" lists, or public galleries.
- **Messaging Integration**: No WhatsApp, Telegram, or SMS-based logging.
- **Multi-Cat Support**: No switching between cats or aggregate views for multiple cats.
- **Medical Taxonomy**: No complex clinical enums (e.g., specific stool types, blood markers).

---

## 4. UX Guardrails
- **Neutral Language**: Use "Observed" or "Noticed" instead of "Issue" or "Problem."
- **Low Friction**: Core log flow must be ≤ 3 interactions.
- **Anxiety-Reduced UI**: No loud red alerts or flashing notifications.
