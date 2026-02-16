---
name: code-validation
description: Enforces server-side first validation and consistent error handling for user inputs. Use when building forms or API handlers.
---

# Code Validation Skill

Ensures data integrity and security through systematic validation patterns.

## When to use this skill

- When creating frontend forms or input fields.
- When developing backend API handlers that receive user-provided data.
- When implementing business rules that require data format verification.

## How to use it

### 1. Validation Hierarchy
- **Server-Side First**: Never trust client-side validation alone. Always duplicate validation logic on the server to prevent bypass.
- **Fail Early**: Reject invalid data at the earliest possible entry point before processing.

### 2. Form Patterns
- **UX Feedback**: Use client-side validation for immediate feedback (e.g., red outlines, helper text).
- **Specific Errors**: Provide field-specific error messages that clearly explain *why* the input was rejected and how to fix it.

### 3. Security Considerations
- **All-player Logic**: Explicitly define what characters/types are allowed rather than trying to block specific malicious inputs.
- **Sanitization**: Sanitize all user input before storing it in the database to prevent injection attacks.
