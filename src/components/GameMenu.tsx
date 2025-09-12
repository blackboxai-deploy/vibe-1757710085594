"use client";

import React, { useState } from 'react';

interface GameMenuProps {
  isGameOver: boolean;
  finalScore: number;
  onStartGame: () => void;
}

export default function GameMenu({
  isGameOver,
  finalScore,
  onStartGame
}: GameMenuProps) {
  const [showInstructions, setShowInstructions] = useState(false);

  const handleStartClick = async () => {
    try {
      await onStartGame();
    } catch (error) {
      console.error('Eroare la pornirea jocului:', error);
    }
  };

  if (showInstructions) {
    return (
      <div className="w-full max-w-sm mx-auto bg-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-700/50 p-6 shadow-2xl">
        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Cum să joci
        </h2>

        <div className="space-y-4 text-slate-200 text-sm">
          <div>
            <h3 className="text-white font-semibold mb-2">📱 Controale Mobile</h3>
            <ul className="space-y-1 text-slate-300 ml-2">
              <li>• <strong>Swipe stânga/dreapta</strong> - Mută piesa</li>
              <li>• <strong>Swipe în jos</strong> - Cădere rapidă</li>
              <li>• <strong>Swipe în sus</strong> - Drop instant</li>
              <li>• <strong>Tap</strong> - Rotește piesa</li>
              <li>• <strong>Double tap</strong> - Drop instant</li>
              <li>• <strong>Ține apăsat</strong> - Cădere continuă</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">⌨️ Controale Tastatură</h3>
            <ul className="space-y-1 text-slate-300 ml-2">
              <li>• <strong>←→ sau A/D</strong> - Mută lateral</li>
              <li>• <strong>↓ sau S</strong> - Cădere rapidă</li>
              <li>• <strong>↑, W sau Spațiu</strong> - Rotește</li>
              <li>• <strong>Enter</strong> - Drop instant</li>
              <li>• <strong>P sau Escape</strong> - Pauză</li>
            </ul>
          </div>

          <div>
            <h3 className="text-white font-semibold mb-2">🎯 Scopul Jocului</h3>
            <ul className="space-y-1 text-slate-300 ml-2">
              <li>• Completează linii orizontale pentru a le elimina</li>
              <li>• Evită să umpli complet partea de sus</li>
              <li>• Cu cât elimini mai multe linii, cu atât mai multe puncte</li>
              <li>• <strong>Tetris</strong> (4 linii odată) = bonus mare!</li>
            </ul>
          </div>

          <div className="bg-slate-800 rounded-lg p-3 mt-4">
            <h3 className="text-white font-semibold mb-2">🏆 Sistem Scoring</h3>
            <div className="grid grid-cols-2 gap-2 text-xs text-slate-300">
              <div>1 linie: 100 × nivel</div>
              <div>2 linii: 300 × nivel</div>
              <div>3 linii: 500 × nivel</div>
              <div>4 linii: 800 × nivel</div>
            </div>
            <p className="text-xs text-slate-400 mt-2">
              Nivelul crește la fiecare 10 linii eliminate
            </p>
          </div>
        </div>

        <button
          onClick={() => setShowInstructions(false)}
          className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-semibold py-3 rounded-lg transition-colors"
        >
          Înapoi la Meniu
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto bg-slate-900/95 backdrop-blur-sm rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 text-center">
        <h1 className="text-4xl font-bold text-white mb-2 drop-shadow-lg">
          TETRIS
        </h1>
        <p className="text-purple-100 text-sm">
          Jocul clasic pentru mobile
        </p>
      </div>

      {/* Conținut principal */}
      <div className="p-6">
        {isGameOver && (
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-red-400 mb-2">
              Jocul s-a terminat!
            </h2>
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-600">
              <p className="text-slate-300 text-sm mb-2">Scor final:</p>
              <p className="text-2xl font-bold text-yellow-400">
                {finalScore.toLocaleString('ro-RO')}
              </p>
            </div>
          </div>
        )}

        {!isGameOver && (
          <div className="text-center mb-6">
            <h2 className="text-xl font-semibold text-white mb-4">
              Bun venit!
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Pregătește-te pentru cea mai captivantă experiență Tetris pe mobile.
              Controale intuitive și gameplay fluid te așteaptă!
            </p>
          </div>
        )}

        {/* Butoane principale */}
        <div className="space-y-3">
          <button
            onClick={handleStartClick}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            {isGameOver ? '🔄 Joacă din nou' : '🚀 Începe jocul'}
          </button>

          <button
            onClick={() => setShowInstructions(true)}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 rounded-lg transition-colors"
          >
            📖 Instrucțiuni
          </button>
        </div>

        {/* Funcționalități destacate */}
        <div className="mt-6 space-y-3">
          <h3 className="text-slate-300 font-semibold text-sm text-center">
            ✨ Caracteristici
          </h3>
          
          <div className="grid grid-cols-2 gap-3 text-xs text-slate-400">
            <div className="text-center">
              📱<br />Controale<br />Touch
            </div>
            <div className="text-center">
              🎵<br />Efecte<br />Sonore
            </div>
            <div className="text-center">
              🏆<br />Sistem<br />Scoring
            </div>
            <div className="text-center">
              ⚡<br />Performance<br />Optimizat
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 pt-4 border-t border-slate-700">
          <p className="text-slate-500 text-xs">
            Tetris Mobile v1.0 • Optimizat pentru toate dispozitivele
          </p>
        </div>
      </div>
    </div>
  );
}