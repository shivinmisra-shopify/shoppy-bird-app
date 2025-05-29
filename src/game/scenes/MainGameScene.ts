import * as Phaser from 'phaser';
import { PARTICLE_TEXTURE_KEY } from './PreloaderScene'; // Import the key

const BIRD_JUMP_VELOCITY = -300;
const GRAVITY_STRENGTH = 800;
const BIRD_FLAP_ANGLE = -20; // Angle in degrees when flapping
const BIRD_DIVE_ANGLE = 90; // Max angle when diving
const BIRD_ANGULAR_VELOCITY = 200; // Speed of rotation

// Pipe constants
const PIPE_TEXTURE_KEY = 'pipeTexture';
const PIPE_WIDTH = 80; // Width of the pipe
const PIPE_HEAD_HEIGHT = 30; // Height of the wider pipe head
const PIPE_BODY_COLOR = 0x008000; // Green
const PIPE_HIGHLIGHT_COLOR = 0x32cd32; // Lime green
const PIPE_SHADOW_COLOR = 0x006400; // Dark green
const PIPE_GAP_SIZE = 150; // Vertical gap between pipes
const PIPE_SPAWN_INTERVAL = 1500; // Milliseconds between pipe spawns
const PIPE_SCROLL_SPEED = -150; // Pixels per second
const SCORE_ZONE_WIDTH = 5; // Width of the invisible scoring zone

export class MainGameScene extends Phaser.Scene {
  private shoppy!: Phaser.Physics.Arcade.Sprite;
  private jumpKey!: Phaser.Input.Keyboard.Key;
  private pipes!: Phaser.Physics.Arcade.Group;
  private scoringZones!: Phaser.Physics.Arcade.Group; // For score detection
  private pipeSpawnTimer!: Phaser.Time.TimerEvent;
  private isGameOver: boolean = false;
  private isPaused: boolean = false;
  private isAttemptingPause: boolean = false; // New flag for delayed pause mechanics
  private pauseKey!: Phaser.Input.Keyboard.Key;
  private pauseText!: Phaser.GameObjects.Text;
  private pauseButton!: Phaser.GameObjects.Text;

  private score: number = 0;
  private scoreText!: Phaser.GameObjects.Text;
  private highScore: number = 0;
  private highScoreText!: Phaser.GameObjects.Text;
  private jumpParticles!: Phaser.GameObjects.Particles.ParticleEmitter;

  constructor() {
    super({ key: 'MainGameScene' });
  }

  preload() {
    // Assets are already loaded by PreloaderScene
    // Generate the pipe texture
    this.createPipeTexture();
    // Particle texture is loaded in PreloaderScene
  }

  createPipeTexture() {
    const gfx = this.make.graphics({ x: 0, y: 0 }, false);
    const textureHeight = Number(this.sys.game.config.height) || 600;

    gfx.fillStyle(PIPE_BODY_COLOR);
    gfx.fillRect(0, PIPE_HEAD_HEIGHT, PIPE_WIDTH, textureHeight);

    gfx.fillStyle(PIPE_BODY_COLOR);
    gfx.fillRect(- (PIPE_WIDTH * 0.1), 0, PIPE_WIDTH * 1.2, PIPE_HEAD_HEIGHT);

    gfx.fillStyle(PIPE_HIGHLIGHT_COLOR);
    gfx.fillRect(- (PIPE_WIDTH * 0.1), 0, PIPE_WIDTH * 1.2, 5);
    gfx.fillRect(0, PIPE_HEAD_HEIGHT, 5, textureHeight);

    gfx.fillStyle(PIPE_SHADOW_COLOR);
    gfx.fillRect(- (PIPE_WIDTH * 0.1), PIPE_HEAD_HEIGHT - 5, PIPE_WIDTH * 1.2, 5);
    gfx.fillRect(PIPE_WIDTH - 5, PIPE_HEAD_HEIGHT, 5, textureHeight);

    gfx.generateTexture(PIPE_TEXTURE_KEY, PIPE_WIDTH, textureHeight);
    gfx.destroy();
  }

  create() {
    this.isGameOver = false;
    this.isPaused = false;
    this.isAttemptingPause = false;
    this.score = 0;

    const gameConfig = this.sys.game.config;
    const gameWidth = Number(gameConfig.width) || 800;
    const gameHeight = Number(gameConfig.height) || 600;

    this.cameras.main.setBackgroundColor('#70c5ce');

    // Start Shoppy lower and ensure physics body is reasonable
    this.shoppy = this.physics.add.sprite(gameWidth / 3, gameHeight * 0.6, 'shoppy'); // Start lower (60% down)

    // Set a reasonable physics body size (in case the sprite is large)
    this.shoppy.setDisplaySize(40, 40); // Force display size to be reasonable
    this.shoppy.body!.setSize(30, 30); // Set physics body to be smaller than display

    this.shoppy.setCollideWorldBounds(true);
    (this.shoppy.body as Phaser.Physics.Arcade.Body).onWorldBounds = true;
    this.shoppy.setDepth(1);

    this.jumpParticles = this.add.particles(0, 0, PARTICLE_TEXTURE_KEY, {
        speed: { min: 50, max: 150 },
        angle: { min: 225, max: 315 },
        scale: { start: 0.7, end: 0 },
        lifespan: { min: 200, max: 500 },
        gravityY: GRAVITY_STRENGTH / 2,
        blendMode: 'ADD',
        emitting: false
    });
    this.jumpParticles.setDepth(0);

    this.physics.world.gravity.y = GRAVITY_STRENGTH;
    this.physics.world.setBoundsCollision(false, false, true, true);

    this.jumpKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    this.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        const pauseButtonBounds = this.pauseButton ? this.pauseButton.getBounds() : null;
        if (pauseButtonBounds && pauseButtonBounds.contains(pointer.x, pointer.y)) {
            return;
        }
        if (!this.isPaused && !this.isGameOver) {
            this.jump();
        }
    }, this);

    this.pauseKey = this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.P);

    this.pipes = this.physics.add.group({ allowGravity: false, immovable: true });
    this.scoringZones = this.physics.add.group({ allowGravity: false, immovable: true });

    this.pipeSpawnTimer = this.time.addEvent({
      delay: PIPE_SPAWN_INTERVAL,
      callback: this.addPipeRow,
      callbackScope: this,
      loop: true,
    });

    // Delay collision detection setup to avoid immediate collisions
    this.time.delayedCall(100, () => {
        this.physics.add.collider(
          this.shoppy,
          this.pipes,
          this.handleCollision,
          () => !this.isPaused && !this.isGameOver,
          this
        );
        this.physics.add.overlap(this.shoppy, this.scoringZones, this.handleScoreTrigger, undefined, this);

        this.physics.world.on('worldbounds', (body: Phaser.Physics.Arcade.Body, up: boolean, down: boolean) => {
          if (body.gameObject === this.shoppy && (up || down)) {
            console.log('World bounds collision detected! Up:', up, 'Down:', down, 'Shoppy Y:', this.shoppy.y);
            if (!this.isGameOver && !this.isPaused) this.handleCollision();
          }
        });

        console.log('Collision detection enabled');
    });

    // UI elements
    this.scoreText = this.add.text(gameWidth / 2, 50, 'Score: 0', {
      fontSize: '32px', color: '#ffffff', fontStyle: 'bold', stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5).setDepth(5);

    this.highScore = parseInt(localStorage.getItem('shoppyBirdHighScore') || '0');
    this.highScoreText = this.add.text(gameWidth - 20, 20, 'Best: ' + this.highScore, {
      fontSize: '24px', color: '#ffffff', fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
    }).setOrigin(1, 0).setDepth(5);

    this.pauseText = this.add.text(gameWidth / 2, gameHeight / 2, 'Paused', {
      fontSize: '48px', color: '#ffff00', fontStyle: 'bold', stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5).setDepth(10).setVisible(false);

    this.pauseButton = this.add.text(20, 20, 'Pause', {
        fontSize: '20px', color: '#ffffff', backgroundColor: '#808080',
        padding: { x: 10, y: 5 }, fontStyle: 'bold'
    }).setOrigin(0,0).setDepth(5).setInteractive({ useHandCursor: true });

    this.pauseButton.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
        pointer.event.stopPropagation();
        if (!this.isGameOver) {
            if (!this.isPaused) {
                this.isPaused = true;
                this.isAttemptingPause = true;
                this.pauseButton.setText('Resume');
                this.pauseText.setVisible(true);
                console.log('Attempting Pause...');
            } else {
                this.togglePause();
            }
        }
    });
    this.pauseButton.on('pointerover', () => { if(this.pauseButton) this.pauseButton.setBackgroundColor('#505050'); });
    this.pauseButton.on('pointerout', () => { if(this.pauseButton) this.pauseButton.setBackgroundColor('#808080'); });

    console.log('MainGameScene created. Shoppy position:', this.shoppy.x, this.shoppy.y);

    // Delay initial jump to ensure everything is settled
    this.time.delayedCall(200, () => {
        if (!this.isPaused && !this.isGameOver && this.shoppy && this.shoppy.body && (this.shoppy.body as Phaser.Physics.Arcade.Body).enable) {
            console.log('Performing initial jump');
            this.jump();
        }
    });
  }

  addPipeRow() {
    if (this.isGameOver) return;

    const gameHeight = Number(this.sys.game.config.height) || 600;
    const gameWidth = Number(this.sys.game.config.width) || 800;

    // Randomly determine the vertical position of the gap
    const gapCenterY = Phaser.Math.Between(PIPE_GAP_SIZE * 0.7, gameHeight - PIPE_GAP_SIZE * 0.7);

    const pipeX = gameWidth + PIPE_WIDTH / 2;

    // Top pipe
    const topPipeY = gapCenterY - PIPE_GAP_SIZE / 2;
    const topPipe: Phaser.Physics.Arcade.Sprite = this.pipes.get(pipeX, topPipeY, PIPE_TEXTURE_KEY);
    topPipe.setActive(true).setVisible(true).setOrigin(0.5, 1).setVelocityX(PIPE_SCROLL_SPEED);
    if (topPipe.body) (topPipe.body as Phaser.Physics.Arcade.Body).updateFromGameObject();
    else this.physics.world.enable(topPipe); // Should be enabled by group, but as fallback

    // Bottom pipe
    const bottomPipeY = gapCenterY + PIPE_GAP_SIZE / 2;
    const bottomPipe: Phaser.Physics.Arcade.Sprite = this.pipes.get(pipeX, bottomPipeY, PIPE_TEXTURE_KEY);
    bottomPipe.setActive(true).setVisible(true).setOrigin(0.5, 0).setVelocityX(PIPE_SCROLL_SPEED);
    if (bottomPipe.body) (bottomPipe.body as Phaser.Physics.Arcade.Body).updateFromGameObject();
    else this.physics.world.enable(bottomPipe); // Should be enabled by group, but as fallback

    // Scoring Zone
    const zoneX = pipeX;
    const zoneY = gapCenterY;
    const zone: Phaser.Physics.Arcade.Sprite = this.scoringZones.get(zoneX, zoneY);
    zone.setActive(true).setVisible(false); // Ensure it is active and invisible
    zone.body!.setSize(SCORE_ZONE_WIDTH, PIPE_GAP_SIZE); // Set size for the physics body
    zone.setVelocityX(PIPE_SCROLL_SPEED);
    if (zone.body) (zone.body as Phaser.Physics.Arcade.Body).updateFromGameObject();
    else this.physics.world.enable(zone); // Should be enabled by group, but as fallback
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleScoreTrigger(shoppyObj: any, zoneObj: any) {
    const zoneSprite = zoneObj as Phaser.Physics.Arcade.Sprite;
    if (!zoneSprite.active || !zoneSprite.body || !zoneSprite.body.enable) return;
    this.score++;
    this.scoreText.setText('Score: ' + this.score);
    zoneSprite.setActive(false);
  }

  handleCollision() {
    console.log('handleCollision called! isPaused:', this.isPaused, 'isGameOver:', this.isGameOver);
    if (this.isGameOver || this.isPaused) return;

    this.isGameOver = true;
    console.log('Setting game over state');
    this.cameras.main.shake(250, 0.01);
    this.physics.pause();
    this.shoppy.setTint(0xff0000);
    this.pipeSpawnTimer.remove(false);

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('shoppyBirdHighScore', this.highScore.toString());
      this.highScoreText.setText('Best: ' + this.highScore);
    }
    console.log('Game Over! Score: ' + this.score + ' | Best: ' + this.highScore);
    this.scene.start('GameOverScene', { score: this.score, highScore: this.highScore });
  }

  togglePause() {
    if (this.isGameOver) return;

    if (!this.isPaused) {
      this.isPaused = true;
      this.isAttemptingPause = true;
      this.pauseButton.setText('Resume');
      this.pauseText.setVisible(true);
      console.log('Attempting Pause (from P key)...');

      if (this.shoppy && this.shoppy.body) {
        (this.shoppy.body as Phaser.Physics.Arcade.Body).enable = false;
      }

      this.physics.pause();
      this.pipeSpawnTimer.paused = true;
      if (this.shoppy && this.shoppy.anims) this.shoppy.anims.pause();
    } else {
      this.isPaused = false;
      this.isAttemptingPause = false;
      this.togglePause();
    }
  }

  applyFullPauseMechanics() {
    if (this.shoppy && this.shoppy.body) {
        (this.shoppy.body as Phaser.Physics.Arcade.Body).enable = false;
    }
    this.physics.pause();
    this.pipeSpawnTimer.paused = true;
    if (this.shoppy && this.shoppy.anims) this.shoppy.anims.pause();
    // pauseText and button text are already set by the initial pause attempt
    console.log('Full Pause Mechanics Applied');
  }

  jump() {
    if (this.isGameOver || this.isPaused || !this.shoppy || !this.shoppy.body || !(this.shoppy.body as Phaser.Physics.Arcade.Body).enable) return;
    (this.shoppy.body as Phaser.Physics.Arcade.Body).setVelocityY(BIRD_JUMP_VELOCITY);
    this.tweens.killTweensOf(this.shoppy);
    this.shoppy.setAngle(BIRD_FLAP_ANGLE);

    // Emit particles on jump
    if (this.jumpParticles) {
      // Position the emitter at Shoppy's approximate bottom-rear
      const emitX = this.shoppy.x - (this.shoppy.displayWidth / 4) * Math.cos(this.shoppy.rotation);
      const emitY = this.shoppy.y - (this.shoppy.displayWidth / 4) * Math.sin(this.shoppy.rotation); // Use displayWidth for a consistent offset point
      this.jumpParticles.setPosition(emitX, emitY + this.shoppy.displayHeight / 3); // Offset slightly below center of rotation point
      this.jumpParticles.explode(5); // Emit a burst of 5 particles from this new position
    }
  }

  update(time: number, delta: number) {
    if (!this.shoppy) return;

    if (this.isAttemptingPause) {
        this.applyFullPauseMechanics();
        this.isAttemptingPause = false; // Consumed the attempt
        // Game will now be fully paused, next update iteration will skip due to this.isPaused
        return;
    }

    // Handle P Key Pause/Resume toggle
    if (Phaser.Input.Keyboard.JustDown(this.pauseKey)) {
      if (!this.isGameOver) {
          this.togglePause(); // togglePause will handle setting isAttemptingPause if pausing
      }
    }

    if (this.isGameOver || this.isPaused) { // If fully paused (not just attempting) or game over
      if (this.isGameOver && this.shoppy.active && this.shoppy.angle < BIRD_DIVE_ANGLE) {
        this.shoppy.angle += (GRAVITY_STRENGTH / GRAVITY_STRENGTH) * (BIRD_ANGULAR_VELOCITY / 60) * (delta / (1000/60));
        if (this.shoppy.angle > BIRD_DIVE_ANGLE) {
          this.shoppy.setAngle(BIRD_DIVE_ANGLE);
        }
      }
      return;
    }

    if (Phaser.Input.Keyboard.JustDown(this.jumpKey)) {
      this.jump();
    }

    if (this.shoppy.body && this.shoppy.angle < BIRD_DIVE_ANGLE && (this.shoppy.body as Phaser.Physics.Arcade.Body).velocity.y > BIRD_JUMP_VELOCITY * 0.5) {
      this.shoppy.angle += ((this.shoppy.body as Phaser.Physics.Arcade.Body).velocity.y / GRAVITY_STRENGTH) * (BIRD_ANGULAR_VELOCITY / 60) * (delta / (1000/60));
    }
    if (this.shoppy.angle > BIRD_DIVE_ANGLE) {
      this.shoppy.setAngle(BIRD_DIVE_ANGLE);
    }

    // Prevent Shoppy from going off the top of the screen and stop its upward movement
    if (this.shoppy.y - this.shoppy.displayHeight / 2 < 0) {
      this.shoppy.y = this.shoppy.displayHeight / 2;
      if(this.shoppy.body) {
        (this.shoppy.body as Phaser.Physics.Arcade.Body).setVelocityY(0);
        this.shoppy.setAngle(0); // Reset angle if hitting ceiling
      }
    }

    // Recycle pipes and scoring zones
    const recycleThreshold = -PIPE_WIDTH - SCORE_ZONE_WIDTH; // Ensure zones are also off-screen

    this.pipes.getChildren().forEach((pipe) => {
      const pipeSprite = pipe as Phaser.Physics.Arcade.Sprite;
      if (pipeSprite.x < recycleThreshold) {
        this.pipes.killAndHide(pipeSprite);
        if(pipeSprite.body) (pipeSprite.body as Phaser.Physics.Arcade.Body).reset(0,0);
      }
    });
    this.scoringZones.getChildren().forEach((zone) => {
      const zoneSprite = zone as Phaser.Physics.Arcade.Sprite;
      if (zoneSprite.x < recycleThreshold) {
        this.scoringZones.killAndHide(zoneSprite);
         if(zoneSprite.body) (zoneSprite.body as Phaser.Physics.Arcade.Body).reset(0,0);
      }
    });
  }
}