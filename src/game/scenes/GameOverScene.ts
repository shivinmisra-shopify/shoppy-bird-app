import * as Phaser from 'phaser';

const SCENE_KEY = 'GameOverScene';

export class GameOverScene extends Phaser.Scene {
  private score: number = 0;
  private highScore: number = 0;

  constructor() {
    super({ key: SCENE_KEY });
  }

  init(data: { score: number, highScore: number }) {
    this.score = data.score || 0;
    this.highScore = data.highScore || 0;
  }

  create() {
    const gameWidth = Number(this.sys.game.config.width) || 800;
    const gameHeight = Number(this.sys.game.config.height) || 600;

    this.cameras.main.setBackgroundColor('#330000'); // A dark red

    // Game Over Title with responsive sizing
    this.add.text(gameWidth / 2, gameHeight / 2 - 150, 'Game Over', {
      fontSize: `${Math.min(gameWidth * 0.1, 64)}px`,
      color: '#ffdddd',
      fontStyle: 'bold',
      stroke: '#550000',
      strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5);

    // Display Score with responsive sizing
    this.add.text(gameWidth / 2, gameHeight / 2 - 50, 'Your Score: ' + this.score, {
      fontSize: `${Math.min(gameWidth * 0.05, 32)}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    // Display High Score with responsive sizing
    this.add.text(gameWidth / 2, gameHeight / 2, 'Best Score: ' + this.highScore, {
        fontSize: `${Math.min(gameWidth * 0.045, 28)}px`,
        color: '#ffffcc',
        fontStyle: 'italic',
        align: 'center'
      }).setOrigin(0.5);

    // Performance feedback
    let performanceMessage = '';
    if (this.score === 0) {
      performanceMessage = 'Keep trying! 💪';
    } else if (this.score < 5) {
      performanceMessage = 'Good start! 🌟';
    } else if (this.score < 10) {
      performanceMessage = 'Nice flying! 🚀';
    } else if (this.score < 20) {
      performanceMessage = 'Great job! 🔥';
    } else {
      performanceMessage = 'Amazing! 🏆';
    }

    this.add.text(gameWidth / 2, gameHeight / 2 + 40, performanceMessage, {
      fontSize: `${Math.min(gameWidth * 0.025, 20)}px`,
      color: '#90EE90',
      fontStyle: 'italic',
      align: 'center'
    }).setOrigin(0.5);

    // Restart Button with mobile-friendly sizing
    const restartButton = this.add.text(gameWidth / 2, gameHeight / 2 + 100, 'Restart Game', {
      fontSize: `${Math.min(gameWidth * 0.05, 32)}px`,
      color: '#ffffff',
      backgroundColor: '#28a745', // Green color for restart
      padding: { x: 20, y: 15 },
      fontStyle: 'bold'
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    // Scale up button on mobile for easier touching
    if (gameWidth < 600) {
      restartButton.setScale(1.1);
    }

    restartButton.on('pointerdown', () => {
      // Restart the MainGameScene.
      // Note: This will call create() in MainGameScene again, resetting its state.
      this.scene.get('MainGameScene').scene.restart(); // Restart the main game scene directly
      this.scene.stop(SCENE_KEY); // Stop the current Game Over scene
    });

    restartButton.on('pointerover', () => {
        restartButton.setBackgroundColor('#1e7e34');
        restartButton.setScale(gameWidth < 600 ? 1.15 : 1.05);
    });

    restartButton.on('pointerout', () => {
        restartButton.setBackgroundColor('#28a745');
        restartButton.setScale(gameWidth < 600 ? 1.1 : 1.0);
    });

    // Add "Back to Menu" button
    const menuButton = this.add.text(gameWidth / 2, gameHeight / 2 + 160, 'Main Menu', {
      fontSize: `${Math.min(gameWidth * 0.035, 24)}px`,
      color: '#ffffff',
      backgroundColor: '#6c757d',
      padding: { x: 15, y: 10 },
      fontStyle: 'bold'
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    if (gameWidth < 600) {
      menuButton.setScale(1.1);
    }

    menuButton.on('pointerdown', () => {
      this.scene.start('MainMenuScene');
    });

    menuButton.on('pointerover', () => {
        menuButton.setBackgroundColor('#5a6268');
        menuButton.setScale(gameWidth < 600 ? 1.15 : 1.05);
    });

    menuButton.on('pointerout', () => {
        menuButton.setBackgroundColor('#6c757d');
        menuButton.setScale(gameWidth < 600 ? 1.1 : 1.0);
    });

    console.log('GameOverScene created. Score: ' + this.score + ", High Score: " + this.highScore);
  }
}