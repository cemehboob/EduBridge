/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Advanced AI Math Keypad & Formula Toolbar for EduBridge
 * Inspired by Symbolab, Mathway, Photomath, and Wolfram Alpha.
 * 
 * Features:
 * - Category Tabs: Algebra, Calculus, Trigonometry, Matrices, Chemistry/Science, Quick Solvers
 * - One-click operator insertion
 * - Instant problem scaffolding
 */

import React, { useState } from 'react';
import {
  Calculator,
  Sigma,
  Pi,
  Layers,
  Sparkles,
  FunctionSquare
} from 'lucide-react';

interface FormulaToolbarProps {
  onInsertSymbol: (symbol: string) => void;
  className?: string;
}

type KeypadTab = 'algebra' | 'calculus' | 'trig' | 'matrices' | 'science' | 'wolfram';

export const FormulaToolbar: React.FC<FormulaToolbarProps> = ({ onInsertSymbol, className = '' }) => {
  const [activeTab, setActiveTab] = useState<KeypadTab>('algebra');

  const algebraSymbols = [
    { label: 'x²', insert: 'x²' },
    { label: 'x³', insert: 'x³' },
    { label: 'xⁿ', insert: '^' },
    { label: '√x', insert: '√(' },
    { label: '∛x', insert: '∛(' },
    { label: 'a/b', insert: ' / ' },
    { label: '±', insert: '±' },
    { label: '|x|', insert: '|x|' },
    { label: '(', insert: '(' },
    { label: ')', insert: ')' },
    { label: '=', insert: ' = ' },
    { label: '≠', insert: ' ≠ ' },
    { label: '≤', insert: ' ≤ ' },
    { label: '≥', insert: ' ≥ ' },
    { label: '≈', insert: ' ≈ ' },
    { label: 'x', insert: 'x' },
    { label: 'y', insert: 'y' }
  ];

  const calculusSymbols = [
    { label: 'd/dx', insert: 'd/dx (' },
    { label: 'd²/dx²', insert: 'd²/dx² (' },
    { label: '∫ dx', insert: '∫ (' },
    { label: '∫_a^b', insert: '∫_0^1 (' },
    { label: 'lim_{x→0}', insert: 'lim_{x->0} (' },
    { label: 'lim_{x→∞}', insert: 'lim_{x->∞} (' },
    { label: '∑', insert: '∑' },
    { label: '∂/∂x', insert: '∂/∂x' },
    { label: '∞', insert: '∞' },
    { label: 'eˣ', insert: 'e^' },
    { label: 'ln(x)', insert: 'ln(' },
    { label: 'dx', insert: ' dx' }
  ];

  const trigSymbols = [
    { label: 'sin', insert: 'sin(' },
    { label: 'cos', insert: 'cos(' },
    { label: 'tan', insert: 'tan(' },
    { label: 'csc', insert: 'csc(' },
    { label: 'sec', insert: 'sec(' },
    { label: 'cot', insert: 'cot(' },
    { label: 'sin⁻¹', insert: 'arcsin(' },
    { label: 'cos⁻¹', insert: 'arccos(' },
    { label: 'tan⁻¹', insert: 'arctan(' },
    { label: 'π', insert: 'π' },
    { label: 'θ', insert: 'θ' },
    { label: '°', insert: '°' }
  ];

  const matrixSymbols = [
    { label: '2×2 Det', insert: 'det([[1, 2], [3, 4]])' },
    { label: '2×2 Matrix', insert: '[[a, b], [c, d]]' },
    { label: 'Inverse A⁻¹', insert: 'inverse([[2, 1], [1, 2]])' },
    { label: 'System (2 eq)', insert: '2x + y = 7, x - y = 2' },
    { label: '[ ]', insert: '[ ]' },
    { label: 'det(A)', insert: 'det(A)' }
  ];

  const scienceSymbols = [
    { label: 'H₂O', insert: 'H₂O' },
    { label: 'CO₂', insert: 'CO₂' },
    { label: 'O₂', insert: 'O₂' },
    { label: 'H₂', insert: 'H₂' },
    { label: '→', insert: ' → ' },
    { label: '⇌', insert: ' ⇌ ' },
    { label: 'Δ', insert: 'Δ' },
    { label: 'α', insert: 'α' },
    { label: 'β', insert: 'β' },
    { label: 'λ', insert: 'λ' },
    { label: 'μ', insert: 'μ' },
    { label: 'Ω', insert: 'Ω' }
  ];

  const wolframTemplates = [
    { label: 'Solve Quad', insert: '2x^2 - 8 = 0' },
    { label: 'Derivative', insert: 'derivative of x^3 - 5x + 4' },
    { label: 'Integral', insert: 'integral of 3x^2 + 2x - 5 dx' },
    { label: 'Factor', insert: 'factor x^2 - 16' },
    { label: 'Trig Val', insert: 'sin(30)' },
    { label: 'Fractions', insert: '3/4 + 2/5' },
    { label: 'Matrix Det', insert: 'det([[2, 5], [1, 3]])' },
    { label: 'System', insert: '2x + y = 7, x - y = 2' }
  ];

  const tabs: { id: KeypadTab; label: string; icon: React.ReactNode }[] = [
    { id: 'algebra', label: 'Algebra', icon: <FunctionSquare className="w-3 h-3" /> },
    { id: 'calculus', label: 'Calculus', icon: <Sigma className="w-3 h-3" /> },
    { id: 'trig', label: 'Trig', icon: <Pi className="w-3 h-3" /> },
    { id: 'matrices', label: 'Matrices', icon: <Layers className="w-3 h-3" /> },
    { id: 'science', label: 'Science', icon: <Calculator className="w-3 h-3" /> },
    { id: 'wolfram', label: 'Quick Solvers', icon: <Sparkles className="w-3 h-3 text-amber-500" /> }
  ];

  return (
    <div className={`bg-slate-50 border-t border-b border-slate-200/90 text-xs ${className}`}>
      {/* Category Tabs (Symbolab & Mathway Style) */}
      <div className="flex items-center gap-1 px-3 pt-2 overflow-x-auto border-b border-slate-200/60 scrollbar-none">
        <span className="text-[10px] font-black uppercase text-slate-400 mr-1.5 shrink-0">
          Math Keypad:
        </span>
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveTab(t.id)}
            className={`px-2.5 py-1 rounded-t-lg font-bold text-[11px] transition-all flex items-center gap-1 cursor-pointer shrink-0 border-t border-l border-r ${
              activeTab === t.id
                ? 'bg-white text-indigo-700 border-slate-200 shadow-2xs'
                : 'bg-transparent text-slate-500 border-transparent hover:text-slate-800'
            }`}
          >
            {t.icon}
            <span>{t.label}</span>
          </button>
        ))}
      </div>

      {/* Symbol Buttons Bar */}
      <div className="p-2.5 bg-white/60 flex flex-wrap items-center gap-1.5">
        {activeTab === 'algebra' &&
          algebraSymbols.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onInsertSymbol(item.insert)}
              className="px-2 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 font-bold rounded-md border border-slate-200 transition-colors shadow-2xs cursor-pointer active:scale-95 text-xs font-mono"
              title={`Insert ${item.label}`}
            >
              {item.label}
            </button>
          ))}

        {activeTab === 'calculus' &&
          calculusSymbols.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onInsertSymbol(item.insert)}
              className="px-2.5 py-1 bg-white hover:bg-purple-50 hover:text-purple-700 hover:border-purple-300 text-slate-700 font-bold rounded-md border border-slate-200 transition-colors shadow-2xs cursor-pointer active:scale-95 text-xs font-mono"
              title={`Insert ${item.label}`}
            >
              {item.label}
            </button>
          ))}

        {activeTab === 'trig' &&
          trigSymbols.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onInsertSymbol(item.insert)}
              className="px-2.5 py-1 bg-white hover:bg-cyan-50 hover:text-cyan-700 hover:border-cyan-300 text-slate-700 font-bold rounded-md border border-slate-200 transition-colors shadow-2xs cursor-pointer active:scale-95 text-xs font-mono"
              title={`Insert ${item.label}`}
            >
              {item.label}
            </button>
          ))}

        {activeTab === 'matrices' &&
          matrixSymbols.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onInsertSymbol(item.insert)}
              className="px-2.5 py-1 bg-white hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 font-bold rounded-md border border-slate-200 transition-colors shadow-2xs cursor-pointer active:scale-95 text-xs font-mono"
              title={`Insert ${item.label}`}
            >
              {item.label}
            </button>
          ))}

        {activeTab === 'science' &&
          scienceSymbols.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onInsertSymbol(item.insert)}
              className="px-2 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-700 font-bold rounded-md border border-slate-200 transition-colors shadow-2xs cursor-pointer active:scale-95 text-xs font-mono"
              title={`Insert ${item.label}`}
            >
              {item.label}
            </button>
          ))}

        {activeTab === 'wolfram' &&
          wolframTemplates.map((item) => (
            <button
              key={item.label}
              type="button"
              onClick={() => onInsertSymbol(item.insert)}
              className="px-2.5 py-1 bg-amber-50/80 hover:bg-amber-100 text-amber-900 border-amber-300 font-bold rounded-md border transition-colors shadow-2xs cursor-pointer active:scale-95 text-xs flex items-center gap-1"
              title={`Load ${item.label} template`}
            >
              <Sparkles className="w-3 h-3 text-amber-600" />
              <span>{item.label}</span>
            </button>
          ))}
      </div>
    </div>
  );
};
