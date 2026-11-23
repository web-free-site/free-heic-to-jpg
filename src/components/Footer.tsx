import React from 'react';
import { ExternalLink } from 'lucide-react';
import { SITE } from '../site';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const guides = [
    { label: 'How to convert in the browser', path: '/how-to-convert-heic-to-jpg-in-the-browser' },
    { label: 'Windows 11 HEIC guide', path: '/convert-heic-to-jpg-on-windows-11' },
    { label: 'Bulk HEIC conversion', path: '/bulk-convert-heic-to-jpg' },
  ];

  return (
    <footer className="border-t border-zinc-200/80 dark:border-white/10 bg-white/60 dark:bg-black/60 backdrop-blur-xl mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-8 border-b border-zinc-200/80 dark:border-white/10">
          <div>
            <h2 className="font-bold text-lg mb-2">{SITE.name}</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
              Browser-based HEIC and HEIF to JPG conversion. Built on the MIT{' '}
              <a
                href="https://github.com/xr14u1/forma-image"
                className="text-emerald-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                Forma Image
              </a>{' '}
              project by snuffdied, using{' '}
              <a
                href="https://github.com/alexcorvi/heic2any"
                className="text-emerald-600 hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                heic2any
              </a>{' '}
              (MIT, alexcorvi).
            </p>
            <a
              href={SITE.hubUrl}
              className="inline-flex items-center gap-1 mt-4 text-sm font-bold text-emerald-600 hover:underline"
            >
              More tools on web-free.site
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider mb-3">Guides</h3>
            <ul className="space-y-2 text-sm">
              {guides.map((g) => (
                <li key={g.path}>
                  <button
                    type="button"
                    onClick={() => onNavigate(g.path)}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500 text-left"
                  >
                    {g.label}
                  </button>
                </li>
              ))}
              <li>
                <button type="button" onClick={() => onNavigate('/heic-to-png')} className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500">
                  HEIC to PNG
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-mono font-bold uppercase tracking-wider mb-3">Legal</h3>
            <ul className="space-y-2 text-sm">
              {[
                { label: 'About', path: '/about' },
                { label: 'Privacy', path: '/privacy' },
                { label: 'Terms', path: '/terms' },
                { label: 'Contact', path: '/contact' },
              ].map((item) => (
                <li key={item.path}>
                  <button
                    type="button"
                    onClick={() => onNavigate(item.path)}
                    className="text-zinc-600 dark:text-zinc-400 hover:text-emerald-500"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <p className="pt-6 text-xs text-zinc-500 text-center">
          © {new Date().getFullYear()} {SITE.name}. MIT-licensed upstream code from Forma Image / snuffdied.
        </p>
      </div>
    </footer>
  );
};