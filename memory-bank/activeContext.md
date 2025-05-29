# Active Context

_Last updated: 2025-05-29_

## Current Focus
Phase 1 – Project Setup & Basic Structure.

### Immediate Tasks
1. Bootstrap Next.js 14 project with TypeScript (`create-next-app`).
2. Configure ESLint, Prettier, Husky, and Git hooks.
3. Install Tailwind, Phaser 3, and core libraries.
4. Establish base directory structure (`app/`, `components/`, `game/`, `public/assets/`).

## Recent Changes
• Memory Bank initialized from `roadmap.md`.

## Upcoming Decisions
• Choose package manager (pnpm vs yarn).
• Define asset naming conventions.
• Decide testing framework folder layout (e.g., `__tests__` vs `tests/`).

## Risks / Considerations
• Phaser requires DOM; ensure dynamic import to avoid SSR errors.
• Tailwind + Framer size overhead – use tree-shaking & code-splitting.
• Asset licensing for sprites/audio must be confirmed.