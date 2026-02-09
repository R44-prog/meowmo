# Deliberation: Clinical Trend Analysis & Metabolic Drift
**Date**: 2026-02-09
**Participants**: Iris, Dr. Quinn, Ash, Elia

## 1. Opening
**Elia (Facilitator)**: We've mastered basic anomaly detection. Now we need "The Brain 2.0." How do we move from simple patterns to identifying subtle, long-term shifts in a cat's health?

## 2. Discussion

### **Dr. Quinn (Clinical Intelligence)**
"In veterinary medicine, 'subtle' is the most dangerous word. A cat losing 5% of their weight or showing a 10% decrease in mobility over a month is often more significant than a one-day hiding episode. We need 'Week-over-Week' (WoW) comparisons of Vibe and appetite levels. I call this 'Metabolic Drift'."

### **Iris (Intelligence)**
"I can implement a baseline comparison engine. We'll take the median vibe and appetite score from 'Context A' (Days 15-28) and compare it against 'Context B' (Days 1-14). If the delta exceeds a threshold, we flag a 'Drift' insight. This filters out the daily 'vibe noise' and focuses on the underlying health signal."

### **Ash (Growth/Retention)**
"This is the ultimate retention feature. If we can tell a user, 'Hey, your cat is 15% less energetic than last month,' that provides value they can't get anywhere else. It builds trust in the 'Meowmo Brain'."

### **Elia (Synthesis)**
"So we're moving from 'Anomaly' (a moment) to 'Drift' (a trend). Iris, let's update the `HealthAnalysisService` to support WoW analysis."

## 3. Consensus / Recommendation
1.  **Baseline Window**: Use 14 days as the standard baseline period.
2.  **Metabolic Drift**: Detect 15%+ shifts in average appetite or vibe over a 14-day window.
3.  **Trend Visualization**: Add a "Trend" indicator to the Insights page showing if the cat's vibe is "Improving," "Stable," or "Waning."

---
*Transcript recorded in the Council Chamber.*
