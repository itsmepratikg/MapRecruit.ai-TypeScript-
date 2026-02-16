---
name: brand-identity
description: Enforces MapRecruit's visual identity, including the Emerald/Slate color palette, Lucide icons, and responsive breakpoints. Use when building UI features.
---

# Brand Identity Skill

Maintains visual consistency across the MapRecruit platform.

## When to use this skill

- When creating new pages or UI components.
- When styling elements using Tailwind CSS.
- When selecting icons or defining layout structures.

## How to use it

### 1. Color Palette (Tailwind)
- **Primary Action**: `emerald-600` (Hover: `emerald-700`).
- **Surface (Light Mode)**: `bg-white` with `border-slate-200`.
- **Surface (Dark Mode)**: `bg-slate-800` with `border-slate-700`.
- **Background (Dark Mode)**: `bg-slate-900`.
- **AI/Intelligence**: `indigo-600` or `purple-600`.

### 2. Typography & Icons
- **Font**: Inter, sans-serif.
- **Icons**: Use `lucide-react`. Standard size is `16px` for actions, `20px` for navigation.
- **Visual Hierarchy**: Data-dense yet breathable. Use `p-6` or `p-8` for main content padding.

### 3. Micro-Interactions
- Use `transition-colors` or `transition-all` with `duration-200` for all interactive elements.
- Reveal action buttons on group hover (`group-hover:opacity-100`) for dense lists.
