import React, { useState } from 'react';
import {
  Copy,
  Check,
  Download,
  ArrowUpDown,
  AlertTriangle,
  Info,
  Layers,
} from 'lucide-react';
import { ConversionResult } from '../types/cipher';
import { copyToClipboard } from '../utils/clipboard';
import { downloadTextFile } from '../utils/download';

interface ResultPanelProps {
  result: ConversionResult;
  methodName: string;
  onSwapWithInput: () => void;
  canSwap: boolean;
}

export const ResultPanel: React.FC<ResultPanelProps> = ({
  result,
  methodName,
  onSwapWithInput,
  canSwap,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result.result) return;
    const success = await copyToClipboard(result.result);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  const handleDownload = () => {
    if (!result.result) return;
    const cleanMethodName = methodName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    const timestamp = new Date().toISOString().slice(0, 10);
    downloadTextFile(result.result, `cipherlab-${cleanMethodName}-${timestamp}.txt`);
  };

  const outputLength = result.result.length;

  return (
    <div
      id="card-result-panel"
      className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm transition-all"
    >
      {/* Top highlight bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 opacity-70" />

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-purple-400" />
          <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
            Resultado
          </h2>
          {copied && (
            <span
              id="toast-copied-feedback"
              className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-950/90 text-emerald-300 border border-emerald-700/60 animate-in fade-in duration-200"
            >
              <Check className="w-3.5 h-3.5 text-emerald-400" /> ✓ Copiado al portapapeles
            </span>
          )}
        </div>

        {/* Action buttons: Copiar, Descargar, Intercambiar */}
        <div className="flex items-center gap-2">
          <button
            id="btn-swap-result"
            type="button"
            onClick={onSwapWithInput}
            disabled={!canSwap}
            aria-label="Intercambiar resultado al campo de entrada"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-200 bg-cyan-950/40 hover:bg-cyan-900/50 border border-cyan-800/60 hover:border-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
            title="Usar este resultado como nuevo texto de entrada"
          >
            <ArrowUpDown className="w-3.5 h-3.5 text-cyan-400" />
            <span>Intercambiar</span>
          </button>

          <button
            id="btn-download-result"
            type="button"
            onClick={handleDownload}
            disabled={!result.result}
            aria-label="Descargar resultado como archivo de texto"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <Download className="w-3.5 h-3.5 text-slate-300" />
            <span>Descargar</span>
          </button>

          <button
            id="btn-copy-result"
            type="button"
            onClick={handleCopy}
            disabled={!result.result}
            aria-label="Copiar resultado al portapapeles"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 disabled:from-slate-800 disabled:to-slate-800 disabled:text-slate-500 disabled:cursor-not-allowed shadow-md shadow-cyan-950/40 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-400"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-200" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Large Read-Only Area */}
      <div className="relative">
        <label htmlFor="result-text-area" className="sr-only">
          Texto resultante de la conversión
        </label>
        <textarea
          id="result-text-area"
          readOnly
          rows={6}
          value={result.result}
          placeholder="El resultado aparecerá aquí automáticamente..."
          className="w-full bg-slate-950/70 text-cyan-200 placeholder-slate-600 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-sm sm:text-base font-mono leading-relaxed focus:outline-none focus:border-purple-500/60 focus:ring-2 focus:ring-purple-500/20 transition-all resize-y min-h-[140px] select-all cursor-text"
        />
      </div>

      {/* Error / Warning Notice if any */}
      {result.error && (
        <div
          id="alert-error-result"
          className="mt-3 p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-200 text-xs sm:text-sm flex items-start gap-2.5 animate-in fade-in duration-200"
        >
          <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <strong className="font-semibold block text-rose-300 mb-0.5">Error de conversión:</strong>
            <p className="leading-relaxed">{result.error}</p>
          </div>
        </div>
      )}

      {/* Info notice if any */}
      {result.info && !result.error && (
        <div
          id="alert-info-result"
          className="mt-3 p-3 rounded-xl bg-cyan-950/30 border border-cyan-800/40 text-cyan-200 text-xs flex items-start gap-2"
        >
          <Info className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
          <p className="leading-relaxed">{result.info}</p>
        </div>
      )}

      {/* Bottom stats */}
      <div className="mt-3.5 flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
        <span id="stat-result-chars">
          <strong className="text-slate-200 font-semibold">{outputLength}</strong> caracteres generados
        </span>
        <span className="text-[11px] text-slate-500">Actualización en tiempo real</span>
      </div>
    </div>
  );
};
