---
name: execution-master
description: Disciplined execution of complex implementation plans with checkpoints and verification. Use during multi-step refactors or large feature builds.
---

# Execution Master Skill

Ensures complex coding tasks are completed systematically and verified at every step.

## When to use this skill

- During large-scale refactors (e.g., migrating state management).
- When implementing complex features spanning multiple files/layers.
- When following a multi-phase implementation plan.

## How to use it

### 1. Structured Execution
- **Checkpoints**: Break down the task into small, atomic commits/steps. Never move to the next step until the current one is verified.
- **Parallelization**: When possible, group independent tool calls to optimize execution speed without sacrificing clarity.

### 2. Verification Loops
- **Continuous Testing**: Run relevant tests (unit/integration) after every significant change.
- **Log Analysis**: Check terminal logs and browser console for errors immediately after applying changes.
- **UI Validation**: For frontend changes, use the browser tool to confirm the visual state matches the requirements.

### 3. Rollback Readiness
- Maintain a clear mental (or written) record of the "last known good state" to allow for quick backtracking if an approach fails.
