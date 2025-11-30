'use client';

import React, { useState, useRef, useCallback } from 'react';
import html2canvas from 'html2canvas';
import SimpleFrame from '@/components/frames/SimpleFrame';
import PhoneInHand from '@/components/frames/PhoneInHand';
import SideBySide from '@/components/frames/SideBySide';
import DraggableText from '@/components/DraggableText';
import CropEasy from '@/components/CropEasy';

type FrameType = 'simple' | 'phone-in-hand' | 'side-by-side';

export default function Home() {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [title, setTitle] = useState('ここにタイトル');
  const [backgroundColor, setBackgroundColor] = useState('#000000');
  const [frame, setFrame] = useState<FrameType>('simple');
  const [texts, setTexts] = useState<{ id: number; content: string; position: { x: number; y: number } }[]>([]);
  const [openCrop, setOpenCrop] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);

  const previewRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      const imageUrl = URL.createObjectURL(file);
      setImageToCrop(imageUrl);
      setOpenCrop(true);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleBackgroundColorChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setBackgroundColor(event.target.value);
  };

  const downloadImage = useCallback(() => {
    if (previewRef.current) {
      html2canvas(previewRef.current, {
        backgroundColor: null,
        scale: 2,
      }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  }, []);

  const addText = () => {
    setTexts([...texts, { id: Date.now(), content: '新しいテキスト', position: { x: 50, y: 50 } }]);
  };

  const handleTextChange = (id: number, newContent: string) => {
    setTexts(texts.map(text => text.id === id ? { ...text, content: newContent } : text));
  };

  const handleTextDrag = (id: number, newPosition: { x: number; y: number }) => {
    setTexts(texts.map(text => text.id === id ? { ...text, position: newPosition } : text));
  };

  const onCropComplete = (croppedImageUrl: string) => {
    setUploadedImages(prev => [...prev, croppedImageUrl]);
    setOpenCrop(false);
    setImageToCrop(null);
    if(fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const renderFrame = () => {
    const frameProps = {
      title: title,
      backgroundColor: backgroundColor,
    };

    switch (frame) {
      case 'simple':
        return <SimpleFrame {...frameProps} uploadedImage={uploadedImages[0] || null} />;
      case 'phone-in-hand':
        return <PhoneInHand {...frameProps} uploadedImage={uploadedImages[0] || null} />;
      case 'side-by-side':
        return <SideBySide {...frameProps} uploadedImage1={uploadedImages[0] || null} uploadedImage2={uploadedImages[1] || null} />;
      default:
        return null;
    }
  };

  if (openCrop && imageToCrop) {
    return (
      <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50">
        <div className="bg-gray-800 p-4 rounded-lg w-full max-w-4xl h-full max-h-[80vh]">
          <h2 className="text-xl text-white mb-4">画像を切り抜き</h2>
          <CropEasy
            image={imageToCrop}
            onComplete={onCropComplete}
            onCancel={() => {
              setOpenCrop(false);
              setImageToCrop(null);
            }}
          />
        </div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 md:p-24 bg-gray-900 text-white">
      <div className="z-10 w-full max-w-7xl items-start justify-between font-mono text-sm lg:flex">
        <div className="lg:w-1/3 pr-8 space-y-6">
          <h1 className="text-4xl font-bold mb-4">モバイルアプリ スクリーンショット生成ツール</h1>
          <p className="text-gray-400 mb-8">魅力的なアプリストアのスクリーンショットを数秒で作成</p>

          <div className="bg-gray-800 p-6 rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">エディター</h2>

            <div className="mb-4">
              <label className="block mb-2 font-medium">フレームテンプレート</label>
              <div className="flex space-x-2">
                <button onClick={() => setFrame('simple')} className={`px-4 py-2 rounded ${frame === 'simple' ? 'bg-blue-600' : 'bg-gray-700'}`}>シンプル</button>
                <button onClick={() => setFrame('phone-in-hand')} className={`px-4 py-2 rounded ${frame === 'phone-in-hand' ? 'bg-blue-600' : 'bg-gray-700'}`}>手持ち</button>
                <button onClick={() => setFrame('side-by-side')} className={`px-4 py-2 rounded ${frame === 'side-by-side' ? 'bg-blue-600' : 'bg-gray-700'}`}>横並び</button>
              </div>
            </div>

            <div className="mb-4">
              <label className="block mb-2 font-medium">スクリーンショットをアップロード</label>
              <input ref={fileInputRef} type="file" onChange={handleFileChange} className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
              <p className="text-xs text-gray-500 mt-1">
                {frame === 'side-by-side' ? '2枚の画像が必要です。1枚ずつアップロードしてください。' : '1枚の画像が必要です。'}
              </p>
            </div>

            <div className="mb-4">
              <label htmlFor="title" className="block mb-2 font-medium">タイトル</label>
              <input type="text" id="title" value={title} onChange={handleTitleChange} className="w-full p-2 rounded bg-gray-700 border border-gray-600" />
            </div>

            <div className="mb-4">
              <label htmlFor="backgroundColor" className="block mb-2 font-medium">背景色</label>
              <input type="color" id="backgroundColor" value={backgroundColor} onChange={handleBackgroundColorChange} className="w-full h-10 p-1 rounded bg-gray-700 border border-gray-600" />
            </div>

            <button onClick={addText} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mb-4">
              テキストを追加
            </button>
            <button onClick={downloadImage} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
              画像をダウンロード
            </button>
          </div>
        </div>

        <div
          ref={previewRef}
          className="lg:w-2/3 mt-10 lg:mt-0 flex items-center justify-center p-8 rounded-lg relative overflow-hidden"
          style={{ backgroundColor }}
        >
          {renderFrame()}
          {texts.map((text) => (
            <DraggableText
              key={text.id}
              id={text.id}
              initialContent={text.content}
              initialPosition={text.position}
              onContentChange={handleTextChange}
              onPositionChange={handleTextDrag}
            />
          ))}
        </div>
      </div>
    </main>
  );
}
