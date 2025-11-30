'use client';

import React from 'react';
import Image from 'next/image';

interface PhoneInHandProps {
  uploadedImage: string | null;
  title: string;
}

const PhoneInHand: React.FC<PhoneInHandProps> = ({ uploadedImage, title }) => {
  return (
    <div className="relative w-[400px] h-[600px] flex items-center justify-center">
      {/* Hand and Phone background image */}
      <Image
        src="/phone-in-hand.svg"
        alt="Hand holding a phone"
        layout="fill"
        objectFit="contain"
      />

      {/* Uploaded screenshot */}
      {uploadedImage && (
        <div
          className="absolute"
          style={{
            // The SVG is 800x600 but fits in a 400x600 container.
            // It's contained, so its final size is 400x300, centered vertically.
            // Top offset of the SVG = (600 - 300) / 2 = 150px.
            //
            // Phone screen in SVG: x=300, y=50, w=200, h=400.
            // Scale factor = 400 / 800 = 0.5.
            //
            // Final position and size in pixels:
            // top = 150px (svg offset) + (50 * 0.5)px = 175px
            // left = (300 * 0.5)px = 150px
            // width = (200 * 0.5)px = 100px
            // height = (400 * 0.5)px = 200px
            top: '175px',
            left: '150px',
            width: '100px',
            height: '200px',
          }}
        >
          <Image
            src={uploadedImage}
            alt="Uploaded screenshot"
            layout="fill"
            objectFit="cover" // Use cover to fill the area, contain might leave gaps
            className="rounded-[10px]"
          />
        </div>
      )}

      {/* Title */}
      <div className="absolute top-[100px] text-center w-full">
        <h2 className="text-3xl font-bold text-white">{title}</h2>
      </div>
    </div>
  );
};

export default PhoneInHand;
