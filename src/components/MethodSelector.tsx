import React from 'react';
import {
  Binary,
  KeyRound,
  Radio,
  ArrowRightLeft,
  Lock,
  Unlock,
} from 'lucide-react';
import { CipherMethod, ConversionDirection, MethodCategory } from '../types/cipher';
import { CIPHER_METHODS, CATEGORY_LABELS } from '../algorithms';

interface MethodSelectorProps {
  selectedMethodId: string;
  onSelectMethod: (methodId: string) => void;
  direction: ConversionDirection;
  onToggleDirection: () => void;
  activeCategory: MethodCategory | 'all';
  onSelectCategory: (category: MethodCategory | 'all') => void;
}

const CATEGORY_ICONS: Record<MethodCategory, React.ElementType> = {
  encoding: Binary,
  cipher: KeyRound,
  code: Radio,
};

export const MethodSelector: React.FC<MethodSelectorProps> = ({
  selectedMethodId,
  onSelectMethod,
  direction,
  onToggleDirection,
  activeCategory,
  onSelectCategory,
}) => {
  const currentMethod = CIPHER_METHODS.find((m) => m.id === selectedMethodId) || CIPHER_METHODS[0];

  const filteredMethods =
    activeCategory === 'all'
      ? CIPHER_METHODS
      : CIPHER_METHODS.filter((m) => m.category === activeCategory);

  const isEncode = direction === 'encode';

  return (
    <div
      id="section-method-selector"
      className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl backdrop-blur-sm transition-all"
    >
      {/* Top Header with Direction Switch */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
              Método de conversión
            </h2>
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-semibold bg-cyan-950/70 text-cyan-400 border border-cyan-800/40">
              {currentMethod.name}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            {isEncode
              ? currentMethod.encodeLabel || 'Texto → Formato codificado'
              : currentMethod.decodeLabel || 'Formato codificado → Texto original'}
          </p>
        </div>

        {/* Direction Switch Toggle Button */}
        <div className="flex items-center gap-2">
          <button
            id="btn-toggle-direction"
            type="button"
            onClick={onToggleDirection}
            className={`group relative flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold tracking-wide border transition-all cursor-pointer shadow-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 ${
              isEncode
                ? 'bg-gradient-to-r from-cyan-600/90 to-blue-600/90 hover:from-cyan-500 hover:to-blue-500 text-white border-cyan-400/40 shadow-cyan-500/10'
                : 'bg-gradient-to-r from-purple-600/90 to-indigo-600/90 hover:from-purple-500 hover:to-indigo-500 text-white border-purple-400/40 shadow-purple-500/10'
            }`}
          >
            {isEncode ? (
              <>
                <Lock className="w-4 h-4 text-cyan-200" />
                <span>Modo: <strong>Codificar</strong></span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 text-purple-200" />
                <span>Modo: <strong>Decodificar</strong></span>
              </>
            )}
            <span className="inline-flex items-center justify-center p-1 rounded-lg bg-black/20 group-hover:rotate-180 transition-transform duration-300">
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </span>
          </button>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-4 scrollbar-none">
        <button
          type="button"
          onClick={() => onSelectCategory('all')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            activeCategory === 'all'
              ? 'bg-slate-700 text-white shadow-sm border border-slate-600'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
          }`}
        >
          Todos ({CIPHER_METHODS.length})
        </button>

        {(['encoding', 'cipher', 'code'] as MethodCategory[]).map((cat) => {
          const Icon = CATEGORY_ICONS[cat];
          const count = CIPHER_METHODS.filter((m) => m.category === cat).length;
          const isSelected = activeCategory === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => onSelectCategory(cat)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-cyan-950/80 text-cyan-300 border border-cyan-700/70 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{CATEGORY_LABELS[cat].label}</span>
              <span className="text-[10px] opacity-70">({count})</span>
            </button>
          );
        })}
      </div>

      {/* Methods Grid / Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-2.5">
        {filteredMethods.map((method: CipherMethod) => {
          const isSelected = method.id === selectedMethodId;
          const Icon = CATEGORY_ICONS[method.category];

          return (
            <button
              key={method.id}
              id={`method-btn-${method.id}`}
              type="button"
              onClick={() => onSelectMethod(method.id)}
              className={`text-left p-3 rounded-xl border transition-all cursor-pointer relative overflow-hidden group focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ${
                isSelected
                  ? 'bg-gradient-to-br from-cyan-950/90 to-slate-900 border-cyan-500/70 ring-1 ring-cyan-500/40 shadow-lg shadow-cyan-950/50'
                  : 'bg-slate-950/50 hover:bg-slate-800/70 border-slate-800 hover:border-slate-700 text-slate-300'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <div className="flex items-center gap-1.5">
                  <Icon
                    className={`w-3.5 h-3.5 ${
                      isSelected ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'
                    } transition-colors`}
                  />
                  <span
                    className={`text-xs sm:text-sm font-bold tracking-tight ${
                      isSelected ? 'text-white' : 'text-slate-200 group-hover:text-white'
                    }`}
                  >
                    {method.name}
                  </span>
                </div>
                {method.badge && (
                  <span
                    className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider ${
                      isSelected
                        ? 'bg-cyan-500/20 text-cyan-300'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {method.badge}
                  </span>
                )}
              </div>

              <p className="text-[11px] text-slate-400 line-clamp-1 leading-snug">
                {method.description}
              </p>

              {/* Highlight line if selected */}
              {isSelected && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-cyan-400 to-indigo-500" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
