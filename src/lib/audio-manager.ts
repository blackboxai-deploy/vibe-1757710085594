"use client";

export class AudioManager {
  private audioContext: AudioContext | null = null;
  private isInitialized = false;
  private isMuted = false;
  
  // Frecvențele pentru efectele sonore (Hz)
  private readonly frequencies = {
    move: 220,
    rotate: 330,
    drop: 110,
    lineClear: 440,
    tetris: 660,
    gameOver: 165,
    levelUp: 880
  };

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAudio();
    }
  }

  private async initializeAudio(): Promise<void> {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.isInitialized = true;
    } catch (error) {
      console.warn('Web Audio API nu este suportat:', error);
    }
  }

  public async resumeAudio(): Promise<void> {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Nu s-a putut resume audio context:', error);
      }
    }
  }

  private createBeep(frequency: number, duration: number, volume = 0.1): void {
    if (!this.audioContext || !this.isInitialized || this.isMuted) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      oscillator.frequency.value = frequency;
      oscillator.type = 'square';
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, this.audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
      
      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + duration);
    } catch (error) {
      console.warn('Eroare la crearea sunetului:', error);
    }
  }

  // Efecte sonore pentru diverse acțiuni
  public playMove(): void {
    this.createBeep(this.frequencies.move, 0.1, 0.05);
  }

  public playRotate(): void {
    this.createBeep(this.frequencies.rotate, 0.15, 0.08);
  }

  public playDrop(): void {
    this.createBeep(this.frequencies.drop, 0.2, 0.1);
  }

  public playLineClear(): void {
    // Acorduri pentru line clear - sunet mai complex
    setTimeout(() => this.createBeep(this.frequencies.lineClear, 0.3, 0.15), 0);
    setTimeout(() => this.createBeep(this.frequencies.lineClear * 1.25, 0.3, 0.1), 100);
    setTimeout(() => this.createBeep(this.frequencies.lineClear * 1.5, 0.3, 0.08), 200);
  }

  public playTetris(): void {
    // Sunet special pentru Tetris (4 linii)
    const notes = [660, 831, 1047, 1319]; // E5, Ab5, C6, E6
    notes.forEach((note, index) => {
      setTimeout(() => this.createBeep(note, 0.4, 0.12), index * 100);
    });
  }

  public playGameOver(): void {
    // Secvență descendentă pentru game over
    const notes = [330, 294, 262, 220, 196, 165]; // E4 -> E3
    notes.forEach((note, index) => {
      setTimeout(() => this.createBeep(note, 0.5, 0.1), index * 200);
    });
  }

  public playLevelUp(): void {
    // Sunet ascendent pentru level up
    const notes = [440, 554, 659, 880]; // A4, C#5, E5, A5
    notes.forEach((note, index) => {
      setTimeout(() => this.createBeep(note, 0.3, 0.1), index * 80);
    });
  }

  // Muzică de fundal simplă (opțională)
  private backgroundMusic: OscillatorNode | null = null;
  private musicGain: GainNode | null = null;

  public startBackgroundMusic(): void {
    if (!this.audioContext || !this.isInitialized || this.isMuted) return;
    
    this.stopBackgroundMusic();

    try {
      this.backgroundMusic = this.audioContext.createOscillator();
      this.musicGain = this.audioContext.createGain();
      
      this.backgroundMusic.connect(this.musicGain);
      this.musicGain.connect(this.audioContext.destination);
      
      // Ton constant foarte suav pentru atmosferă
      this.backgroundMusic.frequency.value = 110; // A2
      this.backgroundMusic.type = 'sine';
      this.musicGain.gain.value = 0.02; // Foarte încet
      
      this.backgroundMusic.start();
    } catch (error) {
      console.warn('Nu s-a putut porni muzica de fundal:', error);
    }
  }

  public stopBackgroundMusic(): void {
    if (this.backgroundMusic) {
      try {
        this.backgroundMusic.stop();
        this.backgroundMusic.disconnect();
      } catch (error) {
        console.warn('Eroare la oprirea muzicii:', error);
      }
      this.backgroundMusic = null;
    }
    if (this.musicGain) {
      this.musicGain.disconnect();
      this.musicGain = null;
    }
  }

  // Control volum
  public toggleMute(): boolean {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.stopBackgroundMusic();
    }
    return this.isMuted;
  }

  public isMutedState(): boolean {
    return this.isMuted;
  }

  // Cleanup
  public dispose(): void {
    this.stopBackgroundMusic();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
  }
}