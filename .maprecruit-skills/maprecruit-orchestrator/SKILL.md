---
name: maprecruit-orchestrator
description: Master coordinator for MapRecruit.ai development. Dynamically activates and follows relevant skills in /.maprecruit-skills/ (Safety, Validation, AI/Architecture, RBAC, Design, etc.) based on the current task. Always call this at the start of any MapRecruit task.
---

# MapRecruit Orchestrator

This skill acts as the central intelligence hub for MapRecruit.ai development. It automatically routes the agent to the specific guidelines and best practices required for the task at hand.

## When to use this skill

- This skill is triggered automatically for ANY task related to the MapRecruit.ai-TypeScript codebase.
- Use this as the main decision-making hub to determine which specific sub-skills are needed.

## How to use it

### 1. Contextual Activation
Whenever a task is started, immediately check the `/.maprecruit-skills/` directory and identify which guidelines are relevant:
- **UI/Feature Changes**: Refer to `brand-identity` and `frontend-excellence`.
- **Backend/API Work**: Refer to `api-architecture` and `system-architect`.
- **Security/Auth**: Refer to `rbac-and-privacy` and `coding-safety`.
- **Form/Data Handling**: Refer to `code-validation` and `coding-safety`.
- **Verification/PRs**: Refer to `testing-strategy` and `execution-master`.

### 2. Execution Flow
- **Plan**: Use `execution-master` to structure the work and `system-architect` for high-level design.
- **Implement**: Follow the specific guidelines from the relevant skills (e.g., `brand-identity`, `react-patterns`).
- **Verify**: Use `testing-strategy` for multi-viewport audits and Dark Mode checks.

### 3. Safety First
- Always consult `coding-safety` when dealing with destructive actions or asynchronous state updates to ensure optional chaining and confirmation patterns are applied.

### 4. Cleanup & Maintenance
- **Post-Task**: At the end of every task or verification phase, invoke `workspace-cleanup` to archive temporary test scripts (`test_*.js`, `*.log`) to `.trash`.
