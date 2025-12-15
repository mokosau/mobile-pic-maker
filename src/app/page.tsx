'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import DraggableText from '@/components/DraggableText';
import SimpleFrame from '@/components/frames/SimpleFrame';
import HandFrame from '@/components/frames/HandFrame';
import TiltedFrame from '@/components/frames/TiltedFrame';

// フレームの種類を定義
type FrameType = 'simple' | 'hand' | 'tilted';

// テキスト要素の型を定義
interface TextElement {
  id: number;
  text: string;
  position: { x: number; y: number };
  color: string;
}

export default function Home() {
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [bgColor, setBgColor] = useState('#ffffff');
  const [frameColor, setFrameColor] = useState('#000000');
  const [isLoading, setIsLoading] = useState(false);
  const [frame, setFrame] = useState<FrameType>('simple');
  const [textElements, setTextElements] = useState<TextElement[]>([
    { id: 1, text: 'テキストを入力', position: { x: 50, y: 50 }, color: '#000000' },
  ]);

  const previewRef = useRef<HTMLDivElement>(null);

  const addTextElement = () => {
    setTextElements([
      ...textElements,
      { id: Date.now(), text: '新しいテキスト', position: { x: 50, y: 100 }, color: '#000000' },
    ]);
  };

  const handleTextChange = (id: number, newText: string) => {
    setTextElements(textElements.map(el =>
      el.id === id ? { ...el, text: newText } : el
    ));
  };

  const handleTextStop = (id: number, position: { x: number; y: number }) => {
    setTextElements(textElements.map(el =>
      el.id === id ? { ...el, position } : el
    ));
  };

  const handleTextColorChange = (id: number, newColor: string) => {
    setTextElements(textElements.map(el =>
      el.id === id ? { ...el, color: newColor } : el
    ));
  };

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
      imageFiles.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          newScreenshots.push(e.target?.result as string);
          if (newScreenshots.length === imageFiles.length) {
            setScreenshots(newScreenshots);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleDownload = () => {
    if (previewRef.current) {
      setIsLoading(true);
      html2canvas(previewRef.current, { useCORS: true, background: undefined }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'screenshot-carousel.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        setIsLoading(false);
      }).catch(err => {
        console.error("画像の生成に失敗しました:", err);
        alert("画像の生成中にエラーが発生しました。");
        setIsLoading(false);
      });
    }
  };

  const renderFrame = (screenshotSrc: string, index: number) => {
    const image = <img src={screenshotSrc} alt={`アプリスクリーンショット ${index + 1}`} className="w-full h-full object-cover" />;

    switch (frame) {
      case 'simple':
        return <SimpleFrame key={index} color={frameColor}>{image}</SimpleFrame>;
      case 'hand':
        return <HandFrame key={index} color={frameColor}>{image}</HandFrame>;
      case 'tilted':
        return <TiltedFrame key={index} color={frameColor}>{image}</TiltedFrame>;
      default:
        return <SimpleFrame key={index} color={frameColor}>{image}</SimpleFrame>;
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-md py-4 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            スマホアプリのスクショ作成ツール
          </h1>
        </div>
      </header>

      <section className="text-center py-10 bg-white">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          魅力的なアプリストアのスクリーンショットを数秒で作成
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          デザインスキルは不要です。スクリーンショットをアップロードし、タイトルを追加するだけで、ストアで映える美しい画像が完成します。
        </p>
      </section>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 p-4 sm:p-8">
        <section className="lg:col-span-1 bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">エディタ</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="upload" className="block text-sm font-medium text-gray-700 mb-1">
                スクリーンショットをアップロード
              </label>
              <input
                id="upload"
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
              />
            </div>
            <div>
              <label htmlFor="frame" className="block text-sm font-medium text-gray-700">
                フレームを選択
              </label>
              <select
                id="frame"
                value={frame}
                onChange={(e) => setFrame(e.target.value as FrameType)}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="simple">シンプル</option>
                <option value="hand" disabled>手で持つ（準備中）</option>
                <option value="tilted">傾き</option>
              </select>
            </div>
             <div>
                <label htmlFor="bgColor" className="block text-sm font-medium text-gray-700">
                    背景色
                </label>
                <input
                    type="color"
                    id="bgColor"
                    value={bgColor}
                    onChange={(e) => setBgColor(e.target.value)}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300"
                />
            </div>
            <div>
                <label htmlFor="frameColor" className="block text-sm font-medium text-gray-700">
                    フレームの色
                </label>
                <input
                    type="color"
                    id="frameColor"
                    value={frameColor}
                    onChange={(e) => setFrameColor(e.target.value)}
                    className="mt-1 block w-full h-10 rounded-md border-gray-300"
                />
            </div>
            <div>
              <button
                onClick={addTextElement}
                className="w-full bg-gray-200 text-gray-800 font-bold py-3 px-4 rounded-lg hover:bg-gray-300 transition-colors"
              >
                テキストを追加
              </button>
            </div>
            <button
              onClick={handleDownload}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'ダウンロード中...' : '画像をダウンロード'}
            </button>
          </div>
        </section>

        <section className="lg:col-span-2 bg-gray-200 rounded-lg shadow flex items-center justify-center p-4 sm:p-6 min-h-[400px]">
          <div ref={previewRef} style={{ backgroundColor:bgColor }} className="relative p-6 sm:p-10 inline-block">
            {textElements.map(el => (
              <DraggableText
                key={el.id}
                id={el.id}
                value={el.text}
                position={el.position}
                color={el.color}
                onChange={handleTextChange}
                onStop={handleTextStop}
                onColorChange={handleTextColorChange}
              />
            ))}
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {screenshots.length > 0 ? (
                screenshots.map(renderFrame)
              ) : (
                <div className="w-[250px] h-[500px] flex items-center justify-center">
                  <p className="text-gray-500 text-center px-4">ここに画像が表示されます</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-6 px-6 sm:px-8 text-center text-sm text-gray-500">
        <div className="space-x-4">
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">利用規約</a>
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">プライバシーポリシー</a>
        </div>
        <p className="mt-4">&copy; 2024 スクリーンショット作成ツール. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
