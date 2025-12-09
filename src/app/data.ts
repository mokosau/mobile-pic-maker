// src/app/data.ts

export const deviceFrames = [
  { id: 'iphone15', name: 'iPhone 15', frameUrl: '/frames/iphone-15.png', width: 1170, height: 2532 },
  { id: 'iphone14pro', name: 'iPhone 14 Pro', frameUrl: '/frames/iphone-14-pro.png', width: 1179, height: 2556 },
  { id: 'androidpixel', name: 'Android Pixel', frameUrl: '/frames/android-pixel.png', width: 1080, height: 2400 },
];

export const textLayouts = {
  'layout1': [
    { id: 1, value: 'キャッチーな見出し', style: { top: '10%', left: '50%', transform: 'translateX(-50%)', fontSize: '48px', fontWeight: 'bold' } },
    { id: 2, value: '補足テキストをここに', style: { top: '20%', left: '50%', transform: 'translateX(-50%)', fontSize: '24px' } },
  ],
  'layout2': [
    { id: 1, value: '画面下部のテキスト', style: { bottom: '10%', left: '50%', transform: 'translateX(-50%)', fontSize: '36px', color: '#f0f0f0' } },
  ],
  'layout3': [
    { id: 1, value: 'テキストを中央に', style: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '60px', fontWeight: 'bold' } },
  ]
};
