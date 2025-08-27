

import { Scene } from 'phaser';
import { StorageManager } from '../utils/StorageManager';
import { I18nManager } from '../utils/I18nManager';

export class BootScene extends Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Load progress from IndexedDB
    this.loadProgress();
    
    // Initialize i18n
    I18nManager.initialize();
    
    // Load minimal assets for boot screen
    this.load.image('logo', '/assets/images/logo.png');
    this.load.image('loading-bar', '/assets/images/loading-bar.png');
  }

  create() {
    // Show loading screen
    this.createLoadingScreen();
    
    // Start loading main assets
    this.loadMainAssets();
  }

  private async loadProgress() {
    try {
      const progress = await StorageManager.getProgress();
      this.registry.set('progress', progress);
    } catch (error) {
      console.warn('Failed to load progress:', error);
      this.registry.set('progress', {});
    }
  }

  private createLoadingScreen() {
    const { width, height } = this.scale;
    
    // Background
    this.add.rectangle(width / 2, height / 2, width, height, 0x4f46e5);
    
    // Logo
    const logo = this.add.image(width / 2, height / 3, 'logo');
    logo.setScale(0.5);
    
    // Loading text
    const loadingText = this.add.text(width / 2, height / 2 + 50, 'Loading...', {
      fontSize: '24px',
      fontFamily: 'Comic Sans MS',
      color: '#ffffff'
    });
    loadingText.setOrigin(0.5);
    
    // Progress bar background
    const barBg = this.add.rectangle(width / 2, height / 2 + 100, 300, 20, 0x666666);
    const bar = this.add.rectangle(width / 2 - 150, height / 2 + 100, 0, 20, 0xffffff);
    bar.setOrigin(0, 0.5);
    
    // Update progress bar during load
    this.load.on('progress', (value: number) => {
      bar.width = 300 * value;
    });
    
    this.load.on('complete', () => {
      this.scene.start('OverworldScene');
    });
  }

  private loadMainAssets() {
    // Load character assets
    this.load.spritesheet('player', '/assets/sprites/player.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    
    // Load critter assets
    this.load.spritesheet('critters', '/assets/sprites/critters.png', {
      frameWidth: 64,
      frameHeight: 64
    });
    
    // Load UI assets
    this.load.image('ui-button', '/assets/ui/button.png');
    this.load.image('ui-panel', '/assets/ui/panel.png');
    
    // Load sound assets
    this.load.audio('correct-sound', '/assets/sounds/correct.mp3');
    this.load.audio('incorrect-sound', '/assets/sounds/incorrect.mp3');
    this.load.audio('background-music', '/assets/sounds/background.mp3');
    
    // Start loading
    this.load.start();
  }
}

