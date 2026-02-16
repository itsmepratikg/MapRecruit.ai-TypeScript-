---
name: coding-safety
description: Enforces defensive programming and interactive safety patterns like confirmation modals for destructive actions. Use when adding Save/Delete functionality or handling external data.
---

# Coding Safety Skill

This skill ensures that the application remains stable and user-friendly through defensive code and safety checks.

## When to use this skill

- When implementing "Save", "Delete", or "Update" actions.
- When consuming API data that might be null or undefined (e.g., user profiles, campaigns).
- When performing state updates that could fail.

## How to use it

### 1. Defensive Programming
- **Optional Chaining**: Always use optional chaining (`?.`) when accessing properties of objects that are initially null or fetched asynchronously (e.g., `userProfile?.companyName`).
- **Default Values**: Provide sensible defaults for data-dependent UI elements to prevent "Cannot read property of undefined" crashes.

### 2. Interactive Safety
- **Confirmation Modals**: Every destructive action (Delete) or significant state change (Save/Archive) MUST be preceded by a confirmation dialog to prevent accidental clicks.
- **Loading States**: Disable action buttons while a request is in progress to prevent duplicate submissions.

### 3. Error Handling
- Use try/catch blocks for all API calls and provide user-friendly feedback (Toasts/Alerts) instead of just logging to the console.
