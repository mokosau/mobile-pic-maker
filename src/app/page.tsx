'use client';

import { useState, useRef, ComponentType } from 'react';
import html2canvas from 'html2canvas';
import Footer from '@/components/Footer';
import ImageCropper from '@/components/ImageCropper';
import { Area } from 'react-easy-crop';
import Draggable from 'react-draggable';

// Frame components
import SimplePhone from '@/components/frames/SimplePhone';
import PhoneInHand from '@/components/frames/PhoneInHand';
import SideBySide from '@/components/frames/SideBySide';

// Helper function to crop the image using canvas
const getCroppedImg = (imageSrc: string, pixelCrop: Area): Promise<string> => {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.src = imageSrc;
    image.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        return reject(new Error('Failed to get canvas context'));
      }

      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      resolve(canvas.toDataURL('image/png'));
    };
    image.onerror = (error) => reject(error);
  });
};

interface TextElement {
  id: number;
  text: string;
  position: { x: number; y: number };
}

interface FrameComponentProps {
  screenshots: string[];
}

const frameComponents: { [key: string]: ComponentType<FrameComponentProps> } = {
  'シンプル': SimplePhone,
  '手持ち': PhoneInHand,
  '横並び': SideBySide,
};

export default function Home() {
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [title, setTitle] = useState('ここにタイトル');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isLoading, setIsLoading] = useState(false);
  const [editingImage, setEditingImage] = useState<string | null>(null);
  const [editingImageIndex, setEditingImageIndex] = useState<number | null>(null);
  const [textElements, setTextElements] = useState<TextElement[]>([]);
  const [selectedFrame, setSelectedFrame] = useState('シンプル');

  const previewRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

      if (imageFiles.length !== fileArray.length) {
        alert('画像ファイルのみを選択してください。');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setEditingImage(imageUrl);
        setEditingImageIndex(screenshots.length);
      };
      reader.readAsDataURL(imageFiles[0]);
    }
  };

  const handleCropComplete = async (croppedAreaPixels: Area) => {
    if (editingImage && editingImageIndex !== null) {
      try {
        const croppedImage = await getCroppedImg(editingImage, croppedAreaPixels);
        const newScreenshots = [...screenshots];
        newScreenshots[editingImageIndex] = croppedImage;
        setScreenshots(newScreenshots);
      } catch (e) {
        console.error(e);
      }
    }
    setEditingImage(null);
    setEditingImageIndex(null);
  };

  const addTextElement = () => {
    const newText: TextElement = {
      id: Date.now(),
      text: '新しいテキスト',
      position: { x: 50, y: 50 },
    };
    setTextElements([...textElements, newText]);
  };

  const handleTextChange = (id: number, newText: string) => {
    const updatedElements = textElements.map(el =>
      el.id === id ? { ...el, text: newText } : el
    );
    setTextElements(updatedElements);
  };

  const handleDragStop = (id: number, e: any, data: { x: number, y: number }) => {
    const updatedElements = textElements.map(el =>
      el.id === id ? { ...el, position: { x: data.x, y: data.y } } : el
    );
    setTextElements(updatedElements);
  };

  const handleDownload = () => {
    if (previewRef.current) {
      setIsLoading(true);
      html2canvas(previewRef.current, { useCORS: true, background: undefined }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'screenshot.png';
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

  const FrameComponent = frameComponents[selectedFrame];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      {editingImage && (
        <ImageCropper
          image={editingImage}
          onCropComplete={handleCropComplete}
          onClose={() => setEditingImage(null)}
        />
      )}
      <header className="bg-white shadow-md py-4 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            モバイルアプリ スクリーンショット生成ツール
          </h1>
        </div>
      </header>

      <section className="text-center py-10 bg-white">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          魅力的なアプリストアのスクリーンショットを数秒で作成
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          デザインスキルは不要です。スクリーンショットをアップロードし、テキストを追加するだけで、ストア向けの美しい画像をダウンロードできます。
        </p>
      </section>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 p-4 sm:p-8">
        <section className="lg:col-span-1 bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">エディター</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">フレームテンプレート</label>
              <div className="mt-2 grid grid-cols-3 gap-2">
                {Object.keys(frameComponents).map(frameKey => (
                  <button
                    key={frameKey}
                    onClick={() => setSelectedFrame(frameKey)}
                    className={`p-2 rounded-md border-2 ${selectedFrame === frameKey ? 'border-blue-500' : 'border-gray-200'}`}
                  >
                    <span className="text-xs">{frameKey}</span>
                  </button>
                ))}
              </div>
            </div>

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
              <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                タイトル
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
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
            <button
              onClick={addTextElement}
              className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition-colors"
            >
              テキストを追加
            </button>
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
          <div ref={previewRef} style={{ backgroundColor: bgColor }} className="p-6 sm:p-10 inline-block relative overflow-hidden">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">{title}</h2>

            <FrameComponent screenshots={screenshots} />

            {textElements.map((el) => (
              <Draggable
                key={el.id}
                position={el.position}
                onStop={(e, data) => handleDragStop(el.id, e, data)}
              >
                <div className="absolute cursor-move p-2" style={{ border: '1px dashed #ccc' }}>
                  <input
                    type="text"
                    value={el.text}
                    onChange={(e) => handleTextChange(el.id, e.target.value)}
                    className="bg-transparent text-black text-lg p-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
              </Draggable>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
