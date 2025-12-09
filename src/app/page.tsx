"use client";

import { useState, useCallback, useRef } from "react";
import { toPng } from 'html-to-image';
import Preview from "@/components/Preview";
import { deviceFrames, textLayouts } from "./data";


export default function Home() {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [selectedDevice, setSelectedDevice] = useState(deviceFrames[0]);
  const [previewScale, setPreviewScale] = useState(0.3);
  const [texts, setTexts] = useState(textLayouts['layout1']);
  const [selectedLayout, setSelectedLayout] = useState('layout1');
  const previewRef = useRef<HTMLDivElement>(null);

  const handleScreenshotUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeviceChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const device = deviceFrames.find(d => d.id === event.target.value);
    if (device) {
      setSelectedDevice(device);
    }
  };

  const handleLayoutChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const layoutKey = event.target.value as keyof typeof textLayouts;
    setSelectedLayout(layoutKey);
    setTexts(textLayouts[layoutKey]);
  };

  const handleTextChange = (id: number, value: string) => {
    setTexts(currentTexts =>
      currentTexts.map(text => text.id === id ? { ...text, value } : text)
    );
  };

  const handleDownload = useCallback(async () => {
    if (previewRef.current === null) {
      return;
    }
    const element = previewRef.current;

    // Temporarily scale up for high-resolution capture
    const originalScale = element.style.transform;
    element.style.transform = 'scale(1)';

    try {
      const dataUrl = await toPng(element, {
        cacheBust: true,
        pixelRatio: 2, // Capture at 2x resolution
      });
      const link = document.createElement('a');
      link.download = 'mobile-pic.png';
      link.href = dataUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error('Image generation failed:', err);
    } finally {
      // Restore original scale
      element.style.transform = originalScale;
    }
  }, [previewRef, selectedDevice]);

  const containerStyle = {
    width: `${selectedDevice.width}px`,
    height: `${selectedDevice.height}px`,
    transform: `scale(${previewScale})`,
    transformOrigin: 'center',
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-8 font-sans bg-background text-text">
      <header className="w-full max-w-7xl mb-8">
        <h1 className="text-4xl font-display font-bold">スクショ作るくん</h1>
        <p className="text-secondary">App Store用スクリーンショット生成ツール</p>
      </header>

      <div className="flex flex-col md:flex-row w-full max-w-7xl grow gap-8">
        {/* --- Controls Panel --- */}
        <div className="w-full md:w-1/3 p-6 bg-accent rounded-lg shadow-lg flex flex-col">
          <h2 className="text-2xl font-display mb-4 border-b-2 border-primary pb-2">Controls</h2>

          <div className="space-y-6 grow">
            <div>
              <label htmlFor="device-select" className="block text-sm font-medium text-secondary mb-1">Device Frame</label>
              <select id="device-select" value={selectedDevice.id} onChange={handleDeviceChange} className="w-full p-2 rounded bg-primary border-secondary">
                {deviceFrames.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
              </select>
            </div>

            <div>
              <label htmlFor="screenshot-upload" className="block text-sm font-medium text-secondary mb-1">Screenshot</label>
              <input type="file" id="screenshot-upload" onChange={handleScreenshotUpload} accept="image/*" className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-primary file:text-text hover:file:bg-secondary"/>
            </div>

            <div>
              <label htmlFor="scale-slider" className="block text-sm font-medium text-secondary mb-1">Preview Size: {Math.round(previewScale * 100)}%</label>
              <input type="range" id="scale-slider" min="0.1" max="0.5" step="0.01" value={previewScale} onChange={(e) => setPreviewScale(parseFloat(e.target.value))} className="w-full"/>
            </div>

            <div>
              <label htmlFor="layout-select" className="block text-sm font-medium text-secondary mb-1">Text Layout</label>
              <select id="layout-select" value={selectedLayout} onChange={handleLayoutChange} className="w-full p-2 rounded bg-primary border-secondary">
                {Object.keys(textLayouts).map(key => <option key={key} value={key}>{`Layout ${key.slice(-1)}`}</option>)}
              </select>
            </div>

            {texts.map((text, index) => (
               <div key={text.id}>
                 <label htmlFor={`text-input-${text.id}`} className="block text-sm font-medium text-secondary mb-1">{`Text ${index + 1}`}</label>
                 <input type="text" id={`text-input-${text.id}`} value={text.value} onChange={(e) => handleTextChange(text.id, e.target.value)} className="w-full p-2 rounded bg-primary border-secondary"/>
               </div>
            ))}
          </div>

          <div className="mt-auto pt-6">
            <button
              onClick={handleDownload}
              className="w-full py-3 px-4 bg-secondary text-white font-bold rounded-lg hover:bg-primary transition-colors"
            >
              Download Image
            </button>
          </div>
        </div>

        {/* --- Preview Area --- */}
        <div className="w-2/3 flex items-center justify-center p-6 bg-accent rounded-lg shadow-lg overflow-hidden">
           <div ref={previewRef} style={containerStyle} data-testid="preview-container">
             <Preview
               screenshotUrl={screenshotUrl}
               frameUrl={selectedDevice.frameUrl}
               texts={texts}
               containerStyle={{ width: '100%', height: '100%' }}
             />
           </div>
        </div>
      </div>
    </main>
  );
}
