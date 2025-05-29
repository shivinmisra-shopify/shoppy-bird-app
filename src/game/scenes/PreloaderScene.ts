import * as Phaser from 'phaser';

export const PARTICLE_TEXTURE_KEY = 'whiteParticle';

export class PreloaderScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloaderScene' });
  }

  preload() {
    // Display a loading message or progress bar if desired
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    const loadingText = this.make.text({
      x: width / 2,
      y: height / 2 - 50,
      text: 'Loading...',
      style: {
        font: '20px monospace',
        color: '#ffffff'
      }
    });
    loadingText.setOrigin(0.5, 0.5);

    // Example of loading an image asset (our bird)
    // The key 'shoppy' will be used to reference this image later
    // The path is relative to the `public` directory
    this.load.image('shoppy', 'assets/shoppy.png');

    // Generate particle texture
    this.createParticleTexture();

    // Add other assets to load here (spritesheets, audio, etc.)
    // this.load.spritesheet('player', 'assets/sprites/player.png', { frameWidth: 32, frameHeight: 32 });
    // this.load.audio('jumpSound', ['assets/audio/jump.ogg', 'assets/audio/jump.mp3']);

    // Event to switch to the next scene when all assets are loaded
    this.load.on('complete', () => {
      loadingText.destroy();
      this.scene.start('MainMenuScene'); // Start with MainMenuScene
      console.log('Assets loaded, starting MainMenuScene!');
    });
  }

  createParticleTexture() {
    const gfx = this.make.graphics({ x: 0, y: 0 }, false);
    gfx.fillStyle(0xffffff, 1);
    gfx.fillRect(0, 0, 8, 8); // A small 8x8 white square
    gfx.generateTexture(PARTICLE_TEXTURE_KEY, 8, 8);
    gfx.destroy();
    console.log('Particle texture generated:', PARTICLE_TEXTURE_KEY);
  }

  create() {
    // This method is called once the preload is complete
    // You can add any setup here that doesn't involve assets not yet loaded
    // For a preloader scene, it's often minimal or empty as its main job is loading.
  }
}