'use client';

import React from 'react';
import Draggable, { DraggableEventHandler } from 'react-draggable';

interface Props {
  id: number;
  value: string;
  position: { x: number; y: number };
  color: string;
  onChange: (id: number, newText: string) => void;
  onStop: (id: number, position: { x: number; y: number }) => void;
  onColorChange: (id: number, newColor: string) => void;
}

const DraggableText: React.FC<Props> = ({ id, value, position, color, onChange, onStop, onColorChange }) => {
  const handleDragStop: DraggableEventHandler = (e, data) => {
    onStop(id, { x: data.x, y: data.y });
  };

  return (
    <Draggable
      defaultPosition={position}
      onStop={handleDragStop}
      bounds="parent"
      handle=".handle"
    >
      <div className="absolute p-2 flex items-center" style={{'border': "1px dashed #000"}}>
        <div className="handle cursor-move pr-2">⠿</div>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(id, e.target.value)}
          className="bg-transparent border-none focus:outline-none focus:ring-0"
          style={{ color: color }}
          onClick={(e) => e.stopPropagation()}
        />
        <input
          type="color"
          value={color}
          onChange={(e) => onColorChange(id, e.target.value)}
          className="w-6 h-6 border-none cursor-pointer"
          onClick={(e) => e.stopPropagation()}
        />
      </div>
    </Draggable>
  );
};

export default DraggableText;
