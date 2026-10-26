import React, { useState, useRef, useEffect } from 'react';
import { Moon, Sun, Flame, Check, ChevronDown, Sparkles } from 'lucide-react';
import { useTheme, THEMES, THEME_OPTIONS } from '../../context/ThemeContext';

export const ThemeToggle = () => {
  const { theme, setTheme, cycleTheme, isDim, isDark, isLight } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getThemeIcon = (themeId, className = "w-4 h-4") => {
    switch (themeId) {
      case THEMES.DIM:
        return <Flame className={`${className} text-amber-400`} />;
      case THEMES.LIGHT:
        return <Sun className={`${className} text-amber-500`} />;
      case THEMES.DARK:
      default:
        return <Moon className={`${className} text-indigo-400`} />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        title="Change Display Mode (Dark, Low Light, Light) - Alt+T"
        className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-medium transition-all shadow-sm ${
          isDim
            ? 'bg-amber-500/10 border-amber-500/30 text-amber-300 hover:bg-amber-500/20 shadow-amber-500/10'
            : isLight
            ? 'bg-slate-100 border-slate-300 text-slate-800 hover:bg-slate-200'
            : 'bg-slate-800 border-slate-700/80 text-slate-200 hover:bg-slate-750'
        }`}
      >
        <span className="flex items-center justify-center">
          {getThemeIcon(theme, "w-3.5 h-3.5")}
        </span>

        <span className="hidden sm:inline font-medium">
          {theme === THEMES.DIM ? 'Low Light' : theme === THEMES.LIGHT ? 'Light' : 'Dark'}
        </span>

        {isDim && (
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse hidden lg:inline" title="Eye Comfort Mode Active" />
        )}

        <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 sm:w-80 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-400" />
              <span className="text-xs font-semibold text-slate-200">Display & Lighting</span>
            </div>
            <kbd className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700 font-mono">
              Alt + T
            </kbd>
          </div>

          <div className="py-1 space-y-1">
            {THEME_OPTIONS.map((opt) => {
              const isActive = theme === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setTheme(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all group ${
                    isActive
                      ? opt.id === THEMES.DIM
                        ? 'bg-amber-500/10 border border-amber-500/30 text-amber-200'
                        : opt.id === THEMES.LIGHT
                        ? 'bg-slate-800/80 border border-slate-700 text-slate-100'
                        : 'bg-indigo-500/10 border border-indigo-500/30 text-indigo-200'
                      : 'border border-transparent hover:bg-slate-800/60 text-slate-300 hover:text-white'
                  }`}
                >
                  <div className={`mt-0.5 p-2 rounded-lg border ${
                    opt.id === THEMES.DIM
                      ? 'bg-black/60 border-amber-500/30 text-amber-400'
                      : opt.id === THEMES.LIGHT
                      ? 'bg-white border-slate-300 text-amber-500'
                      : 'bg-slate-950 border-slate-800 text-indigo-400'
                  }`}>
                    {getThemeIcon(opt.id, "w-4 h-4")}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-xs font-semibold text-slate-100 truncate">
                        {opt.name}
                      </span>
                      <span className={`text-[10px] font-medium px-1.5 py-0.2 rounded border ${
                        opt.id === THEMES.DIM
                          ? 'bg-amber-500/20 border-amber-500/30 text-amber-300'
                          : opt.id === THEMES.LIGHT
                          ? 'bg-sky-500/10 border-sky-500/30 text-sky-300'
                          : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-300'
                      }`}>
                        {opt.badge}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-400 leading-tight mt-0.5">
                      {opt.desc}
                    </p>
                  </div>

                  {isActive && (
                    <div className="mt-1">
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          <div className="mt-1 pt-2 border-t border-slate-800 px-3 py-1 flex items-center justify-between text-[11px] text-slate-400">
            <span>Cycle instantly:</span>
            <button
              onClick={() => {
                cycleTheme();
              }}
              className="text-brand-400 hover:text-brand-300 font-semibold underline decoration-dotted"
            >
              Next Theme →
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
