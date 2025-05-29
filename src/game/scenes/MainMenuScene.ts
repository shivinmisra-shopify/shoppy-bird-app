import * as Phaser from 'phaser';

const SCENE_KEY = 'MainMenuScene';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENE_KEY });
  }

  preload() {
    // Assets like a logo or custom button graphics would be loaded in PreloaderScene
    // For now, we'll use Phaser's built-in text and graphics for buttons.
  }

  create() {
    const gameWidth = Number(this.sys.game.config.width) || 800;
    const gameHeight = Number(this.sys.game.config.height) || 600;

    // Background (can be an image later)
    this.cameras.main.setBackgroundColor('#003366'); // A deep blue

    // Game Title
    this.add.text(gameWidth / 2, gameHeight / 2 - 100, 'Shoppy Bird v2', {
      fontSize: '56px',
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5);

    // Start Button
    const startButton = this.add.text(gameWidth / 2, gameHeight / 2 + 50, 'Start Game', {
      fontSize: '32px',
      color: '#ffffff',
      backgroundColor: '#007bff',
      padding: { x: 20, y: 10 },
      fontStyle: 'bold'
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    startButton.on('pointerdown', () => {
      this.scene.start('MainGameScene');
    });

    startButton.on('pointerover', () => {
        startButton.setBackgroundColor('#0056b3');
    });

    startButton.on('pointerout', () => {
        startButton.setBackgroundColor('#007bff');
    });

    // Instructions Text
    this.add.text(gameWidth / 2, gameHeight / 2 + 120, 'Click or Press SPACE to Jump', {
        fontSize: '20px',
        color: '#dddddd',
        fontStyle: 'italic',
        align: 'center'
      }).setOrigin(0.5);

    console.log('MainMenuScene created.');
  }
}