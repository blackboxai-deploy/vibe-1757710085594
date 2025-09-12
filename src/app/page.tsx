"use client";

import React from 'react';
import TetrisGame from '@/components/TetrisGame';

export default function HomePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
            TETRIS
          </h1>
          <p className="text-indigo-200 text-sm">
            Jocul clasic optimizat pentru mobile
          </p>
        </div>
        
        <TetrisGame />
        
        <div className="text-center mt-4 text-xs text-indigo-300">
          <p>Atinge pentru a juca • Swipe pentru mișcare • Tap pentru rotație</p>
        </div>
      </div>
    </main>
  );
}