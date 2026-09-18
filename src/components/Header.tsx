import React from 'react';
import { ShieldCheck, Moon, Sun, Info, Terminal } from 'lucide-react';

interface HeaderProps {
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onOpenAbout: () => void;
}

export const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme, onOpenAbout }) => {
  return (
    <header className="w-full border-b border-slate-800/80 bg-slate-900/60 backdrop-blur-md sticky top-0 z-30 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand & Subtitle */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 text-white font-mono font-bold text-lg tracking-wider border border-cyan-400/30">
            <Terminal className="w-5 h-5 text-cyan-100" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-1.5">
                Cipher<span className="text-cyan-400">Lab</span>
              </h1>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-mono">
                <ShieldCheck className="w-3 h-3 text-cyan-400" /> Client-Side
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-400 font-medium">
              Convierte texto en diferentes códigos y cifrados
            </p>
          </div>
        </div>

        {/* Actions: Theme Toggle & About */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            id="btn-about"
            type="button"
            onClick={onOpenAbout}
            aria-label="Información acerca de CipherLab"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
          >
            <Info className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Acerca de</span>
          </button>

          <button
            id="btn-theme-toggle"
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700/60 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-cyan-500"
            title={theme === 'dark' ? 'Activar tema claro' : 'Activar tema oscuro'}
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="w-4 h-4 text-cyan-400 transition-transform hover:-rotate-12" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
