import React from 'react';
import { ShieldCheck, Lock, HelpCircle, ChevronRight } from 'lucide-react';
import { Dropzone } from '../components/Dropzone';
import { BatchConverter } from '../components/BatchConverter';
import type { ImageItem, TargetFormat } from '../types';

interface HomePageProps {
  items: ImageItem[];
  onFilesSelected: (files: File[]) => void;
  onUpdateItem: (id: string, updates: Partial<ImageItem>) => void;
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onConvertItem: (id: string) => Promise<void>;
  onConvertAll: () => Promise<void>;
  onDownloadZip: () => Promise<void>;
  onPreviewImage: (item: ImageItem) => void;
  isProcessingAll: boolean;
  onNavigate: (path: string) => void;
  defaultFormat?: TargetFormat;
}

const FAQ = [
  {
    q: 'Are my photos uploaded?',
    a: 'No. HEIC decoding uses heic2any and Canvas locally. Files never leave your browser.',
  },
  {
    q: 'What is the default output?',
    a: 'JPG for sharing and Windows compatibility. You can switch any file to PNG before converting.',
  },
  {
    q: 'Can I convert many HEIC files at once?',
    a: 'Yes. Add multiple files, convert the batch, and download individual JPGs or one ZIP archive.',
  },
];

export const HomePage: React.FC<HomePageProps> = ({
  items,
  onFilesSelected,
  onNavigate,
  ...converterProps
}) => {
  return (
    <div className="space-y-12 animate-in fade-in duration-300">
      <section className="text-center space-y-5 pt-2 sm:pt-6 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          HEIC / HEIF → JPG (default) or PNG
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Free HEIC to JPG Converter
        </h1>
        <p className="text-base sm:text-lg text-zinc-600 dark:text-zinc-400 font-medium leading-relaxed">
          Turn iPhone HEIC and HEIF photos into JPG or PNG in your browser. Batch convert, tweak quality, and
          download a ZIP — with zero cloud upload.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-zinc-500 dark:text-zinc-400">
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            Private client-side
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Lock className="w-4 h-4 text-emerald-500" />
            No account
          </span>
        </div>
      </section>

      <Dropzone onFilesSelected={onFilesSelected} isProcessing={converterProps.isProcessingAll} heicOnly />

      {items.length > 0 ? <BatchConverter items={items} {...converterProps} /> : null}

      <section className="grid sm:grid-cols-3 gap-4 text-sm">
        {FAQ.map((f) => (
          <div
            key={f.q}
            className="p-5 rounded-2xl border border-zinc-200/80 dark:border-white/10 bg-white/80 dark:bg-[#0A0A0C]/80"
          >
            <h2 className="font-bold text-zinc-950 dark:text-white mb-2 flex items-start gap-2 text-base">
              <HelpCircle className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
              {f.q}
            </h2>
            <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{f.a}</p>
          </div>
        ))}
      </section>

      <section className="rounded-2xl border border-zinc-200/80 dark:border-white/10 p-6 bg-emerald-50/50 dark:bg-emerald-950/20">
        <h2 className="font-bold text-lg mb-3">Guides on this site</h2>
        <ul className="space-y-2 text-sm">
          {[
            ['/how-to-convert-heic-to-jpg-in-the-browser', 'How to convert HEIC to JPG in the browser'],
            ['/convert-heic-to-jpg-on-windows-11', 'Convert HEIC to JPG on Windows 11'],
            ['/bulk-convert-heic-to-jpg', 'Bulk convert HEIC to JPG'],
          ].map(([path, label]) => (
            <li key={path}>
              <button
                type="button"
                onClick={() => onNavigate(path)}
                className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
              >
                {label}
                <ChevronRight className="w-4 h-4" />
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => onNavigate('/heic-to-png')}
              className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 font-semibold hover:underline"
            >
              HEIC to PNG converter
              <ChevronRight className="w-4 h-4" />
            </button>
          </li>
        </ul>
      </section>
    </div>
  );
};