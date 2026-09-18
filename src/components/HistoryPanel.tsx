import React, { useState } from 'react';
import {
  History,
  Trash2,
  RotateCcw,
  Clock,
  ArrowRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { HistoryItem } from '../types/cipher';

interface HistoryPanelProps {
  history: HistoryItem[];
  onReuseItem: (item: HistoryItem) => void;
  onDeleteItem: (id: string) => void;
  onClearHistory: () => void;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  history,
  onReuseItem,
  onDeleteItem,
  onClearHistory,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  const formatTime = (timestamp: number) => {
    try {
      const d = new Date(timestamp);
      return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div
      id="section-history"
      className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl backdrop-blur-sm transition-all"
    >
      {/* Header with expand/collapse and Clear All */}
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 text-left cursor-pointer group focus:outline-none"
        >
          <History className="w-5 h-5 text-indigo-400 group-hover:text-indigo-300 transition-colors" />
          <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
            Historial de conversiones
          </h2>
          <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-slate-800 text-slate-300 border border-slate-700 font-mono">
            {history.length}
          </span>
          {isOpen ? (
            <ChevronUp className="w-4 h-4 text-slate-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-500" />
          )}
        </button>

        {history.length > 0 && isOpen && (
          <button
            id="btn-clear-all-history"
            type="button"
            onClick={onClearHistory}
            aria-label="Borrar todo el historial"
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-rose-300 hover:text-rose-200 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/40 transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Borrar historial</span>
          </button>
        )}
      </div>

      {/* Content */}
      {isOpen && (
        <div className="mt-4">
          {history.length === 0 ? (
            <div className="text-center py-8 px-4 rounded-xl border border-dashed border-slate-800 bg-slate-950/40 text-slate-400 text-xs sm:text-sm">
              <Clock className="w-8 h-8 text-slate-600 mx-auto mb-2 opacity-60" />
              <p className="font-medium text-slate-300">No hay conversiones en el historial aún</p>
              <p className="text-slate-500 mt-1">
                A medida que escribas o conviertas texto, se guardarán aquí automáticamente tus resultados.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
              {history.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-xl bg-slate-950/60 hover:bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider bg-indigo-950/80 text-indigo-300 border border-indigo-800/40">
                        {item.methodName}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                          item.direction === 'encode'
                            ? 'bg-cyan-950/60 text-cyan-300'
                            : 'bg-purple-950/60 text-purple-300'
                        }`}
                      >
                        {item.direction === 'encode' ? 'Codificación' : 'Decodificación'}
                      </span>
                      <span className="text-[11px] text-slate-500 font-mono flex items-center gap-1 ml-auto sm:ml-0">
                        <Clock className="w-3 h-3" /> {formatTime(item.timestamp)}
                      </span>
                    </div>

                    {/* Preview of input -> output */}
                    <div className="flex items-center gap-2 text-xs font-mono text-slate-300">
                      <span
                        className="truncate max-w-[140px] sm:max-w-[200px] text-slate-400 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                        title={item.input}
                      >
                        {item.input}
                      </span>
                      <ArrowRight className="w-3 h-3 text-slate-500 shrink-0" />
                      <span
                        className="truncate max-w-[140px] sm:max-w-[240px] text-cyan-300 bg-slate-900 px-2 py-0.5 rounded border border-slate-800"
                        title={item.output}
                      >
                        {item.output}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                    <button
                      type="button"
                      onClick={() => onReuseItem(item)}
                      aria-label="Reutilizar esta conversión"
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors cursor-pointer"
                      title="Cargar texto y método en el editor"
                    >
                      <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Reutilizar</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onDeleteItem(item.id)}
                      aria-label="Eliminar elemento del historial"
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/30 transition-colors cursor-pointer"
                      title="Eliminar registro"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
