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

    // Game Over Title
    this.add.text(gameWidth / 2, gameHeight / 2 - 150, 'Game Over', {
      fontSize: '64px',
      color: '#ffdddd',
      fontStyle: 'bold',
      stroke: '#550000',
      strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5);

    // Display Score
    this.add.text(gameWidth / 2, gameHeight / 2 - 50, 'Your Score: ' + this.score, {
      fontSize: '32px',
      color: '#ffffff',
      fontStyle: 'bold',
      align: 'center'
    }).setOrigin(0.5);

    // Display High Score
    this.add.text(gameWidth / 2, gameHeight / 2, 'Best Score: ' + this.highScore, {
        fontSize: '28px',
        color: '#ffffcc',
        fontStyle: 'italic',
        align: 'center'
      }).setOrigin(0.5);

    // Restart Button
    const restartButton = this.add.text(gameWidth / 2, gameHeight / 2 + 100, 'Restart Game', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#28a745', // Green color for restart
      padding: { x: 20, y: 10 },
      fontStyle: 'bold'
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    restartButton.on('pointerdown', () => {
      // Restart the MainGameScene.
      // Note: This will call create() in MainGameScene again, resetting its state.
      this.scene.get('MainGameScene').scene.restart(); // Restart the main game scene directly
      this.scene.stop(SCENE_KEY); // Stop the current Game Over scene
    });

    restartButton.on('pointerover', () => {
        restartButton.setBackgroundColor('#1e7e34');
    });

    restartButton.on('pointerout', () => {
        restartButton.setBackgroundColor('#28a745');
    });

    console.log('GameOverScene created. Score: ' + this.score + ", High Score: " + this.highScore);
  }
}