import React, { useState, useEffect, useCallback } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './pages/HomePage';
import { FormatPairPage } from './pages/FormatPairPage';
import { HowToPage, HOW_TO_PAGES } from './pages/HowToPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { TermsPage } from './pages/TermsPage';
import { ContactPage } from './pages/ContactPage';
import { ImagePreviewModal } from './components/ImagePreviewModal';
import { AdSlot, SponsoredSmartlink, useAdScripts } from './components/ads/AdSlot';

import type { ImageItem, TargetFormat } from './types';
import {
  processImage,
  detectFormat,
  downloadBatchAsZip,
  loadImageElement,
} from './utils/imageEngine';

function isHeicFile(file: File): boolean {
  const ext = file.name.split('.').pop()?.toLowerCase();
  return (
    file.type.includes('heic') ||
    file.type.includes('heif') ||
    ext === 'heic' ||
    ext === 'heif'
  );
}

export function App() {
  const [currentPath, setCurrentPath] = useState<string>(() => window.location.pathname || '/');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('heic_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [items, setItems] = useState<ImageItem[]>([]);
  const [isProcessingAll, setIsProcessingAll] = useState(false);
  const [previewModalItem, setPreviewModalItem] = useState<ImageItem | null>(null);
  const [defaultTarget, setDefaultTarget] = useState<TargetFormat>('JPG');

  useAdScripts();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
    localStorage.setItem('heic_theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname || '/');
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setCurrentPath(path);
    if (path === '/heic-to-png') setDefaultTarget('PNG');
    else if (path === '/' || path === '/converter') setDefaultTarget('JPG');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const handleFilesSelected = useCallback(
    async (files: File[]) => {
      const heicFiles = files.filter(isHeicFile);
      if (heicFiles.length === 0) {
        alert('Please add .heic or .heif files (for example from an iPhone).');
        return;
      }

      const targetFmt = defaultTarget;
      const newItems: ImageItem[] = [];

      for (const file of heicFiles) {
        const origFormat = detectFormat(file);
        const previewUrl = URL.createObjectURL(file);
        let width = 0;
        let height = 0;

        try {
          const img = await loadImageElement(file);
          width = img.naturalWidth || img.width;
          height = img.naturalHeight || img.height;
        } catch (err) {
          console.warn('Could not read image dimensions:', err);
        }

        newItems.push({
          id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
          file,
          name: file.name,
          originalFormat: origFormat,
          targetFormat: targetFmt,
          originalSize: file.size,
          originalWidth: width,
          originalHeight: height,
          targetWidth: width,
          targetHeight: height,
          maintainAspectRatio: true,
          quality: 85,
          status: 'idle',
          progress: 0,
          previewUrl,
          options: {
            format: targetFmt,
            quality: 85,
            maintainAspectRatio: true,
            stripMetadata: false,
          },
        });
      }

      setItems((prev) => [...prev, ...newItems]);
    },
    [defaultTarget],
  );

  const updateItem = (id: string, updates: Partial<ImageItem>) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, ...updates } : item)));
  };

  const removeItem = (id: string) => {
    setItems((prev) => {
      const target = prev.find((i) => i.id === id);
      if (target) {
        URL.revokeObjectURL(target.previewUrl);
        if (target.convertedUrl) URL.revokeObjectURL(target.convertedUrl);
      }
      return prev.filter((i) => i.id !== id);
    });
  };

  const clearAll = () => {
    items.forEach((item) => {
      URL.revokeObjectURL(item.previewUrl);
      if (item.convertedUrl) URL.revokeObjectURL(item.convertedUrl);
    });
    setItems([]);
  };

  const convertSingleItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;

    updateItem(id, { status: 'processing', progress: 30, errorMessage: undefined });

    try {
      const result = await processImage(item.file, {
        format: item.targetFormat,
        quality: item.quality,
        width: item.targetWidth || undefined,
        height: item.targetHeight || undefined,
        maintainAspectRatio: item.maintainAspectRatio,
        stripMetadata: item.options.stripMetadata,
        customOutputName: item.options.customOutputName,
      });

      const convertedUrl = URL.createObjectURL(result.blob);
      const convertedSize = result.blob.size;

      updateItem(id, {
        status: 'done',
        progress: 100,
        convertedBlob: result.blob,
        convertedUrl,
        convertedSize,
        savingsPercent: 0,
      });
    } catch (err) {
      updateItem(id, {
        status: 'error',
        progress: 0,
        errorMessage: err instanceof Error ? err.message : 'Conversion failed.',
      });
    }
  };

  const convertAllItems = async () => {
    if (!items.length) return;
    setIsProcessingAll(true);
    for (const item of items) {
      if (item.status !== 'done') await convertSingleItem(item.id);
    }
    setIsProcessingAll(false);
  };

  const handleDownloadZip = async () => {
    try {
      await downloadBatchAsZip(items, 'heic-converted.zip');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to generate ZIP.');
    }
  };

  const converterProps = {
    items,
    onFilesSelected: handleFilesSelected,
    onUpdateItem: updateItem,
    onRemoveItem: removeItem,
    onClearAll: clearAll,
    onConvertItem: convertSingleItem,
    onConvertAll: convertAllItems,
    onDownloadZip: handleDownloadZip,
    onPreviewImage: (item: ImageItem) => setPreviewModalItem(item),
    isProcessingAll,
    onNavigate: navigate,
  };

  const normalizedPath = (() => {
    if (currentPath === '/converter' || currentPath === '/heic-to-jpg') return '/';
    return currentPath.endsWith('/') && currentPath.length > 1
      ? currentPath.replace(/\/$/, '')
      : currentPath;
  })();

  const renderRoute = () => {
    if (normalizedPath === '/') {
      return <HomePage {...converterProps} defaultFormat="JPG" />;
    }
    if (normalizedPath === '/heic-to-png') {
      return (
        <FormatPairPage
          sourceFormat="HEIC"
          targetFormat="PNG"
          title="Convert HEIC to PNG Online"
          subtitle="Export Apple HEIC and HEIF photos as PNG files without uploading them to the cloud."
          benefits={[
            'Lossless-friendly PNG output for editing',
            'Batch convert an entire camera roll',
            'Download one file or a ZIP archive',
            '100% private decoding with heic2any in your browser',
          ]}
          faqs={[
            {
              q: 'Does PNG keep more detail than JPG?',
              a: 'PNG avoids JPEG compression artifacts. File sizes are larger than JPG but better for graphics and further editing.',
            },
          ]}
          {...converterProps}
        />
      );
    }
    const howTo = HOW_TO_PAGES[normalizedPath];
    if (howTo) {
      return <HowToPage {...howTo} {...converterProps} />;
    }
    if (normalizedPath === '/about') return <AboutPage />;
    if (normalizedPath === '/privacy') return <PrivacyPage />;
    if (normalizedPath === '/terms') return <TermsPage />;
    if (normalizedPath === '/contact') return <ContactPage />;
  };

  const showHomeTopAd = normalizedPath === '/' || normalizedPath === '/heic-to-png';

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAFD] dark:bg-black text-zinc-950 dark:text-white transition-colors duration-200 relative selection:bg-emerald-500/30 selection:text-emerald-400">
      <div className="fixed inset-0 emerald-ambient-glow pointer-events-none z-0" />

      <Navbar currentPath={normalizedPath} onNavigate={navigate} isDarkMode={isDarkMode} onToggleTheme={toggleTheme} />

      <AdSlot slot="header728x90" className="ad-header mx-auto max-w-7xl px-4 pt-2" label="Sponsored" />

      <div className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-12 relative z-10 flex gap-6">
        <main className="flex-1 min-w-0 space-y-4">
          {showHomeTopAd ? <AdSlot slot="homeTop728x90" className="ad-home-top" /> : null}
          {renderRoute()}
          <AdSlot slot="betweenToolContent728x90" className="ad-mid" />
          <AdSlot slot="content468x60" className="ad-inline" />
          <AdSlot slot="nativeBelowResult" className="ad-native" />
          <AdSlot slot="content300x250" className="ad-box" />
        </main>
        <aside className="hidden lg:block w-40 shrink-0 pt-8">
          <AdSlot slot="sidebar160x600" className="ad-sidebar sticky top-20" />
          <AdSlot slot="sidebar160x300" className="ad-sidebar-secondary mt-4" label="Ad" />
        </aside>
      </div>

      <AdSlot slot="mobileSticky320x50" className="ad-mobile-sticky fixed bottom-0 left-0 right-0 z-50 lg:hidden bg-white/95 dark:bg-black/95 p-1" />

      <ImagePreviewModal item={previewModalItem} onClose={() => setPreviewModalItem(null)} />

      <Footer onNavigate={navigate} />
      <SponsoredSmartlink className="pb-20 lg:pb-4" />
    </div>
  );
}

export default App;