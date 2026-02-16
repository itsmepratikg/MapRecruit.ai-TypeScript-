---
name: testing-strategy
description: Outlines the multi-viewport audit and verification methodology. Use when preparing test cases or verifying features.
---

# Testing Strategy Skill

Standardizes the verification process for MapRecruit features.

## When to use this skill

- When validating new features across multiple devices.
- When generating final test reports.
- When auditing Dark Mode or responsive regressions.

## How to use it

### 1. Viewport Audits
Check every new UI feature in:
- **Desktop (1440px)**: Verify full layout and grid stability.
- **Tablet (768px)**: Verify collapsed sidebar and touch targets.
- **Mobile (375px)**: Verify overlay sidebar and card stacking.

### 2. Visual Regression Checklist
- [ ] Dark Mode: Ensure all slate-scale colors are correct.
- [ ] Typography: Check scaling and readability on small screens.
- [ ] Dynamic Data: Confirm that skeletons or loaders appear during async fetch.

### 3. Verification Documentation
- Cite specific file paths and line numbers in walkthroughs.
- Use `render_diffs` to provide proof of code changes.
- Provide screenshots or recordings for UI changes.
