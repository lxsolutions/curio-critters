
import { Scene } from 'phaser';
import { StorageManager } from '../utils/StorageManager';
import { I18nManager } from '../utils/I18nManager';
import { GameSessionManager, type GameSessionConfig } from '../utils/GameSessionManager.js';
import { loadCurriculum } from '@curio-critters/curriculum';

interface MathProblem {
  question: string;
  answer: number;
  options: number[];
  factId: string;
  operation: 'addition' | 'subtraction';
}

export class MathEncounterScene extends Scene {
  private difficulty!: string;
  private progress!: any;
  private currentProblem!: MathProblem;
  private score: number = 0;
  private timeLeft: number = 30;
  private timer!: Phaser.Time.TimerEvent;
  private scoreText!: Phaser.GameObjects.Text;
  private timerText!: Phaser.GameObjects.Text;
  private questionText!: Phaser.GameObjects.Text;
  private optionButtons: Phaser.GameObjects.Sprite[] = [];
  private sessionManager!: GameSessionManager;
  private currentSession: any[] = [];
  private currentProblemIndex: number = 0;
  private responseStartTime: number = 0;

  constructor() {
    super({ key: 'MathEncounterScene' });
  }

  init(data: { difficulty: string; progress: any }) {
    this.difficulty = data.difficulty;
    this.progress = data.progress;
  }

  async create() {
    // Background
    this.add.rectangle(512, 384, 1024, 768, 0x4f46e5);
    
    // Initialize session manager
    this.sessionManager = new GameSessionManager();
    
    // Load curriculum and initialize adaptive session
    await this.initializeAdaptiveSession();
    
    // Create UI
    this.createUI();
    
    // Generate first problem from adaptive session
    this.generateProblem();
    
    // Start timer
    this.startTimer();
  }

  private async initializeAdaptiveSession() {
    try {
      // Load curriculum
      const curriculum = await loadCurriculum();
      
      // Configure session based on difficulty
      const config: GameSessionConfig = {
        timeboxMinutes: 3,
        maxItems: 10,
        minDifficulty: 1,
        maxDifficulty: this.getDifficultyLevel()
      };
      
      // Initialize adaptive session
      this.currentSession = await this.sessionManager.initializeSession(curriculum, config);
      
      if (this.currentSession.length === 0) {
        console.warn('No math items found for session. Using fallback generation.');
        // Fallback to manual generation if no adaptive items
      }
    } catch (error) {
      console.error('Failed to initialize adaptive session:', error);
      // Fallback to manual generation
    }
  }

  private getDifficultyLevel(): number {
    switch (this.difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      default: return 1;
    }
  }

  private createUI() {
    // Score display
    this.scoreText = this.add.text(50, 50, 
      I18nManager.t('math.score', { score: this.score }), {
      fontSize: '32px',
      fontFamily: 'Comic Sans MS',
      color: '#ffffff'
    });

    // Timer display
    this.timerText = this.add.text(900, 50, 
      `Time: ${this.timeLeft}s`, {
      fontSize: '32px',
      fontFamily: 'Comic Sans MS',
      color: '#ffffff'
    });

    // Question display
    this.questionText = this.add.text(512, 200, '', {
      fontSize: '48px',
      fontFamily: 'Comic Sans MS',
      color: '#ffffff'
    });
    this.questionText.setOrigin(0.5);
  }

  private generateProblem() {
    // Generate math problem based on difficulty
    this.currentProblem = this.generateMathProblem();
    this.questionText.setText(this.currentProblem.question);
    
    // Create option buttons
    this.createOptionButtons();
    
    // Record start time for response time measurement
    this.responseStartTime = Date.now();
  }

  private generateMathProblem(): MathProblem {
    // Use adaptive session if available, otherwise fallback to manual generation
    if (this.currentSession && this.currentSession.length > 0 && this.currentProblemIndex < this.currentSession.length) {
      return this.generateFromAdaptiveSession();
    } else {
      return this.generateManualProblem();
    }
  }

  private generateFromAdaptiveSession(): MathProblem {
    const mathItem = this.currentSession[this.currentProblemIndex];
    this.currentProblemIndex++;
    
    let question: string;
    let answer: number;
    
    switch (mathItem.type) {
      case 'addition':
        question = `${mathItem.a} + ${mathItem.b} = ?`;
        answer = mathItem.a + mathItem.b;
        break;
      case 'subtraction':
        question = `${mathItem.a} - ${mathItem.b} = ?`;
        answer = mathItem.a - mathItem.b;
        break;
      default:
        // Fallback to addition
        question = `${mathItem.a} + ${mathItem.b} = ?`;
        answer = mathItem.a + mathItem.b;
    }
    
    const factId = mathItem.id;
    const options = this.generateOptions(answer);
    
    return { question, answer, options, factId, operation: mathItem.type as 'addition' | 'subtraction' };
  }

  private generateManualProblem(): MathProblem {
    let a: number, b: number, answer: number;
    let operation: 'addition' | 'subtraction' = Math.random() > 0.5 ? 'addition' : 'subtraction';
    
    switch (this.difficulty) {
      case 'easy':
        a = Phaser.Math.Between(1, 10);
        b = Phaser.Math.Between(1, 10);
        break;
      case 'medium':
        a = Phaser.Math.Between(5, 15);
        b = Phaser.Math.Between(5, 15);
        break;
      case 'hard':
        a = Phaser.Math.Between(10, 20);
        b = Phaser.Math.Between(10, 20);
        break;
      default:
        a = Phaser.Math.Between(1, 10);
        b = Phaser.Math.Between(1, 10);
    }

    if (operation === 'subtraction' && a < b) {
      [a, b] = [b, a]; // Ensure positive result
    }

    answer = operation === 'addition' ? a + b : a - b;
    
    const question = operation === 'addition' 
      ? `${a} + ${b} = ?` 
      : `${a} - ${b} = ?`;
    
    const factId = `${operation}-${a}-${b}`;
    
    // Generate options (correct answer + 3 distractors)
    const options = this.generateOptions(answer);
    
    return { question, answer, options, factId, operation };
  }

  private generateOptions(correctAnswer: number): number[] {
    const options = [correctAnswer];
    
    // Add distractors
    while (options.length < 4) {
      const distractor = correctAnswer + Phaser.Math.Between(-5, 5);
      if (distractor !== correctAnswer && !options.includes(distractor) && distractor >= 0) {
        options.push(distractor);
      }
    }
    
    // Shuffle options
    return Phaser.Utils.Array.Shuffle(options);
  }

  private createOptionButtons() {
    // Clear previous buttons
    this.optionButtons.forEach(button => button.destroy());
    this.optionButtons = [];
    
    const positions = [
      { x: 300, y: 400 },
      { x: 700, y: 400 },
      { x: 300, y: 550 },
      { x: 700, y: 550 }
    ];
    
    this.currentProblem.options.forEach((option, index) => {
      const button = this.add.sprite(positions[index].x, positions[index].y, 'ui-button');
      button.setInteractive();
      button.setScale(1.5);
      
      const optionText = this.add.text(positions[index].x, positions[index].y, option.toString(), {
        fontSize: '36px',
        fontFamily: 'Comic Sans MS',
        color: '#000000'
      });
      optionText.setOrigin(0.5);
      
      button.on('pointerdown', () => {
        this.checkAnswer(option);
      });
      
      this.optionButtons.push(button);
    });
  }

  private async checkAnswer(selectedAnswer: number) {
    // Calculate response time
    const responseTimeMs = Date.now() - this.responseStartTime;
    
    if (selectedAnswer === this.currentProblem.answer) {
      // Correct answer - use adaptive rating
      await this.handleAdaptiveAnswer(true, responseTimeMs);
    } else {
      // Incorrect answer
      await this.handleAdaptiveAnswer(false, responseTimeMs);
    }
    
    // Generate new problem after a short delay
    this.time.delayedCall(1000, () => {
      this.generateProblem();
    });
  }

  private async handleAdaptiveAnswer(isCorrect: boolean, responseTimeMs: number) {
    // Calculate rating based on correctness and response time
    let rating = isCorrect ? 3 : 0; // Base rating
    
    // Adjust rating based on response time (faster = better rating)
    if (isCorrect && responseTimeMs < 3000) {
      rating = 4; // Very good
    } else if (isCorrect && responseTimeMs < 5000) {
      rating = 3; // Good
    } else if (isCorrect) {
      rating = 2; // Barely correct
    }
    
    // Update adaptive algorithm
    try {
      await this.sessionManager.processAnswer(
        this.currentProblem.factId,
        rating,
        responseTimeMs
      );
    } catch (error) {
      console.error('Failed to update adaptive algorithm:', error);
    }
    
    // Update game progress
    if (isCorrect) {
      this.handleCorrectAnswer();
    } else {
      this.handleIncorrectAnswer();
    }
  }

  private async handleCorrectAnswer() {
    this.score += 10;
    this.scoreText.setText(I18nManager.t('math.score', { score: this.score }));
    
    // Play sound if enabled
    if (this.progress.settings.soundEnabled) {
      this.sound.play('correct-sound');
    }
    
    // Update progress
    this.progress.masteredFacts.add(this.currentProblem.factId);
    this.progress.currentStreak++;
    this.progress.coins += 5;
    
    // Check for new longest streak
    if (this.progress.currentStreak > this.progress.longestStreak) {
      this.progress.longestStreak = this.progress.currentStreak;
    }
    
    // Save progress
    await StorageManager.saveProgress(this.progress);
    
    // Show feedback
    this.showFeedback(I18nManager.t('math.correct'), 0x00ff00);
  }

  private async handleIncorrectAnswer() {
    // Reset streak
    this.progress.currentStreak = 0;
    await StorageManager.saveProgress(this.progress);
    
    // Play sound if enabled
    if (this.progress.settings.soundEnabled) {
      this.sound.play('incorrect-sound');
    }
    
    // Show feedback
    this.showFeedback(I18nManager.t('math.incorrect'), 0xff0000);
  }

  private showFeedback(text: string, color: number) {
    const feedback = this.add.text(512, 300, text, {
      fontSize: '36px',
      fontFamily: 'Comic Sans MS',
      color: '#ffffff'
    });
    feedback.setOrigin(0.5);
    feedback.setBackgroundColor(color);
    
    // Remove feedback after delay
    this.time.delayedCall(1000, () => {
      feedback.destroy();
    });
  }

  private startTimer() {
    this.timer = this.time.addEvent({
      delay: 1000,
      callback: this.updateTimer,
      callbackScope: this,
      loop: true
    });
  }

  private updateTimer() {
    this.timeLeft--;
    this.timerText.setText(`Time: ${this.timeLeft}s`);
    
    if (this.timeLeft <= 0) {
      this.endEncounter();
    }
  }

  private endEncounter() {
    this.timer.remove();
    
    // Show results
    const results = this.add.text(512, 384, 
      `Game Over!\nFinal Score: ${this.score}`, {
      fontSize: '48px',
      fontFamily: 'Comic Sans MS',
      color: '#ffffff',
      align: 'center'
    });
    results.setOrigin(0.5);
    
    // Add continue button
    const continueButton = this.add.sprite(512, 500, 'ui-button');
    continueButton.setInteractive();
    continueButton.setScale(1.5);
    
    const continueText = this.add.text(512, 500, 'Continue', {
      fontSize: '24px',
      fontFamily: 'Comic Sans MS',
      color: '#000000'
    });
    continueText.setOrigin(0.5);
    
    continueButton.on('pointerdown', () => {
      this.scene.stop();
      this.scene.resume('OverworldScene');
    });
  }
}
