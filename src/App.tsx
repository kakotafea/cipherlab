/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Header } from './components/Header';
import { TextInput } from './components/TextInput';
import { MethodSelector } from './components/MethodSelector';
import { CipherOptionsPanel } from './components/CipherOptions';
import { ResultPanel } from './components/ResultPanel';
import { HistoryPanel } from './components/HistoryPanel';
import { AboutModal } from './components/AboutModal';
import {
  CipherOptions,
  ConversionDirection,
  HistoryItem,
  MethodCategory,
} from './types/cipher';
import { CIPHER_METHODS, getMethodById } from './algorithms';
import {
  loadHistory,
  saveHistoryItem,
  removeHistoryItem,
  clearAllHistory,
  loadThemePreference,
  saveThemePreference,
} from './utils/storage';

export default function App() {
  const [inputText, setInputText] = useState<string>('Hola mundo');
  const [selectedMethodId, setSelectedMethodId] = useState<string>('hex');
  const [direction, setDirection] = useState<ConversionDirection>('encode');
  const [activeCategory, setActiveCategory] = useState<MethodCategory | 'all'>('all');
  const [options, setOptions] = useState<CipherOptions>({
    caesarShift: 3,
    vigenereKey: 'CIPHER',
    morseSlashSeparator: true,
    byteSpacing: true,
  });
  const [history, setHistory] = useState<HistoryItem[]>(() => loadHistory());
  const [theme, setTheme] = useState<'dark' | 'light'>(() => loadThemePreference());
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);

  // Sync theme with HTML class attribute
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    saveThemePreference(theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  // Get active cipher method
  const currentMethod = useMemo(() => {
    return getMethodById(selectedMethodId);
  }, [selectedMethodId]);

  // Compute conversion result in real-time
  const conversionResult = useMemo(() => {
    if (!inputText) {
      return { success: true, result: '' };
    }

    if (direction === 'encode') {
      return currentMethod.encode(inputText, options);
    } else {
      return currentMethod.decode(inputText, options);
    }
  }, [inputText, currentMethod, direction, options]);

  // Debounced auto-save to history for meaningful conversion sessions
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    if (
      inputText.trim() &&
      conversionResult.success &&
      conversionResult.result.trim() &&
      inputText.trim() !== conversionResult.result.trim()
    ) {
      saveTimeoutRef.current = setTimeout(() => {
        const updated = saveHistoryItem({
          methodId: currentMethod.id,
          methodName: currentMethod.name,
          direction,
          input: inputText.trim(),
          output: conversionResult.result.trim(),
        });
        setHistory(updated);
      }, 1500);
    }

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [inputText, conversionResult, currentMethod, direction]);

  // Intercambiar: Put result into input & invert direction
  const handleSwap = () => {
    if (!conversionResult.result) return;
    setInputText(conversionResult.result);
    // Invert direction to decode if it was encode, or vice-versa
    setDirection((prev) => (prev === 'encode' ? 'decode' : 'encode'));
  };

  // Clear both input & result
  const handleClear = () => {
    setInputText('');
  };

  // Reuse history item
  const handleReuseHistory = (item: HistoryItem) => {
    setInputText(item.input);
    setSelectedMethodId(item.methodId);
    setDirection(item.direction);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeleteHistory = (id: string) => {
    const updated = removeHistoryItem(id);
    setHistory(updated);
  };

  const handleClearAllHistory = () => {
    clearAllHistory();
    setHistory([]);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-cyan-500/20 selection:text-cyan-200 transition-colors duration-300">
      {/* Background ambient decorative glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute top-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-cyan-600/10 blur-[120px]" />
        <div className="absolute top-[30%] right-[10%] w-[450px] h-[450px] rounded-full bg-indigo-600/10 blur-[140px]" />
        <div className="absolute bottom-[-10%] left-[30%] w-[500px] h-[500px] rounded-full bg-purple-600/10 blur-[130px]" />
      </div>

      {/* Header */}
      <Header
        theme={theme}
        onToggleTheme={toggleTheme}
        onOpenAbout={() => setIsAboutOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 z-10 space-y-6">
        {/* Method Selector Section */}
        <section aria-label="Selector de método de conversión">
          <MethodSelector
            selectedMethodId={selectedMethodId}
            onSelectMethod={(id) => setSelectedMethodId(id)}
            direction={direction}
            onToggleDirection={() =>
              setDirection((prev) => (prev === 'encode' ? 'decode' : 'encode'))
            }
            activeCategory={activeCategory}
            onSelectCategory={(cat) => setActiveCategory(cat)}
          />
        </section>

        {/* Dynamic Cipher / Encoding Options Panel */}
        {currentMethod.requiresOptions && (
          <section aria-label="Parámetros del método">
            <CipherOptionsPanel
              methodId={currentMethod.id}
              options={options}
              onChangeOptions={(newOpts) => setOptions(newOpts)}
            />
          </section>
        )}

        {/* Dual Panel Grid: Texto de entrada & Resultado */}
        <section aria-label="Área de conversión de texto" className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* Input Panel */}
          <TextInput
            value={inputText}
            onChange={(val) => setInputText(val)}
            onClear={handleClear}
          />

          {/* Result Panel */}
          <ResultPanel
            result={conversionResult}
            methodName={currentMethod.name}
            onSwapWithInput={handleSwap}
            canSwap={Boolean(conversionResult.result && conversionResult.success)}
          />
        </section>

        {/* History Section */}
        <section aria-label="Historial de conversiones">
          <HistoryPanel
            history={history}
            onReuseItem={handleReuseHistory}
            onDeleteItem={handleDeleteHistory}
            onClearHistory={handleClearAllHistory}
          />
        </section>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-slate-800/80 bg-slate-950/80 py-4 px-4 sm:px-8 text-center text-xs text-slate-500 z-10 font-mono">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>CipherLab © 2026 • Cifrado y conversión segura en el navegador</span>
          <span>100% Client-Side • Sin envío de datos</span>
        </div>
      </footer>

      {/* About Modal */}
      <AboutModal isOpen={isAboutOpen} onClose={() => setIsAboutOpen(false)} />
    </div>
  );
}
