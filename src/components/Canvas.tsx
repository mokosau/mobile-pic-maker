'use client';

import { useEffect, useRef } from 'react';

// 定数
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

const SCREENSHOT_CONFIG = {
  top: 100,
  left: 50,
  width: 980,
  height: 1720,
};

type CanvasProps = {
  frameUrl: string;
  screenshotUrl: string | null;
  addTextTrigger: number;
  onObjectSelected: (obj: any) => void;
  onSelectionCleared: () => void;
  activeObjectProps: { fill?: string; fontSize?: number } | null;
  exportTrigger: number;
};

const Canvas = ({
  frameUrl,
  screenshotUrl,
  addTextTrigger,
  onObjectSelected,
  onSelectionCleared,
  activeObjectProps,
  exportTrigger,
}: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fabricCanvasRef = useRef<any | null>(null);
  const screenshotRef = useRef<any | null>(null);

  // キャンバスの初期化とイベントリスナーの設定
  useEffect(() => {
    import('fabric').then((fabricModule) => {
      const fabric = (fabricModule as any).default;
      if (canvasRef.current && !fabricCanvasRef.current) {
        const canvas = new fabric.Canvas(canvasRef.current, {
          width: CANVAS_WIDTH,
          height: CANVAS_HEIGHT,
        });
        fabricCanvasRef.current = canvas;

        canvas.on('selection:created', (e: any) => onObjectSelected(e.selected[0]));
        canvas.on('selection:updated', (e: any) => onObjectSelected(e.selected[0]));
        canvas.on('selection:cleared', () => onSelectionCleared());
      }
    });
    return () => {
      const canvas = fabricCanvasRef.current;
      if (canvas) {
        canvas.off('selection:created');
        canvas.off('selection:updated');
        canvas.off('selection:cleared');
        if (typeof canvas.dispose === 'function') {
          canvas.dispose();
          fabricCanvasRef.current = null;
        }
      }
    };
  }, [onObjectSelected, onSelectionCleared]);

  // フレーム画像の更新
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas || !frameUrl) return;

    import('fabric').then((fabricModule) => {
      const fabric = (fabricModule as any).default;
      fabric.Image.fromURL(frameUrl, (img: any) => {
        canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
          scaleX: CANVAS_WIDTH / (img.width || 1),
          scaleY: CANVAS_HEIGHT / (img.height || 1),
        });
      });
    });
  }, [frameUrl]);


  // スクリーンショットの追加・更新
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    if (!screenshotUrl) {
      if (screenshotRef.current) {
        canvas.remove(screenshotRef.current);
        screenshotRef.current = null;
      }
      return;
    }
    import('fabric').then((fabricModule) => {
      const fabric = (fabricModule as any).default;
      fabric.Image.fromURL(screenshotUrl, (img: any) => {
        if (screenshotRef.current) {
          canvas.remove(screenshotRef.current);
        }
        img.set({
          top: SCREENSHOT_CONFIG.top,
          left: SCREENSHOT_CONFIG.left,
          scaleX: SCREENSHOT_CONFIG.width / (img.width || 1),
          scaleY: SCREENSHOT_CONFIG.height / (img.height || 1),
        });
        canvas.add(img);
        canvas.sendToBack(img);
        screenshotRef.current = img;
      });
    });
  }, [screenshotUrl]);

  // テキストの追加
  useEffect(() => {
    if (addTextTrigger === 0) return;
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;
    import('fabric').then((fabricModule) => {
      const fabric = (fabricModule as any).default;
      const text = new fabric.IText('テキストを入力', {
        left: CANVAS_WIDTH / 2,
        top: CANVAS_HEIGHT / 2,
        originX: 'center',
        originY: 'center',
        fontSize: 80,
        fill: '#000000',
      });
      canvas.add(text);
      canvas.setActiveObject(text);
      canvas.renderAll();
    });
  }, [addTextTrigger]);

  // 選択中オブジェクトのプロパティ更新
  useEffect(() => {
    const canvas = fabricCanvasRef.current;
    const activeObject = canvas?.getActiveObject();
    if (!activeObject || !activeObjectProps) return;
    activeObject.set({
      fill: activeObjectProps.fill,
      fontSize: activeObjectProps.fontSize,
    });
    canvas.renderAll();
  }, [activeObjectProps]);

  // PNGエクスポート
  useEffect(() => {
    if (exportTrigger === 0) return;
    const canvas = fabricCanvasRef.current;
    if (!canvas) return;

    canvas.discardActiveObject();
    canvas.renderAll();

    const dataUrl = canvas.toDataURL({
      format: 'png',
      quality: 1.0,
    });

    const link = document.createElement('a');
    link.href = dataUrl;
    link.download = 'screenshot.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

  }, [exportTrigger]);

  return (
    <canvas
      ref={canvasRef}
      className="w-full max-w-sm md:max-w-md lg:max-w-lg"
    />
  );
};

export default Canvas;
