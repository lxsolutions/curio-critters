


import { Scene } from 'phaser';
import { StorageManager } from '../utils/StorageManager';
import { I18nManager } from '../utils/I18nManager';

export class OverworldScene extends Scene {
  private progress!: any;
  private map!: Phaser.Tilemaps.Tilemap;
  private player!: Phaser.Physics.Arcade.Sprite;
  private encounterZones: Phaser.Physics.Arcade.StaticGroup[] = [];

  constructor() {
    super({ key: 'OverworldScene' });
  }

  async create() {
    // Load progress data
    this.progress = this.registry.get('progress') || await StorageManager.getProgress();
    
    // Create overworld map
    this.createMap();
    
    // Create player character
    this.createPlayer();
    
    // Create encounter zones
    this.createEncounterZones();
    
    // Create UI
    this.createUI();
    
    // Setup camera
    this.setupCamera();
  }

  private createMap() {
    // Create a simple grid-based map
    this.map = this.make.tilemap({ 
      key: 'overworld', 
      tileWidth: 64, 
      tileHeight: 64 
    });
    
    // Create tileset (using placeholder colors)
    const tileset = this.map.addTilesetImage('tiles', null, 64, 64, 0, 0);
    
    // Create layers
    const groundLayer = this.map.createBlankLayer('Ground', tileset!);
    const obstacleLayer = this.map.createBlankLayer('Obstacles', tileset!);
    
    // Fill the map with ground tiles (assuming tile 0 is grass)
    groundLayer?.fill(0, 0, 0, 20, 15);
    
    // Add some obstacles (assuming tile 1 is a tree)
    obstacleLayer?.putTileAt(1, 5, 5);
    obstacleLayer?.putTileAt(1, 10, 8);
    obstacleLayer?.putTileAt(1, 15, 3);
    
    // Set collision for obstacles
    obstacleLayer?.setCollision(1);
  }

  private createPlayer() {
    this.player = this.physics.add.sprite(320, 240, 'player');
    this.player.setScale(1.5);
    this.player.setCollideWorldBounds(true);
    
    // Create player animations
    this.anims.create({
      key: 'walk-down',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: 'walk-up',
      frames: this.anims.generateFrameNumbers('player', { start: 4, end: 7 }),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: 'walk-left',
      frames: this.anims.generateFrameNumbers('player', { start: 8, end: 11 }),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: 'walk-right',
      frames: this.anims.generateFrameNumbers('player', { start: 12, end: 15 }),
      frameRate: 10,
      repeat: -1
    });
    
    this.anims.create({
      key: 'idle',
      frames: [{ key: 'player', frame: 0 }],
      frameRate: 10
    });
  }

  private createEncounterZones() {
    // Create different difficulty zones
    const difficulties = ['easy', 'medium', 'hard'];
    const positions = [
      { x: 200, y: 200 },
      { x: 600, y: 300 },
      { x: 400, y: 500 }
    ];
    
    difficulties.forEach((difficulty, index) => {
      const zone = this.physics.add.staticGroup();
      const zoneSprite = zone.create(positions[index].x, positions[index].y, 'ui-panel');
      zoneSprite.setData('difficulty', difficulty);
      zoneSprite.setInteractive();
      
      // Add text label
      const label = this.add.text(positions[index].x, positions[index].y - 40, 
        I18nManager.t(`overworld.${difficulty}`), {
        fontSize: '20px',
        fontFamily: 'Comic Sans MS',
        color: '#ffffff'
      });
      label.setOrigin(0.5);
      
      // Add click handler
      zoneSprite.on('pointerdown', () => {
        this.startMathEncounter(difficulty);
      });
      
      this.encounterZones.push(zone);
    });
  }

  private createUI() {
    // Coins display
    const coinsText = this.add.text(20, 20, 
      I18nManager.t('rewards.coins', { count: this.progress.coins }), {
      fontSize: '24px',
      fontFamily: 'Comic Sans MS',
      color: '#ffd700'
    });
    
    // Streak display
    const streakText = this.add.text(20, 60, 
      `Streak: ${this.progress.currentStreak}`, {
      fontSize: '20px',
      fontFamily: 'Comic Sans MS',
      color: '#ffffff'
    });
  }

  private setupCamera() {
    this.cameras.main.startFollow(this.player);
    this.cameras.main.setBounds(0, 0, 1280, 960);
  }

  update() {
    // Handle player movement
    const cursors = this.input.keyboard?.createCursorKeys();
    const speed = 200;
    
    if (cursors?.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.anims.play('walk-left', true);
    } else if (cursors?.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.anims.play('walk-right', true);
    } else {
      this.player.setVelocityX(0);
    }
    
    if (cursors?.up.isDown) {
      this.player.setVelocityY(-speed);
      this.player.anims.play('walk-up', true);
    } else if (cursors?.down.isDown) {
      this.player.setVelocityY(speed);
      this.player.anims.play('walk-down', true);
    } else {
      this.player.setVelocityY(0);
    }
    
    // Stop animation when not moving
    if (this.player.body?.velocity.x === 0 && this.player.body.velocity.y === 0) {
      this.player.anims.play('idle', true);
    }
  }

  private startMathEncounter(difficulty: string) {
    this.scene.pause();
    this.scene.launch('MathEncounterScene', { difficulty, progress: this.progress });
  }
}


