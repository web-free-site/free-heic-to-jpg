import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { SITE } from '../site';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8 py-4">
      <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">About {SITE.name}</h1>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
        This site is a specialized fork of the MIT-licensed{' '}
        <a
          href="https://github.com/xr14u1/forma-image"
          className="text-emerald-600 hover:underline inline-flex items-center gap-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          Forma Image <ExternalLink className="w-3.5 h-3.5" />
        </a>{' '}
        project (Forma Image / snuffdied). We kept the client-side batch converter and ZIP export, narrowed the product
        to HEIC and HEIF → JPG or PNG, and removed unrelated image-studio tools from navigation.
      </p>
      <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
        HEIC decoding uses{' '}
        <a
          href="https://github.com/alexcorvi/heic2any"
          className="text-emerald-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          heic2any
        </a>{' '}
        (MIT, alexcorvi) inside your browser. JSZip powers batch ZIP downloads.
      </p>
      <div className="p-5 rounded-2xl border border-emerald-500/30 bg-emerald-50/40 dark:bg-emerald-950/20 flex gap-3">
        <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
        <p className="text-sm text-zinc-700 dark:text-zinc-300">
          Photos are not uploaded to our servers. Conversion happens locally with WebAssembly and Canvas.
        </p>
      </div>
      <p className="text-sm">
        Part of the{' '}
        <a href={SITE.hubUrl} className="text-emerald-600 font-semibold hover:underline">
          web-free.site
        </a>{' '}
        family of free browser utilities.
      </p>
    </div>
  );
};