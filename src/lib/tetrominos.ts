// Definirea celor 7 piese Tetromino clasice

export interface TetrominoShape {
  shape: number[][];
  color: string;
  name: string;
}

export interface Tetromino {
  shape: number[][];
  color: string;
  name: string;
  x: number;
  y: number;
  rotation: number;
}

// Toate rotațiile pentru fiecare piesă
export const TETROMINOS: Record<string, TetrominoShape[]> = {
  I: [
    {
      shape: [
        [0, 0, 0, 0],
        [1, 1, 1, 1],
        [0, 0, 0, 0],
        [0, 0, 0, 0]
      ],
      color: '#00f5ff',
      name: 'I'
    },
    {
      shape: [
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0],
        [0, 0, 1, 0]
      ],
      color: '#00f5ff',
      name: 'I'
    }
  ],
  O: [
    {
      shape: [
        [1, 1],
        [1, 1]
      ],
      color: '#ffff00',
      name: 'O'
    }
  ],
  T: [
    {
      shape: [
        [0, 1, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: '#800080',
      name: 'T'
    },
    {
      shape: [
        [0, 1, 0],
        [0, 1, 1],
        [0, 1, 0]
      ],
      color: '#800080',
      name: 'T'
    },
    {
      shape: [
        [0, 0, 0],
        [1, 1, 1],
        [0, 1, 0]
      ],
      color: '#800080',
      name: 'T'
    },
    {
      shape: [
        [0, 1, 0],
        [1, 1, 0],
        [0, 1, 0]
      ],
      color: '#800080',
      name: 'T'
    }
  ],
  S: [
    {
      shape: [
        [0, 1, 1],
        [1, 1, 0],
        [0, 0, 0]
      ],
      color: '#00ff00',
      name: 'S'
    },
    {
      shape: [
        [0, 1, 0],
        [0, 1, 1],
        [0, 0, 1]
      ],
      color: '#00ff00',
      name: 'S'
    }
  ],
  Z: [
    {
      shape: [
        [1, 1, 0],
        [0, 1, 1],
        [0, 0, 0]
      ],
      color: '#ff0000',
      name: 'Z'
    },
    {
      shape: [
        [0, 0, 1],
        [0, 1, 1],
        [0, 1, 0]
      ],
      color: '#ff0000',
      name: 'Z'
    }
  ],
  J: [
    {
      shape: [
        [1, 0, 0],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: '#0000ff',
      name: 'J'
    },
    {
      shape: [
        [0, 1, 1],
        [0, 1, 0],
        [0, 1, 0]
      ],
      color: '#0000ff',
      name: 'J'
    },
    {
      shape: [
        [0, 0, 0],
        [1, 1, 1],
        [0, 0, 1]
      ],
      color: '#0000ff',
      name: 'J'
    },
    {
      shape: [
        [0, 1, 0],
        [0, 1, 0],
        [1, 1, 0]
      ],
      color: '#0000ff',
      name: 'J'
    }
  ],
  L: [
    {
      shape: [
        [0, 0, 1],
        [1, 1, 1],
        [0, 0, 0]
      ],
      color: '#ffa500',
      name: 'L'
    },
    {
      shape: [
        [0, 1, 0],
        [0, 1, 0],
        [0, 1, 1]
      ],
      color: '#ffa500',
      name: 'L'
    },
    {
      shape: [
        [0, 0, 0],
        [1, 1, 1],
        [1, 0, 0]
      ],
      color: '#ffa500',
      name: 'L'
    },
    {
      shape: [
        [1, 1, 0],
        [0, 1, 0],
        [0, 1, 0]
      ],
      color: '#ffa500',
      name: 'L'
    }
  ]
};

export const TETROMINO_NAMES = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];

// Creare piesă aleatoare
export function createRandomTetromino(): Tetromino {
  const name = TETROMINO_NAMES[Math.floor(Math.random() * TETROMINO_NAMES.length)];
  const tetrominoShapes = TETROMINOS[name];
  const shape = tetrominoShapes[0];
  
  return {
    shape: shape.shape,
    color: shape.color,
    name: shape.name,
    x: Math.floor((10 - shape.shape[0].length) / 2), // Centrat pe grila
    y: 0,
    rotation: 0
  };
}

// Rotație piesă
export function rotateTetromino(tetromino: Tetromino): Tetromino {
  const shapes = TETROMINOS[tetromino.name];
  const nextRotation = (tetromino.rotation + 1) % shapes.length;
  const nextShape = shapes[nextRotation];
  
  return {
    ...tetromino,
    shape: nextShape.shape,
    rotation: nextRotation
  };
}

// Verifică dacă poziția este validă
export function isValidPosition(
  tetromino: Tetromino,
  grid: number[][],
  offsetX = 0,
  offsetY = 0
): boolean {
  const newX = tetromino.x + offsetX;
  const newY = tetromino.y + offsetY;
  
  for (let y = 0; y < tetromino.shape.length; y++) {
    for (let x = 0; x < tetromino.shape[y].length; x++) {
      if (tetromino.shape[y][x] === 1) {
        const boardX = newX + x;
        const boardY = newY + y;
        
        // Verifică limitele
        if (boardX < 0 || boardX >= 10 || boardY >= 20) {
          return false;
        }
        
        // Verifică coliziunea cu piesele existente (nu verifica Y < 0 pentru spawn)
        if (boardY >= 0 && grid[boardY][boardX] !== 0) {
          return false;
        }
      }
    }
  }
  
  return true;
}