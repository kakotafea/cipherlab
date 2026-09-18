import React, { useState } from 'react';
import { ClipboardPaste, Trash2, Sparkles, Check, FileText } from 'lucide-react';
import { stringToUtf8Bytes } from '../utils/encoding';

interface TextInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

const PRESET_EXAMPLES = [
  { label: 'Hola mundo', value: 'Hola mundo' },
  { label: 'Hello World', value: 'Hello World' },
  { label: 'SOS', value: 'SOS' },
  { label: 'CipherLab 2026', value: 'CipherLab 2026' },
];

export const TextInput: React.FC<TextInputProps> = ({ value, onChange, onClear }) => {
  const [pasteSuccess, setPasteSuccess] = useState(false);

  const charCount = value.length;
  const wordCount = value.trim() ? value.trim().split(/\s+/).length : 0;
  const byteCount = stringToUtf8Bytes(value).byteLength;

  const handlePaste = async () => {
    try {
      if (navigator?.clipboard?.readText) {
        const text = await navigator.clipboard.readText();
        if (text) {
          onChange(text);
          setPasteSuccess(true);
          setTimeout(() => setPasteSuccess(false), 2000);
        }
      }
    } catch {
      // If clipboard permission is denied or restricted
    }
  };

  return (
    <div
      id="card-input-panel"
      className="bg-slate-900/80 rounded-2xl border border-slate-800 p-5 sm:p-6 shadow-xl relative overflow-hidden backdrop-blur-sm transition-all"
    >
      {/* Glow highlight */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-indigo-500 to-transparent opacity-70" />

      {/* Card Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-cyan-400" />
          <h2 className="text-base sm:text-lg font-bold text-slate-100 tracking-tight">
            Texto de entrada
          </h2>
        </div>

        {/* Action buttons: Pegar, Limpiar */}
        <div className="flex items-center gap-2">
          <button
            id="btn-paste-input"
            type="button"
            onClick={handlePaste}
            aria-label="Pegar contenido del portapapeles"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-200 bg-slate-800 hover:bg-slate-700/80 border border-slate-700 hover:border-slate-600 active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            {pasteSuccess ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span className="text-emerald-400">¡Pegado!</span>
              </>
            ) : (
              <>
                <ClipboardPaste className="w-3.5 h-3.5 text-cyan-400" />
                <span>Pegar</span>
              </>
            )}
          </button>

          <button
            id="btn-clear-input"
            type="button"
            onClick={onClear}
            disabled={!value}
            aria-label="Limpiar texto de entrada"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 bg-rose-950/30 hover:bg-rose-900/40 border border-rose-900/40 hover:border-rose-800 disabled:opacity-40 disabled:cursor-not-allowed active:scale-95 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Limpiar</span>
          </button>
        </div>
      </div>

      {/* Large Textarea */}
      <div className="relative">
        <label htmlFor="input-text-area" className="sr-only">
          Texto de entrada para convertir o descifrar
        </label>
        <textarea
          id="input-text-area"
          rows={6}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Escribe o pega aquí el texto a transformar..."
          className="w-full bg-slate-950/70 text-slate-100 placeholder-slate-500 border border-slate-800 rounded-xl p-3.5 sm:p-4 text-sm sm:text-base font-mono leading-relaxed focus:outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all resize-y min-h-[140px]"
          spellCheck={false}
        />
      </div>

      {/* Bottom stats & Quick examples */}
      <div className="mt-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400 pt-2 border-t border-slate-800/80">
        {/* Metric indicators */}
        <div className="flex items-center gap-4 font-mono">
          <span id="stat-chars">
            <strong className="text-slate-200 font-semibold">{charCount}</strong> caracteres
          </span>
          <span className="text-slate-700">•</span>
          <span id="stat-words">
            <strong className="text-slate-200 font-semibold">{wordCount}</strong> palabras
          </span>
          <span className="text-slate-700">•</span>
          <span id="stat-bytes">
            <strong className="text-slate-200 font-semibold">{byteCount}</strong> bytes UTF-8
          </span>
        </div>

        {/* Preset quick examples */}
        <div className="flex items-center flex-wrap gap-1.5">
          <span className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-slate-500 font-bold mr-1">
            <Sparkles className="w-3 h-3 text-cyan-400" /> Ejemplos:
          </span>
          {PRESET_EXAMPLES.map((ex) => (
            <button
              key={ex.label}
              type="button"
              onClick={() => onChange(ex.value)}
              className="px-2.5 py-1 rounded-md bg-slate-800/70 hover:bg-cyan-950/60 text-slate-300 hover:text-cyan-300 border border-slate-700/60 hover:border-cyan-700/60 text-xs font-mono transition-colors cursor-pointer"
            >
              {ex.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
