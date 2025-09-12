"use client";

import React from 'react';
import { Tetromino } from '@/lib/tetrominos';

interface GameHUDProps {
  score: number;
  level: number;
  lines: number;
  nextPiece: Tetromino | null;
  isPaused: boolean;
  isMuted: boolean;
  onPause: () => void;
  onMute: () => void;
}

export default function GameHUD({
  score,
  level,
  lines,
  nextPiece,
  isPaused,
  isMuted,
  onPause,
  onMute
}: GameHUDProps) {

  // Mini-canvas pentru next piece
  const drawNextPiece = (piece: Tetromino | null): React.ReactElement => {
    if (!piece) {
      return (
        <div className="w-16 h-16 bg-slate-800 rounded border-2 border-slate-600 flex items-center justify-center">
          <span className="text-slate-500 text-xs">?</span>
        </div>
      );
    }

    const shape = piece.shape;
    const cellSize = 12; // Dimensiune mică pentru preview

    return (
      <div className="w-16 h-16 bg-slate-800 rounded border-2 border-slate-600 flex items-center justify-center">
        <div 
          className="grid gap-0"
          style={{
            gridTemplateColumns: `repeat(${shape[0].length}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${shape.length}, ${cellSize}px)`
          }}
        >
          {shape.flat().map((cell, index) => (
            <div
              key={index}
              className={`w-3 h-3 ${
                cell === 1 
                  ? 'border border-slate-400' 
                  : 'bg-transparent'
              }`}
              style={{
                backgroundColor: cell === 1 ? piece.color : 'transparent',
                boxShadow: cell === 1 ? `inset 0 1px 0 rgba(255,255,255,0.3)` : 'none'
              }}
            />
          ))}
        </div>
      </div>
    );
  };

  const formatScore = (score: number): string => {
    return score.toLocaleString('ro-RO');
  };

  return (
    <div className="bg-slate-900 border-b border-slate-600 p-4">
      {/* Linia de sus cu butoanele de control */}
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-xl font-bold text-white">TETRIS</h1>
        
        <div className="flex gap-2">
          {/* Buton pause */}
          <button
            onClick={onPause}
            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
              isPaused 
                ? 'bg-green-600 hover:bg-green-500 text-white' 
                : 'bg-yellow-600 hover:bg-yellow-500 text-white'
            }`}
            aria-label={isPaused ? 'Continuă jocul' : 'Pauză'}
          >
            {isPaused ? '▶' : '⏸'}
          </button>
          
          {/* Buton mute */}
          <button
            onClick={onMute}
            className={`px-3 py-1 rounded text-sm font-medium transition-all ${
              isMuted 
                ? 'bg-red-600 hover:bg-red-500 text-white' 
                : 'bg-blue-600 hover:bg-blue-500 text-white'
            }`}
            aria-label={isMuted ? 'Activează sunetul' : 'Dezactivează sunetul'}
          >
            {isMuted ? '🔇' : '🔊'}
          </button>
        </div>
      </div>

      {/* Statistici principale */}
      <div className="grid grid-cols-2 gap-4">
        {/* Coloana stânga - statistici */}
        <div className="space-y-3">
          {/* Scor */}
          <div className="bg-slate-800 rounded-lg p-3 border border-slate-600">
            <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">
              Scor
            </div>
            <div className="text-white text-lg font-bold font-mono">
              {formatScore(score)}
            </div>
          </div>

          {/* Nivel și linii */}
          <div className="flex gap-2">
            <div className="bg-slate-800 rounded-lg p-2 border border-slate-600 flex-1">
              <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                Nivel
              </div>
              <div className="text-blue-400 text-lg font-bold">
                {level}
              </div>
            </div>
            
            <div className="bg-slate-800 rounded-lg p-2 border border-slate-600 flex-1">
              <div className="text-slate-400 text-xs uppercase tracking-wide mb-1">
                Linii
              </div>
              <div className="text-green-400 text-lg font-bold">
                {lines}
              </div>
            </div>
          </div>
        </div>

        {/* Coloana dreapta - piesa următoare */}
        <div className="flex flex-col items-center">
          <div className="text-slate-400 text-xs uppercase tracking-wide mb-2">
            Următoarea
          </div>
          {drawNextPiece(nextPiece)}
          
          {/* Indicator pentru progresul către următorul nivel */}
          <div className="mt-3 w-full">
            <div className="text-slate-500 text-xs text-center mb-1">
              Progres nivel {level + 1}
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2">
              <div 
                className="bg-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ 
                  width: `${((lines % 10) / 10) * 100}%` 
                }}
              />
            </div>
            <div className="text-slate-500 text-xs text-center mt-1">
              {10 - (lines % 10)} linii până la nivel {level + 1}
            </div>
          </div>
        </div>
      </div>

      {/* Linia de jos cu informații rapide */}
      <div className="mt-4 flex justify-between items-center text-xs text-slate-400">
        <div>
          Viteza: {Math.max(100, 1000 - (level - 1) * 100)}ms
        </div>
        <div>
          {isPaused ? '⏸ PAUZĂ' : '▶ JOACĂ'}
        </div>
      </div>

      {/* Separator decorativ */}
      <div className="mt-4 h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent" />
    </div>
  );
}