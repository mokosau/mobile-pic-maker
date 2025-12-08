'use client';

import { useRef, useState, useEffect } from 'react';
import { Stage, Layer, Image as KonvaImage, Text as KonvaText } from 'react-konva';
import Konva from 'konva';
import useImage from 'use-image'; // 新しくインストールしたライブラリをインポート

// 定数
const CANVAS_WIDTH = 1080;
const CANVAS_HEIGHT = 1920;

// 自作のuseImageフックは削除

// テキストオブジェクトの型
type TextObject = {
  id: string;
  text: string;
  x: number;
  y: number;
  fontSize: number;
  fill: string;
  draggable: boolean;
};

type CanvasProps = {
  frameUrl: string;
  screenshotUrl: string | null;
  addTextTrigger: number;
  onObjectSelected: (obj: any) => void;
  onSelectionCleared: () => void;
  activeObjectProps: { id?: string; fill?: string; fontSize?: number } | null;
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
  const stageRef = useRef<Konva.Stage>(null);
  // use-imageライブラリを使用するように変更
  const [frameImage] = useImage(frameUrl, 'anonymous');
  const [screenshotImage] = useImage(screenshotUrl || '', 'anonymous');

  const [texts, setTexts] = useState<TextObject[]>([]);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);

  // テキスト追加
  useEffect(() => {
    if (addTextTrigger > 0) {
      const newText: TextObject = {
        id: `text-${Date.now()}`,
        text: 'テキストを入力',
        x: CANVAS_WIDTH / 2 - 150,
        y: CANVAS_HEIGHT / 2,
        fontSize: 80,
        fill: '#000000',
        draggable: true,
      };
      setTexts((prev) => [...prev, newText]);
      setSelectedShapeId(newText.id);
      onObjectSelected(newText);
    }
  }, [addTextTrigger, onObjectSelected]);

  // テキストのプロパティ更新
  useEffect(() => {
    if (activeObjectProps && selectedShapeId) {
      setTexts((prevTexts) =>
        prevTexts.map((text) =>
          text.id === selectedShapeId
            ? { ...text, ...activeObjectProps }
            : text
        )
      );
    }
  }, [activeObjectProps, selectedShapeId]);

  // PNGエクスポート
  useEffect(() => {
    if (exportTrigger > 0 && stageRef.current) {
        const stage = stageRef.current;
        const dataURL = stage.toDataURL({ mimeType: 'image/png', quality: 1 });
        const link = document.createElement('a');
        link.download = 'screenshot.png';
        link.href = dataURL;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
  }, [exportTrigger]);

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, id: string) => {
    const newTexts = texts.slice();
    const text = newTexts.find(t => t.id === id);
    if (text) {
        text.x = e.target.x();
        text.y = e.target.y();
        setTexts(newTexts);
    }
  };

  const checkDeselect = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedShapeId(null);
      onSelectionCleared();
    }
  };

  return (
    <Stage
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      ref={stageRef}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
      style={{
        width: '100%',
        maxWidth: '400px',
        height: 'auto',
      }}
    >
      <Layer>
        {/* フレーム画像 */}
        {frameImage && (
          <KonvaImage
            image={frameImage}
            width={CANVAS_WIDTH}
            height={CANVAS_HEIGHT}
            listening={false}
          />
        )}
        {/* スクリーンショット画像 */}
        {screenshotImage && (
           <KonvaImage
            image={screenshotImage}
            x={50}
            y={100}
            width={980}
            height={1720}
            listening={false}
          />
        )}
        {/* テキスト */}
        {texts.map((text, i) => (
          <KonvaText
            key={text.id}
            id={text.id}
            text={text.text}
            x={text.x}
            y={text.y}
            fontSize={text.fontSize}
            fill={text.fill}
            draggable={text.draggable}
            onDragEnd={(e) => handleDragEnd(e, text.id)}
            onClick={() => {
              setSelectedShapeId(text.id);
              onObjectSelected(text);
            }}
            onTap={() => {
                setSelectedShapeId(text.id);
                onObjectSelected(text);
            }}
          />
        ))}
      </Layer>
    </Stage>
  );
};

export default Canvas;
