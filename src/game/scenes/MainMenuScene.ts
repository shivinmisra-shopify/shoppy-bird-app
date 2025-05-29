import * as Phaser from 'phaser';

const SCENE_KEY = 'MainMenuScene';

export class MainMenuScene extends Phaser.Scene {
  private clouds!: Phaser.GameObjects.Group;

  constructor() {
    super({ key: SCENE_KEY });
  }

  preload() {
    // Assets like a logo or custom button graphics would be loaded in PreloaderScene
    // For now, we'll use Phaser's built-in text and graphics for buttons.
    // Generate cloud textures for main menu
    this.createCloudTextures();
  }

  createCloudTextures() {
    // Create multiple cloud variations
    for (let i = 1; i <= 3; i++) {
      const gfx = this.make.graphics({ x: 0, y: 0 }, false);
      const cloudWidth = 60 + (i * 20);
      const cloudHeight = 30 + (i * 10);

      // Create fluffy cloud shape with multiple circles
      gfx.fillStyle(0xffffff, 0.7); // White with some transparency

      // Main cloud body
      gfx.fillCircle(cloudWidth/2, cloudHeight/2, cloudHeight/2);

      // Add fluffy bumps
      gfx.fillCircle(cloudWidth * 0.3, cloudHeight/2, cloudHeight * 0.4);
      gfx.fillCircle(cloudWidth * 0.7, cloudHeight/2, cloudHeight * 0.35);
      gfx.fillCircle(cloudWidth * 0.2, cloudHeight * 0.3, cloudHeight * 0.25);
      gfx.fillCircle(cloudWidth * 0.8, cloudHeight * 0.4, cloudHeight * 0.3);

      // Add some variation to each cloud type
      if (i === 2) {
        gfx.fillCircle(cloudWidth * 0.5, cloudHeight * 0.2, cloudHeight * 0.2);
      }
      if (i === 3) {
        gfx.fillCircle(cloudWidth * 0.15, cloudHeight * 0.6, cloudHeight * 0.2);
        gfx.fillCircle(cloudWidth * 0.85, cloudHeight * 0.6, cloudHeight * 0.2);
      }

      gfx.generateTexture(`menuCloud${i}`, cloudWidth, cloudHeight);
      gfx.destroy();
    }
  }

  create() {
    const gameWidth = Number(this.sys.game.config.width) || 800;
    const gameHeight = Number(this.sys.game.config.height) || 600;

    // Background with gradient effect
    this.cameras.main.setBackgroundColor('#003366'); // A deep blue

    // Add background decoration - simple gradient rectangles
    const graphics = this.add.graphics();
    graphics.fillGradientStyle(0x003366, 0x003366, 0x001133, 0x001133, 1);
    graphics.fillRect(0, 0, gameWidth, gameHeight);

    // Initialize cloud system
    this.clouds = this.add.group();
    this.spawnMenuClouds();

    // Game Title
    this.add.text(gameWidth / 2, gameHeight * 0.2, 'Shoppy Bird v2', {
      fontSize: `${Math.min(gameWidth * 0.08, 56)}px`,
      color: '#ffffff',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 8,
      align: 'center'
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(gameWidth / 2, gameHeight * 0.3, 'Flap your way to victory!', {
      fontSize: `${Math.min(gameWidth * 0.025, 20)}px`,
      color: '#cccccc',
      fontStyle: 'italic',
      align: 'center'
    }).setOrigin(0.5);

    // Start Button
    const startButton = this.add.text(gameWidth / 2, gameHeight * 0.5, 'Start Game', {
      fontSize: `${Math.min(gameWidth * 0.04, 32)}px`,
      color: '#ffffff',
      backgroundColor: '#007bff',
      padding: { x: 20, y: 15 },
      fontStyle: 'bold'
    })
    .setOrigin(0.5)
    .setInteractive({ useHandCursor: true });

    startButton.on('pointerdown', () => {
      this.scene.start('MainGameScene');
    });

    startButton.on('pointerover', () => {
        startButton.setBackgroundColor('#0056b3');
        startButton.setScale(1.05);
    });

    startButton.on('pointerout', () => {
        startButton.setBackgroundColor('#007bff');
        startButton.setScale(1.0);
    });

    // Instructions Section
    const instructionsY = gameHeight * 0.65;
    this.add.text(gameWidth / 2, instructionsY, 'How to Play:', {
        fontSize: `${Math.min(gameWidth * 0.03, 24)}px`,
        color: '#ffffff',
        fontStyle: 'bold',
        align: 'center'
      }).setOrigin(0.5);

    // Desktop Instructions
    const desktopInstructions = [
      '• Press SPACE or Click to Jump',
      '• Avoid the Green Pipes',
      '• Score Points by Passing Through Gaps',
      '• Press P to Pause'
    ];

    // Mobile Instructions
    const mobileInstructions = [
      '• Tap Screen to Jump',
      '• Avoid the Green Pipes',
      '• Score Points by Passing Through Gaps',
      '• Tap Pause Button to Pause'
    ];

    // Detect if likely mobile device
    const isMobile = gameWidth < 600 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    const instructions = isMobile ? mobileInstructions : desktopInstructions;

    instructions.forEach((instruction, index) => {
      this.add.text(gameWidth / 2, instructionsY + 35 + (index * 25), instruction, {
        fontSize: `${Math.min(gameWidth * 0.02, 16)}px`,
        color: '#dddddd',
        align: 'center'
      }).setOrigin(0.5);
    });

    // Best Score Display
    const highScore = parseInt(localStorage.getItem('shoppyBirdHighScore') || '0');
    if (highScore > 0) {
      this.add.text(gameWidth / 2, gameHeight * 0.9, `Best Score: ${highScore}`, {
        fontSize: `${Math.min(gameWidth * 0.025, 20)}px`,
        color: '#ffff99',
        fontStyle: 'bold',
        align: 'center'
      }).setOrigin(0.5);
    }

    console.log('MainMenuScene created.');
  }

  spawnMenuClouds() {
    const gameWidth = Number(this.sys.game.config.width) || 800;
    const gameHeight = Number(this.sys.game.config.height) || 600;

    // Spawn 5-6 clouds across the screen for a nice background
    for (let i = 0; i < 6; i++) {
      const x = Phaser.Math.Between(0, gameWidth);
      const y = Phaser.Math.Between(50, gameHeight - 100);
      this.createMenuCloudSprite(x, y);
    }
  }

  createMenuCloudSprite(x: number, y: number) {
    // Randomly choose cloud type
    const cloudType = Phaser.Math.Between(1, 3);
    const cloud = this.add.image(x, y, `menuCloud${cloudType}`);

    // Random scale for variety
    const scale = Phaser.Math.FloatBetween(0.5, 1.0);
    cloud.setScale(scale);

    // Set depth to be behind everything except background
    cloud.setDepth(-1);

    // Add to clouds group
    this.clouds.add(cloud);

    // Add gentle floating animation
    this.tweens.add({
      targets: cloud,
      x: x + Phaser.Math.Between(-20, 20),
      y: y + Phaser.Math.Between(-10, 10),
      duration: Phaser.Math.Between(3000, 6000),
      ease: 'Sine.easeInOut',
      yoyo: true,
      repeat: -1
    });
  }
}