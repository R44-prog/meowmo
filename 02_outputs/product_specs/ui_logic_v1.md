# UX/UI Logic: The "Calm" PWA

This document defines the visual and interaction design for the V1 Lean PWA, focusing on the "Swipe-to-Log" flow.

---

## 1. Design System (Calm & Earthy)

- **Primary Background**: `#FDFCF8` (Soft Cream/Eggshell) - reduce blue light stress.
- **Accent Color**: `#5D6D7E` (Steel Blue) - neutral, professional, non-alarmist.
- **System Colors**:
  - Success: `#82E0AA` (Pale Mint)
  - Neutral: `#D5DBDB` (Cloud Grey)
  - *Avoid: Bright Red, Harsh Black.*
- **Typography**: Sans-serif, generous line spacing (`Inten` or `Roboto`).

---

## 2. Screen Logic

### Screen 1: The Onboarding (One-Time)
- **Visual**: Large, centered text input.
- **Copy**: "What's your cat's name?"
- **Action**: [Continue] - Saves to local/state and redirects to Entry 1.

### Screen 2: The Timeline (The Daily View)
- **Structure**: Vertical scroll.
- **Header**: "[Cat Name]'s Timeline" (Sticky).
- **Cards**: Large images (rounded corners, subtle shadow).
- **Meta**: Date + Vibe Icon (bottom right overlay).
- **FAB (Floating Action Button)**: Large (+) button in the bottom right for "Log."

---

## 3. The "Swipe-to-Log" Flow

### Step A: Capture (Immediate)
- Tapping FAB opens the device camera/gallery.
- **UI State**: Full-bleed photo preview with "Success" checkmark once upload to Storage begins.

### Step B: The Vibe Swipe
- **Component**: A horizontal scroller of 5 large, hand-drawn style icons.
- **Icons**: 
  1. 🌟 (Happy)
  2. ☁️ (Quiet)
  3. 🍂 (Off)
  4. 📦 (Hide-y)
  5. ⚡ (Energetic)
- **Interaction**: Swiping highlights the current icon. Tapping selects.

### Step C: The Note (Optional)
- Text box expands on focus. 
- Auto-focus deferred to avoid keyboard jump.

### Step D: Done
- Button: "Save Observation."
- **Feedback**: Smooth fade-out of the log booth, slide-in of the new Timeline card.

---

## 4. Interaction Guardrails
- **No Animations**: Use cross-fades rather than bouncy/elastic motions to keep it "Quiet."
- **Touch Targets**: Min 48px for all buttons.
- **Offline Aware**: Show a "Saving locally..." indicator if the network drops during upload.

---

## 5. Success Criteria (UX)
- User can go from App Open to "Log Finished" in < 4 taps.
- The interface feels like a "journal," not a "medical app."
