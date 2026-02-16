---
name: react-patterns
description: Advanced React development using modern composition patterns, performance optimizations, and hooks. Use when building scalable component libraries.
---

# React Patterns Skill

Ensures frontend code leverages the full power of React for performance and developer experience.

## When to use this skill

- When building complex UI components that require high reusability.
- When optimizing render performance.
- When designing custom hooks or context providers.

## How to use it

### 1. Composition Patterns
- **Compound Components**: Use patterns like `<Tabs><TabList /><TabPanels /></Tabs>` for flexible, declarative APIs.
- **Render Props & HOCs**: Use these patterns only when composition or hooks are insufficient.
- **Component Injection**: Pass components as props to allow users to override specific parts of a complex UI.

### 2. Performance Optimization
- **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` judiciously to prevent unnecessary re-renders.
- **Code Splitting**: Use `React.lazy` and `Suspense` to load components only when needed.
- **Windowing**: Use virtualization (e.g., `react-window`) for long lists of data (like candidate profiles).

### 3. State Management
- **Local vs Global**: Always keep state as local as possible. Lift it up only when strictly necessary.
- **Custom Hooks**: Encapsulate complex logic into reusable hooks (e.g., `useCampaignStats`, `useProfileSearch`).
