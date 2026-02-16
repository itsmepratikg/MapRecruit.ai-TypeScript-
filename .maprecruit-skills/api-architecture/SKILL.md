---
name: api-architecture
description: Guides RESTful API design according to MapRecruit standards. Use when developing or modifying backend endpoints.
---

# API Architecture Skill

Ensures backend endpoints are consistent, versioned, and follow REST best practices.

## When to use this skill

- When creating new API routes.
- When modifying existing backend services.
- When designing data transfer objects (DTOs).

## How to use it

### 1. Endpoint Naming
- Use plural nouns for resources (e.g., `/api/v1/campaigns`).
- Use lowercase, hyphenated paths.
- Limit nesting to 2-3 levels maximum.

### 2. Response Standards
- **Status Codes**: 
  - `201` for created resources.
  - `200` for successes.
  - `400` for validation errors.
  - `404` for missing resources.
- **Consistency**: Return a predictable JSON structure for all responses.

### 3. Maintenance
- **Versioning**: Always prefix with `/v1/` or appropriate versioning.
- **Filtering**: Use query parameters for filtering and pagination rather than custom paths.
