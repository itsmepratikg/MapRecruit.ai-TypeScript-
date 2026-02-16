---
name: system-architect
description: Expert system design focusing on modern architecture patterns, clean architecture, and scalability. Use during high-level design or restructuring.
---

# System Architect Skill

Guides the structural evolution of the MapRecruit codebase for long-term maintainability.

## When to use this skill

- When designing new backend services or data layers.
- When restructuring the project directory or module boundaries.
- When reviewing system designs for scalability and performance.

## How to use it

### 1. Architecture Patterns
- **Clean Architecture**: Separate business logic (Domain) from infrastructure (Database, External APIs) and presentation (UI).
- **Domain-Driven Design (DDD)**: Organize the codebase around core business domains (e.g., Candidates, Campaigns, Interviews).
- **SOLID Principles**: Enforce single responsibility and dependency inversion to reduce coupling.

### 2. Scalability & Performance
- **Bottleneck Identification**: Analyze database queries and API response times to identify areas for optimization.
- **Caching Strategies**: Use appropriate caching layers (Redis, local storage) to reduce redundant computations.
- **Asynchronous Processing**: Offload heavy tasks to background workers where appropriate.

### 3. Maintainability
- **Dry/Wet Balance**: Reduce duplication but avoid over-abstraction that makes the code hard to follow.
- **Clear Interfaces**: Define explicit contracts between different parts of the system.
