'use client'

import * as Phaser from 'phaser'
import { useEffect, useRef } from 'react'
import { PreloaderScene } from '@/game/scenes/PreloaderScene'
import { MainMenuScene } from '@/game/scenes/MainMenuScene';
import { MainGameScene } from '@/game/scenes/MainGameScene';
import { GameOverScene } from '@/game/scenes/GameOverScene';
// We will create MainGameScene later

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PhaserGameProps {}

const PhaserGame: React.FC<PhaserGameProps> = (/*props*/) => {
  const gameRef = useRef<Phaser.Game | null>(null) // Ref to store the game instance
  // gameContainerRef is no longer strictly needed here if Phaser targets the ID directly,
  // but can be kept if direct DOM manipulation of the container is ever needed.
  // const gameContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const gameConfig: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: 'game-container', // ID of the div in page.tsx
        width: 800,  // Design width of the game
        height: 600, // Design height of the game
        scale: {
          mode: Phaser.Scale.FIT, // Fit to parent container, maintain aspect ratio
          autoCenter: Phaser.Scale.CENTER_BOTH, // Center vertically and horizontally
        },
        backgroundColor: '#2d2d2d',
        physics: {
          default: 'arcade',
          arcade: {
            gravity: { x: 0, y: 0 },
            debug: process.env.NODE_ENV === 'development',
          },
        },
        scene: [
          PreloaderScene,
          MainMenuScene,
          MainGameScene,
          GameOverScene,
        ],
      };

      // Initialize the game instance
      gameRef.current = new Phaser.Game(gameConfig);

      // Cleanup function to destroy the game instance when the component unmounts
      return () => {
        gameRef.current?.destroy(true);
        gameRef.current = null;
      };
    }
  }, []); // Empty dependency array ensures this effect runs only once on mount

  // The div container is now primarily managed by page.tsx for its dimensions and responsiveness.
  // This component just ensures the Phaser game is initialized into it.
  // If you remove the div from here, ensure page.tsx has a div with id="game-container".
  // For simplicity, we ensure the div exists via page.tsx and Phaser targets it by ID.
  return null; // The Phaser game will render into the div specified by parent ID.
  // Alternatively, if you want this component to render the container for some reason:
  // return <div ref={gameContainerRef} id="game-container-explicit-from-component" style={{ width: '100%', height: '100%' }} />;
};

export default PhaserGame;