'use client';

// Re-trigger Vercel build
import { useState } from 'react';
import Canvas from '@/components/Canvas';

type ActiveObject = {
  type: string;
  fill: string;
  fontSize: number;
} | null;

// フレーム情報の定義
const FRAMES = [
  { name: 'iPhone 14 Pro', path: '/frames/iphone-14-pro.png' },
  { name: 'iPhone 15', path: '/frames/iphone-15.png' },
  { name: 'Android (Pixel)', path: '/frames/android-pixel.png' },
];

export default function Home() {
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);
  const [addTextTrigger, setAddTextTrigger] = useState(0);
  const [activeObject, setActiveObject] = useState<ActiveObject>(null);
  const [exportTrigger, setExportTrigger] = useState(0);
  const [frame, setFrame] = useState(FRAMES[0].path); // フレームのパスをstateで管理

  const handleScreenshotUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (screenshotUrl) URL.revokeObjectURL(screenshotUrl);
      setScreenshotUrl(URL.createObjectURL(file));
    }
  };

  const handleAddText = () => setAddTextTrigger((prev) => prev + 1);
  const handleExport = () => setExportTrigger((prev) => prev + 1);

  const handleObjectSelected = (obj: any) => {
    if (obj.type === 'i-text') {
      setActiveObject({ type: obj.type, fill: obj.fill || '#000000', fontSize: obj.fontSize || 40 });
    }
  };

  const handleSelectionCleared = () => setActiveObject(null);
  const handleColorChange = (color: string) => setActiveObject(prev => prev ? { ...prev, fill: color } : null);
  const handleFontSizeChange = (size: number) => setActiveObject(prev => prev ? { ...prev, fontSize: size } : null);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-md py-4 px-6">
        <h1 className="text-2xl font-bold text-gray-800">スクショ作るくん</h1>
      </header>

      <main className="flex-grow flex flex-col lg:flex-row">
        <aside className="w-full lg:w-80 bg-white p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">コントロールパネル</h2>
          <div className="space-y-4">
            <div>
              <label htmlFor="frame-select" className="block text-sm font-medium text-gray-700 mb-2">
                1. フレームを選択
              </label>
              <select
                id="frame-select"
                value={frame}
                onChange={(e) => setFrame(e.target.value)}
                className="block w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                {FRAMES.map((f) => (
                  <option key={f.path} value={f.path}>{f.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="screenshot-upload" className="block text-sm font-medium text-gray-700 mb-2">
                2. スクショをアップロード
              </label>
              <input
                id="screenshot-upload"
                type="file"
                accept="image/*"
                onChange={handleScreenshotUpload}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                3. テキストを追加
              </label>
              <button
                onClick={handleAddText}
                className="w-full bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600"
              >
                テキストを追加
              </button>
            </div>

            {activeObject?.type === 'i-text' && (
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold mb-2">テキスト編集</h3>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="text-color">色</label>
                    <input id="text-color" type="color" value={activeObject.fill} onChange={(e) => handleColorChange(e.target.value)} className="mt-1 block w-full h-10" />
                  </div>
                  <div>
                    <label htmlFor="font-size">フォントサイズ</label>
                    <input id="font-size" type="number" value={activeObject.fontSize} onChange={(e) => handleFontSizeChange(parseInt(e.target.value, 10))} className="mt-1 block w-full" />
                  </div>
                </div>
              </div>
            )}
             <div className="border-t pt-4">
               <button
                onClick={handleExport}
                className="w-full bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600"
              >
                PNGとしてエクスポート
              </button>
            </div>
          </div>
        </aside>

        <div className="flex-grow bg-gray-200 flex items-center justify-center p-4">
          <div className="shadow-lg">
            <Canvas
              frameUrl={frame}
              screenshotUrl={screenshotUrl}
              addTextTrigger={addTextTrigger}
              onObjectSelected={handleObjectSelected}
              onSelectionCleared={handleSelectionCleared}
              activeObjectProps={activeObject}
              exportTrigger={exportTrigger}
            />
          </div>
        </div>
      </main>

      <footer className="bg-white py-4 px-6 text-center text-sm text-gray-500">
        <p>&copy; 2024 スクショ作るくん. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
