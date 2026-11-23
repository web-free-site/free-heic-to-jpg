import React, { useState } from 'react';
import { Sun, Moon, Menu, X, ChevronDown, ImageIcon } from 'lucide-react';
import { SITE } from '../site';

interface NavbarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

const GUIDES = [
  { label: 'How to convert in the browser', path: '/how-to-convert-heic-to-jpg-in-the-browser' },
  { label: 'HEIC on Windows 11', path: '/convert-heic-to-jpg-on-windows-11' },
  { label: 'Bulk convert HEIC', path: '/bulk-convert-heic-to-jpg' },
];

export const Navbar: React.FC<NavbarProps> = ({
  currentPath,
  onNavigate,
  isDarkMode,
  onToggleTheme,
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [guidesOpen, setGuidesOpen] = useState(false);

  const handleNav = (path: string) => {
    onNavigate(path);
    setMobileOpen(false);
    setGuidesOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-black/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <button
          type="button"
          onClick={() => handleNav('/')}
          className="flex items-center gap-3 group text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 rounded-xl p-1"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-emerald-400 flex items-center justify-center text-black shadow-lg shadow-emerald-500/25">
            <ImageIcon className="w-5 h-5" />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base tracking-tight text-zinc-950 dark:text-white">
              {SITE.shortName}
            </span>
            <span className="text-[10px] text-zinc-400 hidden sm:inline">web-free.site tool</span>
          </div>
        </button>

        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold">
          <button
            type="button"
            onClick={() => handleNav('/')}
            className={`hover:text-emerald-600 ${currentPath === '/' ? 'text-emerald-600' : 'text-zinc-600 dark:text-zinc-300'}`}
          >
            Convert
          </button>
          <button
            type="button"
            onClick={() => handleNav('/heic-to-png')}
            className={`hover:text-emerald-600 ${currentPath === '/heic-to-png' ? 'text-emerald-600' : 'text-zinc-600 dark:text-zinc-300'}`}
          >
            HEIC → PNG
          </button>
          <div className="relative">
            <button
              type="button"
              onClick={() => setGuidesOpen((o) => !o)}
              className="flex items-center gap-1 text-zinc-600 dark:text-zinc-300 hover:text-emerald-600"
            >
              Guides <ChevronDown className="w-4 h-4" />
            </button>
            {guidesOpen ? (
              <div className="absolute right-0 mt-2 w-64 rounded-xl border border-zinc-200 dark:border-white/10 bg-white dark:bg-zinc-900 shadow-xl p-2 z-50">
                {GUIDES.map((g) => (
                  <button
                    key={g.path}
                    type="button"
                    onClick={() => handleNav(g.path)}
                    className="block w-full text-left px-3 py-2 rounded-lg text-xs hover:bg-zinc-100 dark:hover:bg-white/5"
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            ) : null}
          </div>
          <button type="button" onClick={() => handleNav('/about')} className="text-zinc-600 dark:text-zinc-300 hover:text-emerald-600">
            About
          </button>
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            className="p-2 rounded-xl border border-zinc-200 dark:border-white/10 hover:border-emerald-500/50"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>
          <button
            type="button"
            className="md:hidden p-2 rounded-xl border border-zinc-200 dark:border-white/10"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen ? (
        <div className="md:hidden border-t border-zinc-200 dark:border-white/10 px-4 py-3 space-y-2 text-sm font-semibold">
          {[
            { label: 'Convert HEIC to JPG', path: '/' },
            { label: 'HEIC to PNG', path: '/heic-to-png' },
            ...GUIDES,
            { label: 'About', path: '/about' },
            { label: 'Contact', path: '/contact' },
          ].map((link) => (
            <button
              key={link.path}
              type="button"
              onClick={() => handleNav(link.path)}
              className="block w-full text-left py-2 text-zinc-700 dark:text-zinc-200"
            >
              {link.label}
            </button>
          ))}
        </div>
      ) : null}
    </header>
  );
};