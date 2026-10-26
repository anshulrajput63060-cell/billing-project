import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext();

export const THEMES = {
  DARK: 'dark',
  DIM: 'dim',     // Low Light / Eye Comfort (OLED Deep Night)
  LIGHT: 'light', // Crisp Daylight
};

export const THEME_OPTIONS = [
  {
    id: THEMES.DARK,
    name: 'Dark Mode',
    hindiName: 'डार्क मोड',
    label: 'Midnight Slate',
    desc: 'Deep midnight slate with high contrast. Balanced for everyday indoor retail.',
    badge: 'Standard',
    icon: 'Moon',
    accentColor: '#6366f1',
    bgColor: '#0b0f19',
    cardColor: '#0f172a',
    borderColor: '#334155',
  },
  {
    id: THEMES.DIM,
    name: 'Low Light Mode',
    hindiName: 'लो लाइट मोड (आई कम्फर्ट)',
    label: 'OLED Warm Dim',
    desc: 'Deep OLED pitch black with warm candlelight tones. Zero blue glare, reduces eye fatigue for night billing.',
    badge: 'Eye Comfort 🕯️',
    icon: 'Flame',
    accentColor: '#f59e0b',
    bgColor: '#06070a',
    cardColor: '#111218',
    borderColor: '#f59e0b',
  },
  {
    id: THEMES.LIGHT,
    name: 'Light Mode',
    hindiName: 'लाइट मोड',
    label: 'Clean Daylight',
    desc: 'Crisp clean daylight white with dark slate typography. Ideal for bright daytime counters.',
    badge: 'Daylight ☀️',
    icon: 'Sun',
    accentColor: '#4f46e5',
    bgColor: '#f5f7fb',
    cardColor: '#ffffff',
    borderColor: '#cbd5e1',
  },
];

export const ThemeProvider = ({ children }) => {
  const [theme, setThemeState] = useState(() => {
    const saved = localStorage.getItem('apni_theme');
    if (saved && (saved === 'dark' || saved === 'dim' || saved === 'light' || saved === 'low-light')) {
      return saved === 'low-light' ? 'dim' : saved;
    }
    return 'dark';
  });

  const applyTheme = useCallback((currentTheme) => {
    const root = document.documentElement;
    const body = document.body;

    root.setAttribute('data-theme', currentTheme);
    body.setAttribute('data-theme', currentTheme);

    // Synchronize CSS class markers
    root.classList.remove('dark', 'dim', 'theme-dim', 'light', 'theme-light');
    body.classList.remove('dark', 'dim', 'theme-dim', 'light', 'theme-light');

    if (currentTheme === THEMES.LIGHT) {
      root.classList.add('light', 'theme-light');
      body.classList.add('light', 'theme-light');
    } else if (currentTheme === THEMES.DIM) {
      root.classList.add('dark', 'dim', 'theme-dim');
      body.classList.add('dark', 'dim', 'theme-dim');
    } else {
      root.classList.add('dark');
      body.classList.add('dark');
    }

    try {
      localStorage.setItem('apni_theme', currentTheme);
    } catch (e) {
      console.warn('Unable to persist theme to localStorage', e);
    }
  }, []);

  const setTheme = useCallback((newTheme) => {
    const normalized = newTheme === 'low-light' ? 'dim' : newTheme;
    setThemeState(normalized);
    applyTheme(normalized);
  }, [applyTheme]);

  const cycleTheme = useCallback(() => {
    setThemeState((curr) => {
      let next = THEMES.DARK;
      if (curr === THEMES.DARK) next = THEMES.DIM;
      else if (curr === THEMES.DIM) next = THEMES.LIGHT;
      else next = THEMES.DARK;

      applyTheme(next);
      return next;
    });
  }, [applyTheme]);

  // Initial mount application
  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  // Global Keyboard Shortcut: Alt + T (Toggle Theme) or F3
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Alt + T to cycle themes
      if (e.altKey && (e.key === 't' || e.key === 'T')) {
        e.preventDefault();
        cycleTheme();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [cycleTheme]);

  const currentThemeConfig = THEME_OPTIONS.find((t) => t.id === theme) || THEME_OPTIONS[0];

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        cycleTheme,
        isDark: theme === THEMES.DARK,
        isDim: theme === THEMES.DIM,
        isLowLight: theme === THEMES.DIM,
        isLight: theme === THEMES.LIGHT,
        currentThemeConfig,
        THEMES,
        THEME_OPTIONS,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
