"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import dynamic from 'next/dynamic';
import SimpleFrame from "@/components/frames/SimpleFrame"; // SimpleFrameをインポート

const DraggableText = dynamic(() => import('@/components/DraggableText'), { ssr: false });

export default function Home() {
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [bgColor, setBgColor] = useState('#0d1b2a'); // Default to blueprint background
  const [isDownloading, setIsDownloading] = useState(false);
  const previewRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

      if (imageFiles.length !== fileArray.length) {
        alert('画像ファイルのみを選択してください。');
        return;
      }

      const newScreenshots: string[] = [];
      let loadedCount = 0;
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newScreenshots.push(e.target?.result as string);
          loadedCount++;
          if (loadedCount === imageFiles.length) {
            setScreenshots(newScreenshots);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDownload = useCallback(async () => {
    if (previewRef.current === null) {
      return;
    }
    setIsDownloading(true);

    try {
      const domtoimage = (await import('dom-to-image-more')).default;
      // Temporarily remove box-shadow for cleaner capture
      const element = previewRef.current;
      const originalShadow = element.style.boxShadow;
      element.style.boxShadow = 'none';

      const dataUrl = await domtoimage.toPng(element, { quality: 1.0, scale: 2 });

      // Restore box-shadow
      element.style.boxShadow = originalShadow;

      const link = document.createElement('a');
      link.download = 'screenshot-composition.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('oops, something went wrong!', err);
      alert('画像の生成に失敗しました。');
    } finally {
      setIsDownloading(false);
    }
  }, [previewRef]);

  const renderFrame = (screenshotSrc: string, index: number) => {
    const image = <img src={screenshotSrc} alt={`アプリスクリーンショット ${index + 1}`} className="w-full h-full object-cover" />;
    return <SimpleFrame key={index}>{image}</SimpleFrame>;
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 font-sans bg-background text-text">
      <header className="w-full max-w-7xl mb-8">
        <h1 className="text-4xl font-display font-bold">スクショ作るくん</h1>
        <p className="text-secondary">App Store用スクリーンショット生成ツール</p>
      </header>

      <div className="flex flex-col md:flex-row w-full max-w-7xl grow gap-8">
        {/* --- Controls Panel --- */}
        <div className="w-full md:w-1/3 p-6 bg-accent rounded-lg shadow-lg flex flex-col h-fit">
          <h2 className="text-2xl font-display mb-4 border-b-2 border-primary pb-2">Controls</h2>

          <div className="space-y-6 grow">
            <div>
              <label htmlFor="upload" className="block text-sm font-medium text-secondary mb-1">
                スクリーンショットをアップロード
              </label>
              <input
                id="upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-text hover:file:bg-secondary"
              />
            </div>

            <div>
              <label htmlFor="bgColor" className="block text-sm font-medium text-secondary">
                  背景色
              </label>
              <input
                  type="color"
                  id="bgColor"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="mt-1 block w-full h-10 rounded-md border-primary bg-primary"
              />
            </div>
          </div>

          <div className="mt-auto pt-6">
            <button
              onClick={handleDownload}
              disabled={isDownloading}
              className="w-full py-3 px-4 bg-secondary text-white font-bold rounded-lg hover:bg-primary transition-colors disabled:bg-gray-500"
            >
              {isDownloading ? '生成中...' : 'Download Image'}
            </button>
          </div>
        </div>

        {/* --- Preview Area --- */}
        <div className="w-2/3 flex items-center justify-center p-6 bg-accent rounded-lg shadow-lg overflow-hidden">
           <div ref={previewRef} data-testid="preview-area" style={{ backgroundColor: bgColor }} className="relative p-10 rounded-lg">
             <DraggableText />
             <div className="flex space-x-4 overflow-x-auto pb-4">
              {screenshots.length > 0 ? (
                screenshots.map(renderFrame)
              ) : (
                <div className="w-[270px] h-[585px] flex items-center justify-center bg-primary/20 rounded-xl">
                  <p className="text-secondary text-center px-4">ここにプレビューが表示されます</p>
                </div>
              )}
            </div>
           </div>
        </div>
      </div>
    </main>
  );
}
