"use client";

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { TetrisEngine, GameState } from '@/lib/tetris-engine';
import { AudioManager } from '@/lib/audio-manager';
import GameCanvas from './GameCanvas';
import GameControls from './GameControls';
import GameHUD from './GameHUD';
import GameMenu from './GameMenu';

export default function TetrisGame() {
  const engineRef = useRef<TetrisEngine | null>(null);
  const audioRef = useRef<AudioManager | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);
  
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [showMenu, setShowMenu] = useState(true);

   // Inițializare engine și audio
  useEffect(() => {
    engineRef.current = new TetrisEngine();
    audioRef.current = new AudioManager();
    setGameState(engineRef.current.getState());

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      audioRef.current?.dispose();
    };
  }, []);

  // Game loop principal
  const gameLoop = useCallback((currentTime: number) => {
    if (!engineRef.current) return;

    const deltaTime = currentTime - lastTimeRef.current;
    lastTimeRef.current = currentTime;

    // Update engine
    engineRef.current.update(deltaTime);
    setGameState(engineRef.current.getState());

    // Continuă loop-ul
    animationRef.current = requestAnimationFrame(gameLoop);
  }, []);

  // Start nou joc
  const startNewGame = useCallback(async () => {
    if (!engineRef.current || !audioRef.current) return;

    // Resume audio context pentru mobile
    await audioRef.current.resumeAudio();
    
    engineRef.current.startGame();
    setGameState(engineRef.current.getState());
    setShowMenu(false);
    
    // Pornește game loop
    lastTimeRef.current = performance.now();
    animationRef.current = requestAnimationFrame(gameLoop);
    
    // Background music opțională
    audioRef.current.startBackgroundMusic();
  }, [gameLoop]);

  // Pause/Resume
  const togglePause = useCallback(() => {
    if (!engineRef.current) return;
    
    engineRef.current.pauseGame();
    setGameState(engineRef.current.getState());
  }, []);

  // Controale joc
  const moveLeft = useCallback(() => {
    if (!engineRef.current) return;
    if (engineRef.current.movePiece(-1, 0)) {
      audioRef.current?.playMove();
    }
  }, []);

  const moveRight = useCallback(() => {
    if (!engineRef.current) return;
    if (engineRef.current.movePiece(1, 0)) {
      audioRef.current?.playMove();
    }
  }, []);

  const moveDown = useCallback(() => {
    if (!engineRef.current) return;
    if (engineRef.current.movePiece(0, 1)) {
      audioRef.current?.playMove();
    }
  }, []);

  const rotate = useCallback(() => {
    if (!engineRef.current) return;
    if (engineRef.current.rotatePiece()) {
      audioRef.current?.playRotate();
    }
  }, []);

  const hardDrop = useCallback(() => {
    if (!engineRef.current) return;
    engineRef.current.hardDrop();
    audioRef.current?.playDrop();
  }, []);

  // Control keyboard pentru desktop
  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (showMenu || !gameState?.isPlaying || gameState?.isPaused) return;

      switch (event.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          event.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          event.preventDefault();
          moveRight();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          event.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
        case ' ':
          event.preventDefault();
          rotate();
          break;
        case 'Enter':
          event.preventDefault();
          hardDrop();
          break;
        case 'Escape':
        case 'p':
        case 'P':
          event.preventDefault();
          togglePause();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showMenu, gameState, moveLeft, moveRight, moveDown, rotate, hardDrop, togglePause]);

  // Game Over handling
  useEffect(() => {
    if (gameState?.isGameOver && !showMenu) {
      audioRef.current?.playGameOver();
      audioRef.current?.stopBackgroundMusic();
      
      // Arată meniul după 2 secunde
      setTimeout(() => {
        setShowMenu(true);
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      }, 2000);
    }
  }, [gameState?.isGameOver, showMenu]);

  // Level up sound
  useEffect(() => {
    if (gameState && gameState.level > 1) {
      // Verifică dacă este level nou (salvează previous level)
      const prevLevel = useRef(1);
      if (gameState.level > prevLevel.current) {
        audioRef.current?.playLevelUp();
        prevLevel.current = gameState.level;
      }
    }
  }, [gameState?.level]);

  // Toggle mute
  const toggleMute = useCallback(() => {
    return audioRef.current?.toggleMute() ?? false;
  }, []);

  if (showMenu || !gameState) {
    return (
      <GameMenu
        isGameOver={gameState?.isGameOver ?? false}
        finalScore={gameState?.score ?? 0}
        onStartGame={startNewGame}
      />
    );
  }

  return (
    <div className="relative w-full max-w-sm mx-auto bg-slate-900/90 rounded-xl backdrop-blur-sm border border-slate-700/50 overflow-hidden shadow-2xl">
      {/* Header cu scor */}
      <GameHUD
        score={gameState.score}
        level={gameState.level}
        lines={gameState.lines}
        nextPiece={gameState.nextPiece}
        isPaused={gameState.isPaused}
        isMuted={audioRef.current?.isMutedState() ?? false}
        onPause={togglePause}
        onMute={toggleMute}
      />

      {/* Canvas-ul principal */}
      <div className="relative">
        <GameCanvas
          gameState={gameState}
          engine={engineRef.current!}
        />
        
        {/* Overlay pentru pauză */}
        {gameState.isPaused && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-2">PAUZĂ</h2>
              <p className="text-sm text-gray-300">Atinge pentru a continua</p>
            </div>
          </div>
        )}

        {/* Game Over overlay */}
        {gameState.isGameOver && (
          <div className="absolute inset-0 bg-red-900/80 flex items-center justify-center backdrop-blur-sm">
            <div className="text-center text-white">
              <h2 className="text-2xl font-bold mb-2">JOCUL S-A TERMINAT</h2>
              <p className="text-lg font-semibold text-yellow-300">Scor: {gameState.score}</p>
              <p className="text-sm text-gray-300 mt-2">Se întoarce la meniu...</p>
            </div>
          </div>
        )}
      </div>

      {/* Controale */}
      <GameControls
        onMoveLeft={moveLeft}
        onMoveRight={moveRight}
        onMoveDown={moveDown}
        onRotate={rotate}
        onHardDrop={hardDrop}
        disabled={gameState.isPaused || gameState.isGameOver}
      />
    </div>
  );
}