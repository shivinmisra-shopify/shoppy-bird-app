# Active Context

_Last updated: 2025-05-29_

## Current Focus
**Phase 5 – UI and User Experience**
Sub-phase 5.1: Enhance Main Menu and 5.3: Implement Responsive Design

### Immediate Tasks
1. Enhance MainMenuScene with better instructions and layout
2. Implement responsive design for mobile compatibility
3. Add touch controls optimization
4. Optimize layouts for different screen sizes
5. Consider adding settings menu or difficulty selection

## Recent Changes
*   **Latest Enhancement: Gameplay & Visual Improvements**
    *   ✅ **Made game significantly easier**: Larger gaps (150→250px), slower spawning (1.5s→2.2s), reduced speed (-150→-120)
    *   ✅ **Improved bird physics**: Stronger jump (-300→-320), reduced gravity (800→700) for better control
    *   ✅ **Fixed pipe symmetry**: Redesigned pipes to be perfectly symmetrical with centered bodies
    *   ✅ **Enhanced pipe visuals**: Cleaner shading, better inner rim depth, professional 3D appearance
    *   ✅ Added beautiful artificial cloud system with parallax scrolling in MainGameScene
    *   ✅ Added animated cloud backgrounds in MainMenuScene
*   **Phase 5: UI and User Experience COMPLETED**
    *   ✅ Enhanced MainMenu with responsive design, mobile/desktop-specific instructions
    *   ✅ Implemented comprehensive responsive design for mobile compatibility
    *   ✅ Added touch controls optimization and mobile-friendly layouts
    *   ✅ Professional page layout with gradient backgrounds and mobile hints
*   **Phase 4: Game Features and Polish COMPLETED (except 4.3)**
    *   ✅ Phase 4.1: Game States (MainMenuScene, GameOverScene, pause functionality, restart mechanism)
    *   ✅ Phase 4.2: Visual Effects (particle effects, screen shake, collision feedback, scene transitions)
    *   ⏭️ Phase 4.3: Sound System (SKIPPED - will implement when audio assets are available)
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
*   Settings menu design and features (volume controls, difficulty, controls explanation).
*   Mobile touch control implementation strategy.
*   Responsive breakpoints and scaling strategy.
*   Whether to add difficulty selection or other game modes.

## Risks / Considerations
*   Ensuring game remains playable across all device sizes.
*   Touch control responsiveness and user experience.
*   Performance on mobile devices.
*   Maintaining game balance across different screen sizes.