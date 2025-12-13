'use client';

import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';

export default function Home() {
  const [screenshots, setScreenshots] = useState<string[]>([]);
  const [title, setTitle] = useState('Your Title Here');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [isLoading, setIsLoading] = useState(false);

  const previewRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      const fileArray = Array.from(files);
      // Filter for image files only
      const imageFiles = fileArray.filter(file => file.type.startsWith('image/'));

      if (imageFiles.length !== fileArray.length) {
        alert('Please select only image files.');
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
        link.download = 'carousel-screenshot.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
        setIsLoading(false);
      }).catch(err => {
        console.error("Error generating image:", err);
        alert("Sorry, an error occurred while generating the image.");
        setIsLoading(false);
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 font-sans">
      <header className="bg-white shadow-md py-4 px-6 sm:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Mobile App Screenshot Generator
          </h1>
        </div>
      </header>

      {/* Hero Section */}
      <section className="text-center py-10 bg-white">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900">
          Create Stunning App Store Screenshots in Seconds
        </h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-500">
          No design skills needed. Just upload your screenshots, add a title, and download a beautiful, store-ready image.
        </p>
      </section>

      <main className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 p-4 sm:p-8">
        <section className="lg:col-span-1 bg-white rounded-lg shadow p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Editor</h2>
          <div className="space-y-6">
            <div>
              <label htmlFor="upload" className="block text-sm font-medium text-gray-700 mb-1">
                Upload Screenshots
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
                Title
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
                    Background Color
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
              onClick={handleDownload}
              disabled={isLoading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Downloading...' : 'Download Image'}
            </button>
          </div>
        </section>

        <section className="lg:col-span-2 bg-gray-200 rounded-lg shadow flex items-center justify-center p-4 sm:p-6 min-h-[400px]">
          <div ref={previewRef} style={{ backgroundColor: bgColor }} className="p-6 sm:p-10 inline-block">
            <h2 className="text-2xl sm:text-3xl font-bold text-center mb-6">{title}</h2>
            <div className="flex space-x-4 overflow-x-auto pb-4">
              {screenshots.length > 0 ? (
                screenshots.map((src, index) => (
                  <div key={index} className="flex-shrink-0 w-[200px] h-[400px] sm:w-[250px] sm:h-[500px] bg-white rounded-[24px] sm:rounded-[30px] p-2 border-[8px] sm:border-[10px] border-black overflow-hidden shadow-lg">
                    <img src={src} alt={`App screenshot ${index + 1}`} className="w-full h-full object-cover rounded-[16px] sm:rounded-[20px]" />
                  </div>
                ))
              ) : (
                <div className="w-[200px] h-[400px] sm:w-[250px] sm:h-[500px] bg-white rounded-[24px] sm:rounded-[30px] p-2 border-[8px] sm:border-[10px] border-black overflow-hidden flex items-center justify-center">
                  <p className="text-gray-500 text-center px-4">Your images will appear here</p>
                </div>
              )}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-white py-6 px-6 sm:px-8 text-center text-sm text-gray-500">
        <div className="space-x-4">
          <a href="/terms" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">Terms of Service</a>
          <a href="/privacy" target="_blank" rel="noopener noreferrer" className="hover:text-gray-800">Privacy Policy</a>
        </div>
        <p className="mt-4">&copy; 2024 Screenshot Generator. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
