import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { Dropzone } from '../components/Dropzone';
import { BatchConverter } from '../components/BatchConverter';
import type { ImageItem } from '../types';

export type HowToConfig = {
  path: string;
  title: string;
  intro: string;
  steps: string[];
  tips?: string[];
};

export const HOW_TO_PAGES: Record<string, HowToConfig> = {
  '/how-to-convert-heic-to-jpg-in-the-browser': {
    path: '/how-to-convert-heic-to-jpg-in-the-browser',
    title: 'How to convert HEIC to JPG in the browser',
    intro:
      'You can turn iPhone HEIC photos into JPG without installing software or uploading files to a server. This page walks through the process using our private client-side converter.',
    steps: [
      'Copy .heic or .heif files from your phone or camera to your computer.',
      'Open this site in Chrome, Edge, Firefox, or Safari.',
      'Drop the files into the converter below (or click to browse).',
      'Leave the output format on JPG and adjust the quality slider if needed.',
      'Click Convert on each file or use Convert all, then download JPGs or a ZIP.',
    ],
    tips: ['Nothing is uploaded: decoding uses heic2any locally in your tab.'],
  },
  '/convert-heic-to-jpg-on-windows-11': {
    path: '/convert-heic-to-jpg-on-windows-11',
    title: 'Convert HEIC to JPG on Windows 11',
    intro:
      'Windows 11 Photos and older viewers often refuse HEIC files from iPhones. Use this browser tool instead of paid extensions or cloud converters.',
    steps: [
      'Transfer HEIC files via USB, iCloud Drive, or email attachments.',
      'In Windows 11, open Microsoft Edge or Google Chrome.',
      'Visit this converter and add your HEIC files.',
      'Convert to JPG and save outputs to your Pictures folder.',
    ],
    tips: ['No HEIC codec install is required because decoding happens in the browser.'],
  },
  '/bulk-convert-heic-to-jpg': {
    path: '/bulk-convert-heic-to-jpg',
    title: 'Bulk convert HEIC to JPG',
    intro: 'Process a vacation folder or entire camera roll: queue many HEIC files, convert in one pass, and download a single ZIP of JPG images.',
    steps: [
      'Select multiple .heic/.heif files at once in the file picker.',
      'Apply a global JPG quality with the batch slider.',
      'Run Convert all and wait for the queue to finish.',
      'Click Download ZIP to save every converted JPG in one archive.',
    ],
  },
};

interface Props extends HowToConfig {
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
}

export const HowToPage: React.FC<Props> = ({
  title,
  intro,
  steps,
  tips,
  items,
  onFilesSelected,
  ...rest
}) => {
  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      <header className="space-y-4">
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">{title}</h1>
        <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">{intro}</p>
        <ol className="list-decimal pl-5 space-y-2 text-sm text-zinc-700 dark:text-zinc-300">
          {steps.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
        {tips?.length ? (
          <ul className="space-y-1 text-sm">
            {tips.map((t) => (
              <li key={t} className="flex gap-2 items-start text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
                <span>{t}</span>
              </li>
            ))}
          </ul>
        ) : null}
      </header>

      <Dropzone onFilesSelected={onFilesSelected} isProcessing={rest.isProcessingAll} heicOnly />
      {items.length > 0 ? <BatchConverter items={items} {...rest} /> : null}
    </div>
  );
};