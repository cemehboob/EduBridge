/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 * 
 * Formula Toolbar for EduBridge AI Question Solver
 * Provides quick one-click insertion of mathematical symbols, operators,
 * scientific notation, and chemical formulas.
 */

import React from 'react';

interface FormulaToolbarProps {
  onInsertSymbol: (symbol: string) => void;
  className?: string;
}

export const FormulaToolbar: React.FC<FormulaToolbarProps> = ({ onInsertSymbol, className = '' }) => {
  const mathSymbols = [
    { label: 'x²', insert: 'x²' },
    { label: 'x³', insert: 'x³' },
    { label: 'xⁿ', insert: '^' },
    { label: '√x', insert: '√(' },
    { label: 'a/b', insert: ' / ' },
    { label: 'π', insert: 'π' },
    { label: 'θ', insert: 'θ' },
    { label: '±', insert: '±' },
    { label: '≤', insert: '≤' },
    { label: '≥', insert: '≥' },
    { label: '≠', insert: '≠' },
    { label: '≈', insert: '≈' },
    { label: '∑', insert: '∑' },
    { label: '∫', insert: '∫' },
    { label: 'Δ', insert: 'Δ' },
    { label: '∞', insert: '∞' }
  ];

  const scienceSymbols = [
    { label: 'H₂O', insert: 'H₂O' },
    { label: 'CO₂', insert: 'CO₂' },
    { label: 'O₂', insert: 'O₂' },
    { label: '→', insert: ' → ' },
    { label: '⇌', insert: ' ⇌ ' },
    { label: 'α', insert: 'α' },
    { label: 'β', insert: 'β' },
    { label: 'λ', insert: 'λ' },
    { label: 'μ', insert: 'μ' },
    { label: 'Ω', insert: 'Ω' }
  ];

  return (
    <div className={`p-2.5 bg-slate-50 border-t border-b border-slate-200/90 flex flex-wrap items-center gap-1.5 text-xs ${className}`}>
      <span className="text-[11px] font-black uppercase text-slate-400 mr-1 shrink-0">
        Quick Palette:
      </span>

      {/* Math Operators */}
      <div className="flex flex-wrap items-center gap-1">
        {mathSymbols.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onInsertSymbol(item.insert)}
            className="px-2 py-1 bg-white hover:bg-indigo-50 hover:text-indigo-700 hover:border-indigo-300 text-slate-700 font-bold rounded-md border border-slate-200 transition-colors shadow-2xs cursor-pointer active:scale-95"
            title={`Insert ${item.label}`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <div className="h-4 w-px bg-slate-300 mx-1 shrink-0 hidden sm:block" />

      {/* Science & Chemical */}
      <div className="flex flex-wrap items-center gap-1">
        {scienceSymbols.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={() => onInsertSymbol(item.insert)}
            className="px-2 py-1 bg-white hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 text-slate-700 font-bold rounded-md border border-slate-200 transition-colors shadow-2xs cursor-pointer active:scale-95"
            title={`Insert ${item.label}`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
};
