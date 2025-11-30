'use client';

import React from 'react';
import Image from 'next/image';

interface SideBySideProps {
  uploadedImage1: string | null;
  uploadedImage2: string | null;
  title: string;
}

const SideBySide: React.FC<SideBySideProps> = ({ uploadedImage1, uploadedImage2, title }) => {
  return (
    <div className="relative w-full max-w-4xl">
       <h2 className="text-3xl font-bold text-white text-center mb-8">{title}</h2>
      <div className="flex justify-center items-center gap-8">
        <div className="w-1/2 aspect-[9/16] relative rounded-2xl overflow-hidden shadow-2xl">
          {uploadedImage1 ? (
            <Image
              src={uploadedImage1}
              alt="Uploaded screenshot 1"
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">画像1</span>
            </div>
          )}
        </div>
        <div className="w-1/2 aspect-[9/16] relative rounded-2xl overflow-hidden shadow-2xl">
          {uploadedImage2 ? (
            <Image
              src={uploadedImage2}
              alt="Uploaded screenshot 2"
              layout="fill"
              objectFit="cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-700 flex items-center justify-center">
              <span className="text-gray-400">画像2</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SideBySide;
