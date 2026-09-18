import React from 'react';
import { Sliders, Key, Hash, Split, AlertCircle } from 'lucide-react';
import { CipherOptions } from '../types/cipher';

interface CipherOptionsProps {
  methodId: string;
  options: CipherOptions;
  onChangeOptions: (newOptions: CipherOptions) => void;
}

export const CipherOptionsPanel: React.FC<CipherOptionsProps> = ({
  methodId,
  options,
  onChangeOptions,
}) => {
  if (!['caesar', 'vigenere', 'morse', 'hex', 'binary', 'octal'].includes(methodId)) {
    return null;
  }

  const update = (partial: Partial<CipherOptions>) => {
    onChangeOptions({ ...options, ...partial });
  };

  return (
    <div
      id="panel-cipher-options"
      className="bg-slate-900/60 rounded-xl border border-cyan-900/40 p-4 shadow-inner mb-4 transition-all"
    >
      <div className="flex items-center gap-2 mb-3">
        <Sliders className="w-4 h-4 text-cyan-400" />
        <h3 className="text-xs font-bold uppercase tracking-wider text-cyan-300">
          Parámetros del método
        </h3>
      </div>

      {/* --- CÉSAR OPTIONS --- */}
      {methodId === 'caesar' && (
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label htmlFor="caesar-shift" className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-cyan-400" /> Desplazamiento:
            </label>
            <div className="flex items-center gap-1 bg-slate-950 border border-slate-700 rounded-lg p-1">
              <button
                type="button"
                onClick={() => update({ caesarShift: options.caesarShift - 1 })}
                className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center"
                title="Restar 1 al desplazamiento"
              >
                -
              </button>
              <input
                id="caesar-shift"
                type="number"
                value={options.caesarShift}
                onChange={(e) => update({ caesarShift: parseInt(e.target.value, 10) || 0 })}
                className="w-14 text-center bg-transparent text-slate-100 font-mono text-sm font-semibold focus:outline-none"
              />
              <button
                type="button"
                onClick={() => update({ caesarShift: options.caesarShift + 1 })}
                className="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-colors cursor-pointer flex items-center justify-center"
                title="Sumar 1 al desplazamiento"
              >
                +
              </button>
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">Preajustes:</span>
            {[1, 3, 5, 13, -3].map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => update({ caesarShift: val })}
                className={`px-2 py-0.5 rounded text-xs font-mono transition-colors cursor-pointer ${
                  options.caesarShift === val
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {val > 0 ? `+${val}` : val}
              </button>
            ))}
          </div>
          <span className="text-[11px] text-slate-400 ml-auto">
            (Acepta valores positivos y negativos)
          </span>
        </div>
      )}

      {/* --- VIGENÈRE OPTIONS --- */}
      {methodId === 'vigenere' && (
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <label
              htmlFor="vigenere-key"
              className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5"
            >
              <Key className="w-3.5 h-3.5 text-cyan-400" /> Clave de cifrado (palabra o frase):
            </label>
            <div className="relative">
              <input
                id="vigenere-key"
                type="text"
                value={options.vigenereKey}
                onChange={(e) => update({ vigenereKey: e.target.value })}
                placeholder="Ejemplo: CLAVE, CIPHER, SECRETO"
                className="w-full bg-slate-950 border border-slate-700 rounded-lg px-3 py-1.5 text-sm font-mono text-cyan-200 uppercase placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500"
              />
            </div>
          </div>

          {/* Key validation check */}
          <div className="text-xs">
            {!options.vigenereKey.trim() ? (
              <span className="text-amber-400 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" /> Clave requerida
              </span>
            ) : (
              <span className="text-slate-400 font-mono">
                Longitud útil: <strong className="text-cyan-300">{options.vigenereKey.replace(/[^a-zA-Z]/g, '').length}</strong> letras
              </span>
            )}
          </div>
        </div>
      )}

      {/* --- MORSE OPTIONS --- */}
      {methodId === 'morse' && (
        <div className="flex flex-wrap items-center gap-4 text-xs">
          <label className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Split className="w-3.5 h-3.5 text-cyan-400" /> Separador entre palabras:
          </label>
          <div className="flex items-center gap-2">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="radio"
                name="morseSeparator"
                checked={options.morseSlashSeparator}
                onChange={() => update({ morseSlashSeparator: true })}
                className="text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700"
              />
              <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300">/</span> (Barra inclinada tradicional)
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 ml-3">
              <input
                type="radio"
                name="morseSeparator"
                checked={!options.morseSlashSeparator}
                onChange={() => update({ morseSlashSeparator: false })}
                className="text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700"
              />
              <span className="font-mono bg-slate-800 px-1.5 py-0.5 rounded text-cyan-300">[espacios]</span> (Triple espacio)
            </label>
          </div>
        </div>
      )}

      {/* --- HEX / BINARY / OCTAL SPACING OPTIONS --- */}
      {['hex', 'binary', 'octal'].includes(methodId) && (
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Split className="w-3.5 h-3.5 text-cyan-400" /> Formato de delimitación:
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="radio"
                name="byteSpacing"
                checked={options.byteSpacing}
                onChange={() => update({ byteSpacing: true })}
                className="text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700"
              />
              <span>Separado por espacios (Recomendado)</span>
            </label>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-300">
              <input
                type="radio"
                name="byteSpacing"
                checked={!options.byteSpacing}
                onChange={() => update({ byteSpacing: false })}
                className="text-cyan-500 focus:ring-cyan-500 bg-slate-950 border-slate-700"
              />
              <span>Continuo (sin espacios)</span>
            </label>
          </div>
        </div>
      )}
    </div>
  );
};
