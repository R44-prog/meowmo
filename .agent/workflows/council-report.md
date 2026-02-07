---
description: Generate a standardized Agent Council report after changes
---

This workflow automates the creation of a Council Report to keep Rachid updated on after every major change.

1. Finalize your code changes.
// turbo
2. Run the report generator with a summary of what you did:
   ```bash
   node scripts/generate_council_report.mjs "Summary of your changes here"
   ```
3. Use the `notify_user` tool to share the generated path in `02_outputs/audits/`.
