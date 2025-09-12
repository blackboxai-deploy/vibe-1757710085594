import { Tetromino, createRandomTetromino, rotateTetromino, isValidPosition } from './tetrominos';

export interface GameState {
  grid: number[][];
  currentPiece: Tetromino | null;
  nextPiece: Tetromino | null;
  score: number;
  level: number;
  lines: number;
  isGameOver: boolean;
  isPaused: boolean;
  isPlaying: boolean;
}

export class TetrisEngine {
  private state: GameState;
  private dropTimer: number = 0;
  private dropInterval: number = 1000; // 1 secunda initial
  
  constructor() {
    this.state = this.createInitialState();
  }

  private createInitialState(): GameState {
    return {
      grid: Array(20).fill(null).map(() => Array(10).fill(0)),
      currentPiece: null,
      nextPiece: null,
      score: 0,
      level: 1,
      lines: 0,
      isGameOver: false,
      isPaused: false,
      isPlaying: false
    };
  }

  public getState(): GameState {
    return { ...this.state };
  }

  public startGame(): void {
    this.state = this.createInitialState();
    this.state.isPlaying = true;
    this.state.currentPiece = createRandomTetromino();
    this.state.nextPiece = createRandomTetromino();
    this.updateDropInterval();
  }

  public pauseGame(): void {
    this.state.isPaused = !this.state.isPaused;
  }

  public resetGame(): void {
    this.state = this.createInitialState();
  }

  private updateDropInterval(): void {
    // Viteza crește cu nivelul: nivel 1 = 1000ms, nivel 10 = 100ms
    this.dropInterval = Math.max(100, 1000 - (this.state.level - 1) * 100);
  }

  public update(deltaTime: number): void {
    if (!this.state.isPlaying || this.state.isPaused || this.state.isGameOver) {
      return;
    }

    this.dropTimer += deltaTime;
    
    if (this.dropTimer >= this.dropInterval) {
      this.dropTimer = 0;
      this.movePiece(0, 1); // Auto-drop
    }
  }

  public movePiece(dx: number, dy: number): boolean {
    if (!this.state.currentPiece || this.state.isGameOver) return false;

    if (isValidPosition(this.state.currentPiece, this.state.grid, dx, dy)) {
      this.state.currentPiece.x += dx;
      this.state.currentPiece.y += dy;
      return true;
    } else if (dy > 0) {
      // Nu se poate mișca în jos - piesa a aterizat
      this.placePiece();
      return false;
    }
    
    return false;
  }

  public rotatePiece(): boolean {
    if (!this.state.currentPiece || this.state.isGameOver) return false;

    const rotated = rotateTetromino(this.state.currentPiece);
    
    // Încearcă rotația în poziția curentă
    if (isValidPosition(rotated, this.state.grid)) {
      this.state.currentPiece = rotated;
      return true;
    }
    
    // Wall kick - încearcă să mute piesa pentru rotație validă
    const kicks = [[-1, 0], [1, 0], [0, -1], [-2, 0], [2, 0]];
    
    for (const [kickX, kickY] of kicks) {
      if (isValidPosition(rotated, this.state.grid, kickX, kickY)) {
        this.state.currentPiece = rotated;
        this.state.currentPiece.x += kickX;
        this.state.currentPiece.y += kickY;
        return true;
      }
    }
    
    return false;
  }

  public hardDrop(): void {
    if (!this.state.currentPiece || this.state.isGameOver) return;

    let dropDistance = 0;
    while (this.movePiece(0, 1)) {
      dropDistance++;
    }
    
    // Bonus puncte pentru hard drop
    this.state.score += dropDistance * 2;
  }

  private placePiece(): void {
    if (!this.state.currentPiece) return;

    // Plasează piesa pe grilă
    for (let y = 0; y < this.state.currentPiece.shape.length; y++) {
      for (let x = 0; x < this.state.currentPiece.shape[y].length; x++) {
        if (this.state.currentPiece.shape[y][x] === 1) {
          const boardX = this.state.currentPiece.x + x;
          const boardY = this.state.currentPiece.y + y;
          
          if (boardY >= 0 && boardX >= 0 && boardX < 10 && boardY < 20) {
            this.state.grid[boardY][boardX] = 1;
          }
        }
      }
    }

    // Verifică liniile complete
    this.clearLines();
    
    // Verifică game over
    if (this.isTopRowBlocked()) {
      this.state.isGameOver = true;
      this.state.isPlaying = false;
      return;
    }

    // Generează următoarea piesă
    this.state.currentPiece = this.state.nextPiece;
    this.state.nextPiece = createRandomTetromino();
  }

  private isTopRowBlocked(): boolean {
    // Verifică dacă prima linie are blocuri (game over condition)
    return this.state.grid[0].some(cell => cell !== 0);
  }

  private clearLines(): void {
    const linesToClear: number[] = [];
    
    // Găsește liniile complete
    for (let y = 0; y < 20; y++) {
      if (this.state.grid[y].every(cell => cell !== 0)) {
        linesToClear.push(y);
      }
    }

    if (linesToClear.length === 0) return;

    // Elimină liniile complete
    linesToClear.forEach(lineIndex => {
      this.state.grid.splice(lineIndex, 1);
      this.state.grid.unshift(Array(10).fill(0)); // Adaugă linie goală sus
    });

    // Calculează scoring
    const linesCleared = linesToClear.length;
    this.state.lines += linesCleared;
    
    // Sistem de scoring: 1 linie = 100, 2 linii = 300, 3 linii = 500, 4 linii (Tetris) = 800
    const lineScores = [0, 100, 300, 500, 800];
    const baseScore = lineScores[linesCleared] || 800;
    this.state.score += baseScore * this.state.level;

    // Avansează nivelul la fiecare 10 linii
    const newLevel = Math.floor(this.state.lines / 10) + 1;
    if (newLevel > this.state.level) {
      this.state.level = newLevel;
      this.updateDropInterval();
    }
  }

  // Obține preview-ul grilei cu piesa curentă
  public getGridWithCurrentPiece(): number[][] {
    const grid = this.state.grid.map(row => [...row]);
    
    if (!this.state.currentPiece) return grid;

    // Adaugă piesa curentă pe grilă
    for (let y = 0; y < this.state.currentPiece.shape.length; y++) {
      for (let x = 0; x < this.state.currentPiece.shape[y].length; x++) {
        if (this.state.currentPiece.shape[y][x] === 1) {
          const boardX = this.state.currentPiece.x + x;
          const boardY = this.state.currentPiece.y + y;
          
          if (boardY >= 0 && boardX >= 0 && boardX < 10 && boardY < 20) {
            grid[boardY][boardX] = 2; // 2 = piesa curentă (pentru culoare diferită)
          }
        }
      }
    }

    return grid;
  }

  // Obține shadow-ul (ghost piece) pentru preview
  public getShadowPosition(): { x: number; y: number } | null {
    if (!this.state.currentPiece) return null;

    let shadowY = this.state.currentPiece.y;
    
    // Găsește cea mai de jos poziție validă
    while (isValidPosition(this.state.currentPiece, this.state.grid, 0, shadowY + 1 - this.state.currentPiece.y)) {
      shadowY++;
    }

    return { x: this.state.currentPiece.x, y: shadowY };
  }
}