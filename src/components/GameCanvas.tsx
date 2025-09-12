"use client";

import React, { useRef, useEffect } from 'react';
import { GameState, TetrisEngine } from '@/lib/tetris-engine';

interface GameCanvasProps {
  gameState: GameState;
  engine: TetrisEngine;
}

export default function GameCanvas({ gameState, engine }: GameCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number | null>(null);

  // Dimensiuni canvas optimizate pentru mobile
  const CANVAS_WIDTH = 300;
  const CANVAS_HEIGHT = 600;
  const CELL_SIZE = CANVAS_WIDTH / 10; // 30px per celulă
  const BORDER_WIDTH = 2;

  // Culori pentru diferite tipuri de celule
  const COLORS = {
    empty: '#0f172a', // slate-900
    filled: '#64748b', // slate-500
    current: '#3b82f6', // blue-500 pentru piesa curentă
    shadow: '#1e293b', // slate-800 pentru shadow
    border: '#475569' // slate-600
  };

  // Culori specifice pentru piese (dacă vrem să păstrăm culorile originale)
  const PIECE_COLORS: Record<string, string> = {
    I: '#00f5ff',
    O: '#ffff00', 
    T: '#800080',
    S: '#00ff00',
    Z: '#ff0000',
    J: '#0000ff',
    L: '#ffa500'
  };

  const drawGrid = (ctx: CanvasRenderingContext2D, grid: number[][]) => {
    // Desenează gridul de bază
    ctx.fillStyle = COLORS.empty;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Desenează celulele
    for (let y = 0; y < 20; y++) {
      for (let x = 0; x < 10; x++) {
        const cellX = x * CELL_SIZE;
        const cellY = y * CELL_SIZE;

        // Culoare celulă bazată pe conținut
        let cellColor = COLORS.empty;
        if (grid[y][x] === 1) {
          cellColor = COLORS.filled; // Piese plasate
        } else if (grid[y][x] === 2) {
          cellColor = COLORS.current; // Piesa curentă
        }

        if (grid[y][x] !== 0) {
          // Desenează celula cu gradient pentru efect 3D
          const gradient = ctx.createLinearGradient(cellX, cellY, cellX + CELL_SIZE, cellY + CELL_SIZE);
          gradient.addColorStop(0, cellColor);
          gradient.addColorStop(1, adjustBrightness(cellColor, -0.3));
          
          ctx.fillStyle = gradient;
          ctx.fillRect(cellX + 1, cellY + 1, CELL_SIZE - 2, CELL_SIZE - 2);

          // Border pentru celulă
          ctx.strokeStyle = adjustBrightness(cellColor, 0.2);
          ctx.lineWidth = 1;
          ctx.strokeRect(cellX + 0.5, cellY + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);
        }
      }
    }

    // Desenează liniile grilei (subtil)
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = 0.5;
    ctx.globalAlpha = 0.3;

    // Linii verticale
    for (let x = 0; x <= 10; x++) {
      ctx.beginPath();
      ctx.moveTo(x * CELL_SIZE, 0);
      ctx.lineTo(x * CELL_SIZE, CANVAS_HEIGHT);
      ctx.stroke();
    }

    // Linii orizontale
    for (let y = 0; y <= 20; y++) {
      ctx.beginPath();
      ctx.moveTo(0, y * CELL_SIZE);
      ctx.lineTo(CANVAS_WIDTH, y * CELL_SIZE);
      ctx.stroke();
    }

    ctx.globalAlpha = 1;
  };

  const drawShadow = (ctx: CanvasRenderingContext2D) => {
    if (!gameState.currentPiece) return;

    const shadowPos = engine.getShadowPosition();
    if (!shadowPos) return;

    const shape = gameState.currentPiece.shape;
    
    ctx.fillStyle = COLORS.shadow;
    ctx.globalAlpha = 0.4;

    for (let y = 0; y < shape.length; y++) {
      for (let x = 0; x < shape[y].length; x++) {
        if (shape[y][x] === 1) {
          const cellX = (shadowPos.x + x) * CELL_SIZE;
          const cellY = (shadowPos.y + y) * CELL_SIZE;
          
          if (cellY >= 0) {
            ctx.fillRect(cellX + 2, cellY + 2, CELL_SIZE - 4, CELL_SIZE - 4);
            
            // Border subtil pentru shadow
            ctx.strokeStyle = COLORS.shadow;
            ctx.lineWidth = 1;
            ctx.strokeRect(cellX + 1.5, cellY + 1.5, CELL_SIZE - 3, CELL_SIZE - 3);
          }
        }
      }
    }

    ctx.globalAlpha = 1;
  };

  const drawCurrentPiece = (ctx: CanvasRenderingContext2D) => {
    if (!gameState.currentPiece) return;

    const piece = gameState.currentPiece;
    const pieceColor = PIECE_COLORS[piece.name] || COLORS.current;

    // Gradient pentru piesa curentă
    for (let y = 0; y < piece.shape.length; y++) {
      for (let x = 0; x < piece.shape[y].length; x++) {
        if (piece.shape[y][x] === 1) {
          const cellX = (piece.x + x) * CELL_SIZE;
          const cellY = (piece.y + y) * CELL_SIZE;

          if (cellY >= 0) {
            // Gradient 3D pentru piesa activă
            const gradient = ctx.createRadialGradient(
              cellX + CELL_SIZE/2, cellY + CELL_SIZE/2, 2,
              cellX + CELL_SIZE/2, cellY + CELL_SIZE/2, CELL_SIZE/2
            );
            gradient.addColorStop(0, adjustBrightness(pieceColor, 0.4));
            gradient.addColorStop(1, pieceColor);

            ctx.fillStyle = gradient;
            ctx.fillRect(cellX + 1, cellY + 1, CELL_SIZE - 2, CELL_SIZE - 2);

            // Highlight pentru efectul 3D
            ctx.fillStyle = adjustBrightness(pieceColor, 0.6);
            ctx.fillRect(cellX + 2, cellY + 2, CELL_SIZE - 10, 3); // Top highlight

            // Shadow pentru efect 3D
            ctx.fillStyle = adjustBrightness(pieceColor, -0.4);
            ctx.fillRect(cellX + CELL_SIZE - 5, cellY + 5, 3, CELL_SIZE - 7); // Right shadow
            ctx.fillRect(cellX + 5, cellY + CELL_SIZE - 5, CELL_SIZE - 7, 3); // Bottom shadow

            // Border
            ctx.strokeStyle = adjustBrightness(pieceColor, -0.2);
            ctx.lineWidth = 2;
            ctx.strokeRect(cellX + 0.5, cellY + 0.5, CELL_SIZE - 1, CELL_SIZE - 1);
          }
        }
      }
    }
  };

  // Utilitate pentru ajustarea luminozității culorilor
  const adjustBrightness = (color: string, factor: number): string => {
    // Convertește hex la RGB și ajustează luminozitatea
    const hex = color.replace('#', '');
    const r = Math.max(0, Math.min(255, parseInt(hex.substr(0, 2), 16) * (1 + factor)));
    const g = Math.max(0, Math.min(255, parseInt(hex.substr(2, 2), 16) * (1 + factor)));
    const b = Math.max(0, Math.min(255, parseInt(hex.substr(4, 2), 16) * (1 + factor)));
    
    return `rgb(${Math.round(r)}, ${Math.round(g)}, ${Math.round(b)})`;
  };

  // Funcția principală de rendering
  const render = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Curăță canvas-ul
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Obține grila cu piesa curentă
    const gridWithPiece = engine.getGridWithCurrentPiece();

    // Desenează shadow-ul (ghost piece)
    drawShadow(ctx);

    // Desenează gridul cu piesele plasate
    drawGrid(ctx, gridWithPiece);

    // Desenează piesa curentă cu efecte speciale
    drawCurrentPiece(ctx);

    // Border general pentru canvas
    ctx.strokeStyle = COLORS.border;
    ctx.lineWidth = BORDER_WIDTH;
    ctx.strokeRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Continuă animația
    animationRef.current = requestAnimationFrame(render);
  };

  // Pornește rendering-ul
  useEffect(() => {
    render();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [gameState]);

  return (
    <div className="flex justify-center bg-slate-800 p-4">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="border-2 border-slate-600 rounded-lg shadow-inner bg-slate-900"
        style={{
          imageRendering: 'pixelated', // Pentru aspect retro
          maxWidth: '100%',
          height: 'auto'
        }}
      />
    </div>
  );
}