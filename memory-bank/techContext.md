# Technological Context

## Primary Stack
• Next.js 14 (App Router) – React 18, TypeScript
• Tailwind CSS – utility-first styling
• Phaser 3 – HTML5 2D game framework
• Zustand – lightweight global state store
• Framer Motion – UI animations & transitions
• Howler.js – audio playback
• Jest + React-Testing-Library – unit & integration tests
• Cypress – end-to-end testing
• Vercel – hosting & CI/CD

## Development Environment
• Node ≥ 18, pnpm / npm / yarn (TBD)
• ESLint + Prettier + Husky pre-commit hooks
• GitHub Actions for CI
• macOS / Linux primary dev targets

## Technical Constraints
• Must run in modern evergreen browsers (Chrome / Safari / Firefox).
• Mobile support (touch events, responsive layout) is mandatory.
• Bundle size ≤ 2 MB (gzipped) for initial page load.
• All game assets must be self-hosted (no third-party CDNs).

## External Dependencies
| Lib | Purpose |
|-----|---------|
| Phaser 3 | Game engine |
| Tailwind | CSS utilities |
| Framer Motion | Animations |
| Zustand | State management |
| Howler.js | Audio |
| Jest + RTL | Unit tests |
| Cypress | e2e tests |
| Next.js server runtime | Edge functions |