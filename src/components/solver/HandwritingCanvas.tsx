/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Digital Handwriting Canvas for EduBridge
 * Allows users to write math equations, formulas, diagrams, and questions
 * using computer mouse, touchpad, touchscreen, or digital stylus.
 */

import React, { useRef, useState, useEffect } from 'react';
import {
  PenTool,
  Eraser,
  RotateCcw,
  Trash2,
  Sparkles,
  CheckCircle2,
  HelpCircle
} from 'lucide-react';

interface HandwritingCanvasProps {
  onCaptureHandwriting: (dataUrl: string) => void;
  isProcessing?: boolean;
}

interface StrokePoint {
  x: number;
  y: number;
}

interface Stroke {
  points: StrokePoint[];
  color: string;
  width: number;
  isEraser: boolean;
}

export const HandwritingCanvas: React.FC<HandwritingCanvasProps> = ({
  onCaptureHandwriting,
  isProcessing = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const [currentStroke, setCurrentStroke] = useState<Stroke | null>(null);
  const [penColor, setPenColor] = useState<string>('#1e293b');
  const [penWidth, setPenWidth] = useState<number>(3.5);
  const [isEraser, setIsEraser] = useState<boolean>(false);
  const [hasContent, setHasContent] = useState<boolean>(false);

  // Setup canvas with high DPI backing store for sharp lines
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    redrawCanvas();
  }, []);

  const redrawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const width = canvas.width / dpr;
    const height = canvas.height / dpr;

    ctx.clearRect(0, 0, width, height);

    // Draw lined notebook grid background for natural handwriting
    ctx.strokeStyle = '#f1f5f9';
    ctx.lineWidth = 1;
    const lineSpacing = 32;
    for (let y = lineSpacing; y < height; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Render all saved strokes
    const allStrokes = currentStroke ? [...strokes, currentStroke] : strokes;

    allStrokes.forEach((stroke) => {
      if (stroke.points.length < 2) return;

      ctx.beginPath();
      ctx.strokeStyle = stroke.isEraser ? '#ffffff' : stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      for (let i = 1; i < stroke.points.length; i++) {
        const p1 = stroke.points[i - 1];
        const p2 = stroke.points[i];
        const midX = (p1.x + p2.x) / 2;
        const midY = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, midX, midY);
      }
      ctx.stroke();
    });
  };

  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>): StrokePoint => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    const point = getCanvasCoords(e);
    const newStroke: Stroke = {
      points: [point],
      color: penColor,
      width: isEraser ? penWidth * 3 : penWidth,
      isEraser
    };
    setCurrentStroke(newStroke);
    setHasContent(true);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!currentStroke) return;
    const point = getCanvasCoords(e);
    const updated = {
      ...currentStroke,
      points: [...currentStroke.points, point]
    };
    setCurrentStroke(updated);

    // Live redraw
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (updated.points.length > 1) {
      const p1 = updated.points[updated.points.length - 2];
      const p2 = updated.points[updated.points.length - 1];
      ctx.beginPath();
      ctx.strokeStyle = updated.isEraser ? '#ffffff' : updated.color;
      ctx.lineWidth = updated.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.moveTo(p1.x, p1.y);
      ctx.lineTo(p2.x, p2.y);
      ctx.stroke();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    if (currentStroke && currentStroke.points.length > 0) {
      setStrokes((prev) => [...prev, currentStroke]);
    }
    setCurrentStroke(null);
  };

  const handleUndo = () => {
    setStrokes((prev) => {
      const next = prev.slice(0, -1);
      setHasContent(next.length > 0);
      return next;
    });
    setTimeout(redrawCanvas, 10);
  };

  const handleClear = () => {
    setStrokes([]);
    setCurrentStroke(null);
    setHasContent(false);
    setTimeout(redrawCanvas, 10);
  };

  const handleRecognize = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasContent) return;
    const dataUrl = canvas.toDataURL('image/png');
    onCaptureHandwriting(dataUrl);
  };

  return (
    <div className="flex flex-col rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-xs">
      
      {/* Canvas Toolbar Controls */}
      <div className="p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Pen / Eraser Mode */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setIsEraser(false)}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              !isEraser
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <PenTool className="w-3.5 h-3.5" />
            <span>Digital Pen</span>
          </button>

          <button
            type="button"
            onClick={() => setIsEraser(true)}
            className={`px-3 py-1.5 rounded-lg font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
              isEraser
                ? 'bg-indigo-600 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            <Eraser className="w-3.5 h-3.5" />
            <span>Eraser</span>
          </button>
        </div>

        {/* Color Palette (when pen active) */}
        {!isEraser && (
          <div className="flex items-center gap-1.5">
            {[
              { color: '#1e293b', label: 'Dark Slate' },
              { color: '#4338ca', label: 'Indigo' },
              { color: '#047857', label: 'Emerald' },
              { color: '#b91c1c', label: 'Crimson' }
            ].map((c) => (
              <button
                key={c.color}
                type="button"
                onClick={() => setPenColor(c.color)}
                style={{ backgroundColor: c.color }}
                title={c.label}
                className={`w-5 h-5 rounded-full cursor-pointer transition-transform ${
                  penColor === c.color ? 'ring-2 ring-offset-2 ring-indigo-500 scale-110' : 'opacity-80 hover:opacity-100'
                }`}
              />
            ))}
          </div>
        )}

        {/* Stroke Thickness */}
        <div className="flex items-center gap-1">
          <span className="text-[11px] text-slate-400 font-bold mr-1">Stroke:</span>
          {[
            { width: 2, label: 'Fine' },
            { width: 3.5, label: 'Medium' },
            { width: 6, label: 'Bold' }
          ].map((w) => (
            <button
              key={w.width}
              type="button"
              onClick={() => setPenWidth(w.width)}
              className={`px-2 py-1 rounded-md text-[11px] font-bold cursor-pointer ${
                penWidth === w.width
                  ? 'bg-slate-800 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {w.label}
            </button>
          ))}
        </div>

        {/* Actions: Undo, Clear, Recognize */}
        <div className="flex items-center gap-1.5 ml-auto">
          <button
            type="button"
            onClick={handleUndo}
            disabled={strokes.length === 0}
            className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-600 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Undo stroke"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleClear}
            disabled={!hasContent}
            className="p-1.5 bg-white border border-slate-200 rounded-lg text-rose-600 hover:bg-rose-50 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            title="Clear canvas"
          >
            <Trash2 className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={handleRecognize}
            disabled={!hasContent || isProcessing}
            className="px-3.5 py-1.5 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-extrabold rounded-lg shadow-sm flex items-center gap-1.5 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Recognizing...' : 'Recognize & Convert'}</span>
          </button>
        </div>

      </div>

      {/* Interactive Drawing Canvas */}
      <div className="relative w-full h-64 sm:h-80 bg-white cursor-crosshair touch-none select-none">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="w-full h-full block"
        />

        {/* Helpful Watermark / Instruction when empty */}
        {!hasContent && (
          <div className="absolute inset-0 pointer-events-none flex flex-col items-center justify-center text-slate-400 p-4 text-center">
            <PenTool className="w-8 h-8 text-slate-300 mb-2 animate-bounce" />
            <p className="font-extrabold text-sm text-slate-500">
              Draw equations, scientific symbols, or write questions here
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              Use your computer mouse, laptop touchpad, touchscreen, or digital stylus as a digital pen.
            </p>
          </div>
        )}
      </div>

      {/* Bottom Canvas Advice */}
      <div className="p-2.5 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 px-4">
        <span className="flex items-center gap-1 font-medium">
          <HelpCircle className="w-3.5 h-3.5 text-indigo-500" />
          Supports fractions, radicals (√), powers (x²), chemical notation, and diagrams.
        </span>
        <span className="hidden sm:inline text-slate-400 font-semibold">
          High precision OCR engine ready
        </span>
      </div>

    </div>
  );
};

