import { HistoryItem } from '../types/cipher';

const HISTORY_KEY = 'cipherlab_history';
const THEME_KEY = 'cipherlab_theme';
const MAX_HISTORY_ITEMS = 30;

export function loadHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.warn('Could not load history from localStorage', e);
    return [];
  }
}

export function saveHistoryItem(item: Omit<HistoryItem, 'id' | 'timestamp'>): HistoryItem[] {
  try {
    const current = loadHistory();
    const newItem: HistoryItem = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      timestamp: Date.now(),
    };

    // Avoid duplicate adjacent entry if identical input, output and method
    if (
      current.length > 0 &&
      current[0].input === newItem.input &&
      current[0].output === newItem.output &&
      current[0].methodId === newItem.methodId &&
      current[0].direction === newItem.direction
    ) {
      return current;
    }

    const updated = [newItem, ...current].slice(0, MAX_HISTORY_ITEMS);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Could not save history item', e);
    return [];
  }
}

export function removeHistoryItem(id: string): HistoryItem[] {
  try {
    const current = loadHistory();
    const updated = current.filter((item) => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.warn('Could not remove history item', e);
    return [];
  }
}

export function clearAllHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.warn('Could not clear history', e);
  }
}

export function loadThemePreference(): 'dark' | 'light' {
  try {
    const saved = localStorage.getItem(THEME_KEY);
    if (saved === 'dark' || saved === 'light') {
      return saved;
    }
  } catch {
    // ignore
  }
  return 'dark';
}

export function saveThemePreference(theme: 'dark' | 'light'): void {
  try {
    localStorage.setItem(THEME_KEY, theme);
  } catch {
    // ignore
  }
}
