"use client";

import React, { useRef, useCallback } from 'react';

interface GameControlsProps {
  onMoveLeft: () => void;
  onMoveRight: () => void;
  onMoveDown: () => void;
  onRotate: () => void;
  onHardDrop: () => void;
  disabled?: boolean;
}

export default function GameControls({
  onMoveLeft,
  onMoveRight, 
  onMoveDown,
  onRotate,
  onHardDrop,
  disabled = false
}: GameControlsProps) {
  
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastTouchRef = useRef<number>(0);
  const repeatIntervalRef = useRef<number | null>(null);

  // Configurare pentru controale
  const SWIPE_THRESHOLD = 30; // pixeli pentru a detecta swipe
  const TAP_THRESHOLD = 10; // pixeli pentru a detecta tap vs swipe
  const DOUBLE_TAP_THRESHOLD = 300; // ms pentru double tap
  const REPEAT_DELAY = 150; // ms pentru repeat când ții apăsat

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (disabled) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
    
    // Pornește repeat pentru mișcare în jos când ții apăsat
    repeatIntervalRef.current = window.setTimeout(() => {
      const interval = window.setInterval(() => {
        if (touchStartRef.current) {
          onMoveDown();
        }
      }, REPEAT_DELAY);
      
      // Curăță interval-ul când ridici degetul
      const clearRepeat = () => {
        clearInterval(interval);
      };
      
      // Adaugă event listeners temporari
      document.addEventListener('touchend', clearRepeat, { once: true });
      document.addEventListener('touchcancel', clearRepeat, { once: true });
    }, REPEAT_DELAY * 2); // Început repeat după 2x delay
    
  }, [disabled, onMoveDown]);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (disabled || !touchStartRef.current) return;
    e.preventDefault();

    // Curăță repeat timer
    if (repeatIntervalRef.current) {
      window.clearTimeout(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }

    const touch = e.changedTouches[0];
    const startPos = touchStartRef.current;
    const deltaX = touch.clientX - startPos.x;
    const deltaY = touch.clientY - startPos.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Detectează tipul de gesture
    if (distance < TAP_THRESHOLD) {
      // TAP - verifică pentru double tap
      const now = Date.now();
      if (now - lastTouchRef.current < DOUBLE_TAP_THRESHOLD) {
        // Double tap = hard drop
        onHardDrop();
        lastTouchRef.current = 0; // Reset pentru a evita triple tap
      } else {
        // Single tap = rotire
        onRotate();
        lastTouchRef.current = now;
      }
    } else {
      // SWIPE - determină direcția
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        // Swipe orizontal
        if (Math.abs(deltaX) > SWIPE_THRESHOLD) {
          if (deltaX > 0) {
            onMoveRight();
          } else {
            onMoveLeft();
          }
        }
      } else {
        // Swipe vertical
        if (Math.abs(deltaY) > SWIPE_THRESHOLD) {
          if (deltaY > 0) {
            onMoveDown();
          } else {
            // Swipe sus = hard drop
            onHardDrop();
          }
        }
      }
    }

    touchStartRef.current = null;
  }, [disabled, onMoveLeft, onMoveRight, onMoveDown, onRotate, onHardDrop]);

  const handleTouchCancel = useCallback(() => {
    touchStartRef.current = null;
    if (repeatIntervalRef.current) {
      window.clearTimeout(repeatIntervalRef.current);
      repeatIntervalRef.current = null;
    }
  }, []);

  // Previne comportamentul default pentru touch
  const preventDefaultTouch = useCallback((e: React.TouchEvent) => {
    e.preventDefault();
  }, []);

  return (
    <div className="bg-slate-800 border-t border-slate-600">
      {/* Zona de touch principală - invisibilă dar funcțională */}
      <div
        className="w-full h-32 relative touch-none"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onTouchMove={preventDefaultTouch}
        style={{ 
          touchAction: 'none',
          userSelect: 'none',
          WebkitUserSelect: 'none'
        }}
      >
        {/* Indicatori vizuali pentru gesturi */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="grid grid-cols-3 gap-4 w-full max-w-xs px-8">
            
            {/* Indicator stânga */}
            <div className="text-center text-slate-400">
              <div className="text-lg">←</div>
              <div className="text-xs">Swipe</div>
            </div>
            
            {/* Indicator centru (tap/rotire) */}
            <div className="text-center text-slate-400">
              <div className="text-lg">↻</div>
              <div className="text-xs">Tap</div>
            </div>
            
            {/* Indicator dreapta */}
            <div className="text-center text-slate-400">
              <div className="text-lg">→</div>
              <div className="text-xs">Swipe</div>
            </div>
            
          </div>
        </div>

        {/* Indicatori pentru gesturi verticale */}
        <div className="absolute top-2 left-1/2 transform -translate-x-1/2 text-center text-slate-400">
          <div className="text-sm">↑ Drop • ↓ Down</div>
        </div>

        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 text-center text-slate-400">
          <div className="text-xs">Double tap = Hard Drop</div>
        </div>

        {/* Overlay pentru disabled state */}
        {disabled && (
          <div className="absolute inset-0 bg-slate-900/70 flex items-center justify-center">
            <div className="text-slate-500 text-center">
              <div className="text-sm">Controalele sunt dezactivate</div>
            </div>
          </div>
        )}
      </div>

      {/* Butoane fizice pentru desktop/debugging (opționale) */}
      <div className="hidden sm:flex justify-center gap-2 p-4 bg-slate-750">
        <button
          onClick={onMoveLeft}
          disabled={disabled}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white rounded text-sm transition-colors"
        >
          ← Stânga
        </button>
        <button
          onClick={onMoveRight}
          disabled={disabled}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white rounded text-sm transition-colors"
        >
          Dreapta →
        </button>
        <button
          onClick={onMoveDown}
          disabled={disabled}
          className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white rounded text-sm transition-colors"
        >
          ↓ Jos
        </button>
        <button
          onClick={onRotate}
          disabled={disabled}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-800 text-white rounded text-sm transition-colors"
        >
          ↻ Rotește
        </button>
        <button
          onClick={onHardDrop}
          disabled={disabled}
          className="px-4 py-2 bg-red-600 hover:bg-red-500 disabled:bg-slate-800 text-white rounded text-sm transition-colors"
        >
          ⚡ Drop
        </button>
      </div>
    </div>
  );
}