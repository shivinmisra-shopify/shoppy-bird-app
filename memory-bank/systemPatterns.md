# System Patterns & Architecture

## High-Level Architecture
```
Next.js 14 (App Router)
│
├─ React UI layer   ←— Tailwind + Framer Motion
│
└─ Phaser 3 game instance (runs inside a React component)
```

• **Composition** – Phaser canvas is embedded via a dedicated `GameCanvas` React component mounted client-side.
• **State Separation** – Game logic lives in Phaser scenes; global UI state (mute, high score) is held in Zustand.
• **Scene Pattern** – Each game state (Boot, Menu, Play, GameOver) is a Phaser `Scene` class.
• **Hooks** – Custom React hooks expose game events to the React UI (e.g., `useScore`, `useGameState`).
• **Animation Layer** – Framer Motion handles UI transitions, independent from the game loop.
• **Atomic Components** – UI is built using Tailwind-styled atomic React components (Button, Panel, ScoreBoard).

## Key Technical Decisions
• **Next.js App Router** for file-based routing and edge-optimized SSR.
• **Client-only Phaser** – Phaser code is dynamically imported to avoid SSR issues.
• **Zustand** chosen for its minimal boilerplate and reactivity outside React context providers.
• **TypeScript strict mode** enforces strong typing across both React and Phaser code bases.
• **CI** will run lint, type-check, tests, and Cypress e2e in GitHub Actions.

## Component Relationships
`App` → `Layout` → `MenuScreen` ↔ `GameCanvas` ↔ `HUDOverlay`

Events flow: Phaser → Zustand → React HUD | React UI (Framer) → Phaser controls.