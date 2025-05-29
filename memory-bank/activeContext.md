# Active Context

_Last updated: 2025-05-29_

## Current Focus
**Phase 4 – Game Features and Polish**
Sub-phase 4.1: Add Game States

### Immediate Tasks
1.  Create `MainMenuScene.ts` for the start screen.
2.  Create `GameOverScene.ts` for the game over screen.
3.  Integrate these scenes into the main game flow (transitions from Preloader, to MainMenu, to MainGame, to GameOver, and restart options).
4.  Consider basic pause functionality.

## Recent Changes
*   **Phase 3: Core Game Mechanics COMPLETED**
    *   Basic Game Scene implemented (`MainGameScene.ts`, Phaser instance in React).
    *   Bird character created with gravity and jump mechanics.
    *   Pipe system implemented (procedural texture, spawning, movement, collision, recycling).
    *   Scoring system added (tracking, display, high score with `localStorage` persistence).
*   **Phase 2: Game Assets and Resources PARTIALLY COMPLETED**
    *   `shoppy.png` added and integrated.
    *   `PreloaderScene.ts` created for asset loading.
    *   Procedural pipe texture generated.
*   **Phase 1: Project Setup and Basic Structure COMPLETED**
    *   Next.js project initialized (TypeScript, Tailwind, ESLint, App Router, `src/` dir).
    *   Git repository initialized.
    *   Prettier installed and configured.
    *   Core dependencies (Phaser, Zustand, Howler, Framer Motion) installed.
    *   Basic project and asset directory structure established.
*   Memory Bank initialized from `roadmap.md`.

## Upcoming Decisions
*   Design for Start Menu and Game Over screens.
*   Specifics of pause functionality (e.g., overlay, separate scene).
*   Asset requirements for UI elements (buttons, logos for new screens).
*   Final choice of package manager (still using npm, as per `create-next-app` default).

## Risks / Considerations
*   Managing scene transitions cleanly.
*   Ensuring consistent UI/UX across different game states.
*   Asset licensing for any new UI assets to be obtained.