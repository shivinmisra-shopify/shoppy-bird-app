import * as Phaser from 'phaser';
import { PARTICLE_TEXTURE_KEY } from './PreloaderScene'; // Import the key

const BIRD_JUMP_VELOCITY = -320;
const GRAVITY_STRENGTH = 700;
const BIRD_FLAP_ANGLE = -20; // Angle in degrees when flapping
const BIRD_DIVE_ANGLE = 90; // Max angle when diving
const BIRD_ANGULAR_VELOCITY = 200; // Speed of rotation

// Pipe constants
const PIPE_TOP_TEXTURE_KEY = 'pipeTopTexture';
const PIPE_BOTTOM_TEXTURE_KEY = 'pipeBottomTexture';
const PIPE_WIDTH = 80; // Width of the pipe body
const PIPE_HEAD_HEIGHT = 45; // Height of the wider pipe head
const PIPE_HEAD_WIDTH_MULTIPLIER = 1.5; // How much wider the head is than the body
const PIPE_BODY_COLOR = 0x008000; // Green
const PIPE_HIGHLIGHT_COLOR = 0x32cd32; // Lime green
const PIPE_SHADOW_COLOR = 0x006400; // Dark green
const PIPE_DARK_SHADOW_COLOR = 0x004400; // Even darker green for depth
const PIPE_GAP_SIZE = 250; // Vertical gap between pipes (increased from 200)
const PIPE_SPAWN_INTERVAL = 2200; // Milliseconds between pipe spawns (increased from 1500)
const PIPE_SCROLL_SPEED = -120; // Pixels per second (reduced from -150)
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

  // Cloud system
  private clouds!: Phaser.GameObjects.Group;
  private cloudSpawnTimer!: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: 'MainGameScene' });
  }

  preload() {
    // Assets are already loaded by PreloaderScene
    // Generate the pipe texture
    this.createPipeTexture();
    // Generate cloud textures
    this.createCloudTextures();
    // Particle texture is loaded in PreloaderScene
  }

  createPipeTexture() {
    // Generate the pipe texture
    this.createTopPipeTexture();
    this.createBottomPipeTexture();
  }

  createTopPipeTexture() {
    // Top pipe has opening at the BOTTOM (pointing down into the gap)
    const gfx = this.make.graphics({ x: 0, y: 0 }, false);
    const textureHeight = Number(this.sys.game.config.height) || 600;
    const headWidth = PIPE_WIDTH * PIPE_HEAD_WIDTH_MULTIPLIER;
    const headOverhang = (headWidth - PIPE_WIDTH) / 2;

    gfx.clear();

    // === PIPE BODY (centered) ===
    const bodyX = headOverhang; // Center the body under the head
    gfx.fillStyle(PIPE_BODY_COLOR);
    gfx.fillRect(bodyX, 0, PIPE_WIDTH, textureHeight - PIPE_HEAD_HEIGHT);

    // Body left highlight
    gfx.fillStyle(PIPE_HIGHLIGHT_COLOR);
    gfx.fillRect(bodyX, 0, 6, textureHeight - PIPE_HEAD_HEIGHT);

    // Body right shadow
    gfx.fillStyle(PIPE_SHADOW_COLOR);
    gfx.fillRect(bodyX + PIPE_WIDTH - 6, 0, 6, textureHeight - PIPE_HEAD_HEIGHT);

    // === PIPE HEAD (opening at bottom) ===
    const headY = textureHeight - PIPE_HEAD_HEIGHT;

    // Head main fill (full width, starts at x=0)
    gfx.fillStyle(PIPE_BODY_COLOR);
    gfx.fillRect(0, headY, headWidth, PIPE_HEAD_HEIGHT);

    // Head left highlight (full height)
    gfx.fillStyle(PIPE_HIGHLIGHT_COLOR);
    gfx.fillRect(0, headY, 6, PIPE_HEAD_HEIGHT);

    // Head right shadow (full height)
    gfx.fillStyle(PIPE_SHADOW_COLOR);
    gfx.fillRect(headWidth - 6, headY, 6, PIPE_HEAD_HEIGHT);

    // Top edge of head (darker, creates the "lip")
    gfx.fillStyle(PIPE_SHADOW_COLOR);
    gfx.fillRect(0, headY, headWidth, 6);

    // Bottom edge of head (bright opening edge)
    gfx.fillStyle(PIPE_HIGHLIGHT_COLOR);
    gfx.fillRect(0, textureHeight - 4, headWidth, 4);

    // === INNER RIM (perfectly centered) ===
    const rimInset = 6;
    gfx.fillStyle(PIPE_DARK_SHADOW_COLOR);

    // Inner rectangle (creates the depth illusion)
    gfx.fillRect(
      rimInset,
      headY + rimInset,
      headWidth - (rimInset * 2),
      PIPE_HEAD_HEIGHT - (rimInset * 2)
    );

    gfx.generateTexture(PIPE_TOP_TEXTURE_KEY, Math.ceil(headWidth), textureHeight);
    gfx.destroy();
  }

  createBottomPipeTexture() {
    // Bottom pipe has opening at the TOP (pointing up into the gap)
    const gfx = this.make.graphics({ x: 0, y: 0 }, false);
    const textureHeight = Number(this.sys.game.config.height) || 600;
    const headWidth = PIPE_WIDTH * PIPE_HEAD_WIDTH_MULTIPLIER;
    const headOverhang = (headWidth - PIPE_WIDTH) / 2;

    gfx.clear();

    // === PIPE HEAD (opening at top) ===
    // Head main fill (full width, starts at x=0)
    gfx.fillStyle(PIPE_BODY_COLOR);
    gfx.fillRect(0, 0, headWidth, PIPE_HEAD_HEIGHT);

    // Head left highlight (full height)
    gfx.fillStyle(PIPE_HIGHLIGHT_COLOR);
    gfx.fillRect(0, 0, 6, PIPE_HEAD_HEIGHT);

    // Head right shadow (full height)
    gfx.fillStyle(PIPE_SHADOW_COLOR);
    gfx.fillRect(headWidth - 6, 0, 6, PIPE_HEAD_HEIGHT);

    // Top edge of head (bright opening edge)
    gfx.fillStyle(PIPE_HIGHLIGHT_COLOR);
    gfx.fillRect(0, 0, headWidth, 4);

    // Bottom edge of head (darker, creates the "lip")
    gfx.fillStyle(PIPE_SHADOW_COLOR);
    gfx.fillRect(0, PIPE_HEAD_HEIGHT - 6, headWidth, 6);

    // === PIPE BODY (centered) ===
    const bodyX = headOverhang; // Center the body under the head
    gfx.fillStyle(PIPE_BODY_COLOR);
    gfx.fillRect(bodyX, PIPE_HEAD_HEIGHT, PIPE_WIDTH, textureHeight - PIPE_HEAD_HEIGHT);

    // Body left highlight
    gfx.fillStyle(PIPE_HIGHLIGHT_COLOR);
    gfx.fillRect(bodyX, PIPE_HEAD_HEIGHT, 6, textureHeight - PIPE_HEAD_HEIGHT);

    // Body right shadow
    gfx.fillStyle(PIPE_SHADOW_COLOR);
    gfx.fillRect(bodyX + PIPE_WIDTH - 6, PIPE_HEAD_HEIGHT, 6, textureHeight - PIPE_HEAD_HEIGHT);

    // === INNER RIM (perfectly centered) ===
    const rimInset = 6;
    gfx.fillStyle(PIPE_DARK_SHADOW_COLOR);

    // Inner rectangle (creates the depth illusion)
    gfx.fillRect(
      rimInset,
      rimInset,
      headWidth - (rimInset * 2),
      PIPE_HEAD_HEIGHT - (rimInset * 2)
    );

    gfx.generateTexture(PIPE_BOTTOM_TEXTURE_KEY, Math.ceil(headWidth), textureHeight);
    gfx.destroy();
  }

  createCloudTextures() {
    // Create multiple cloud variations
    for (let i = 1; i <= 3; i++) {
      const gfx = this.make.graphics({ x: 0, y: 0 }, false);
      const cloudWidth = 60 + (i * 20);
      const cloudHeight = 30 + (i * 10);

      // Create fluffy cloud shape with multiple circles
      gfx.fillStyle(0xffffff, 0.8); // White with some transparency

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

      gfx.generateTexture(`cloud${i}`, cloudWidth, cloudHeight);
      gfx.destroy();
    }
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

    // Initialize cloud system
    this.clouds = this.add.group();
    this.spawnInitialClouds();

    // Start cloud spawning timer
    this.cloudSpawnTimer = this.time.addEvent({
      delay: 8000, // Spawn a new cloud every 8 seconds
      callback: this.addCloud,
      callbackScope: this,
      loop: true,
    });

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
      fontSize: `${Math.min(gameWidth * 0.05, 32)}px`, color: '#ffffff', fontStyle: 'bold', stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5).setDepth(5);

    this.highScore = parseInt(localStorage.getItem('shoppyBirdHighScore') || '0');
    this.highScoreText = this.add.text(gameWidth - 20, 20, 'Best: ' + this.highScore, {
      fontSize: `${Math.min(gameWidth * 0.03, 24)}px`, color: '#ffffff', fontStyle: 'bold', stroke: '#000000', strokeThickness: 4
    }).setOrigin(1, 0).setDepth(5);

    this.pauseText = this.add.text(gameWidth / 2, gameHeight / 2, 'Paused', {
      fontSize: `${Math.min(gameWidth * 0.08, 48)}px`, color: '#ffff00', fontStyle: 'bold', stroke: '#000000', strokeThickness: 6
    }).setOrigin(0.5).setDepth(10).setVisible(false);

    // Make pause button larger and more touch-friendly on mobile
    const pauseButtonSize = Math.min(gameWidth * 0.025, 20);
    const pauseButtonPadding = Math.max(gameWidth * 0.015, 10);

    this.pauseButton = this.add.text(20, 20, 'Pause', {
        fontSize: `${pauseButtonSize}px`, color: '#ffffff', backgroundColor: '#808080',
        padding: { x: pauseButtonPadding, y: pauseButtonPadding * 0.6 }, fontStyle: 'bold'
    }).setOrigin(0,0).setDepth(5).setInteractive({ useHandCursor: true });

    // Make pause button larger on mobile for easier touching
    if (gameWidth < 600) {
      this.pauseButton.setScale(1.3);
    }

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

  spawnInitialClouds() {
    const gameWidth = Number(this.sys.game.config.width) || 800;
    const gameHeight = Number(this.sys.game.config.height) || 600;

    // Spawn 3-4 initial clouds across the screen
    for (let i = 0; i < 4; i++) {
      const x = (gameWidth / 4) * i + Phaser.Math.Between(0, gameWidth / 4);
      const y = Phaser.Math.Between(50, gameHeight / 3);
      this.createCloudSprite(x, y);
    }
  }

  addCloud() {
    if (this.isGameOver) return;

    const gameWidth = Number(this.sys.game.config.width) || 800;
    const gameHeight = Number(this.sys.game.config.height) || 600;

    // Spawn cloud from the right side
    const x = gameWidth + 100;
    const y = Phaser.Math.Between(50, gameHeight / 3);
    this.createCloudSprite(x, y);
  }

  createCloudSprite(x: number, y: number) {
    // Randomly choose cloud type
    const cloudType = Phaser.Math.Between(1, 3);
    const cloud = this.add.image(x, y, `cloud${cloudType}`);

    // Random scale for variety
    const scale = Phaser.Math.FloatBetween(0.6, 1.2);
    cloud.setScale(scale);

    // Set depth to be behind everything except background
    cloud.setDepth(-1);

    // Add to clouds group
    this.clouds.add(cloud);

    // Set cloud movement speed (slower than pipes for parallax effect)
    const cloudSpeed = Phaser.Math.Between(-30, -50); // Slower than pipes

    // Add movement using tween for smooth animation
    this.tweens.add({
      targets: cloud,
      x: -200, // Move off screen to the left
      duration: Math.abs((x + 200) / cloudSpeed) * 1000, // Calculate duration based on distance and speed
      ease: 'Linear',
      onComplete: () => {
        cloud.destroy(); // Remove cloud when it goes off screen
      }
    });
  }

  addPipeRow() {
    if (this.isGameOver) return;

    const gameHeight = Number(this.sys.game.config.height) || 600;
    const gameWidth = Number(this.sys.game.config.width) || 800;
    const headWidth = PIPE_WIDTH * PIPE_HEAD_WIDTH_MULTIPLIER;

    // Randomly determine the vertical position of the gap
    const gapCenterY = Phaser.Math.Between(PIPE_GAP_SIZE * 0.7, gameHeight - PIPE_GAP_SIZE * 0.7);

    const pipeX = gameWidth + headWidth / 2; // Adjust spawn position for wider head

    // Top pipe
    const topPipeY = gapCenterY - PIPE_GAP_SIZE / 2;
    const topPipe: Phaser.Physics.Arcade.Sprite = this.pipes.get(pipeX, topPipeY, PIPE_TOP_TEXTURE_KEY);
    topPipe.setActive(true).setVisible(true).setOrigin(0.5, 1).setVelocityX(PIPE_SCROLL_SPEED);
    if (topPipe.body) (topPipe.body as Phaser.Physics.Arcade.Body).updateFromGameObject();
    else this.physics.world.enable(topPipe); // Should be enabled by group, but as fallback

    // Bottom pipe
    const bottomPipeY = gapCenterY + PIPE_GAP_SIZE / 2;
    const bottomPipe: Phaser.Physics.Arcade.Sprite = this.pipes.get(pipeX, bottomPipeY, PIPE_BOTTOM_TEXTURE_KEY);
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
    this.cloudSpawnTimer.remove(false);

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
      this.cloudSpawnTimer.paused = true;
      if (this.shoppy && this.shoppy.anims) this.shoppy.anims.pause();
    } else {
      this.isPaused = false;
      this.isAttemptingPause = false;
      this.pauseButton.setText('Pause');
      this.pauseText.setVisible(false);
      console.log('Resuming game...');

      if (this.shoppy && this.shoppy.body) {
        (this.shoppy.body as Phaser.Physics.Arcade.Body).enable = true;
      }

      this.physics.resume();
      this.pipeSpawnTimer.paused = false;
      this.cloudSpawnTimer.paused = false;
      if (this.shoppy && this.shoppy.anims) this.shoppy.anims.resume();
    }
  }

  applyFullPauseMechanics() {
    if (this.shoppy && this.shoppy.body) {
        (this.shoppy.body as Phaser.Physics.Arcade.Body).enable = false;
    }
    this.physics.pause();
    this.pipeSpawnTimer.paused = true;
    this.cloudSpawnTimer.paused = true;
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
    const headWidth = PIPE_WIDTH * PIPE_HEAD_WIDTH_MULTIPLIER;
    const recycleThreshold = -(headWidth + SCORE_ZONE_WIDTH); // Ensure zones are also off-screen

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