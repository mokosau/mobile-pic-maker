'use client';

import React, { useState } from 'react';
import Draggable from 'react-draggable';

const DraggableText = () => {
  const [text, setText] = useState('テキストを入力');

  return (
    <Draggable>
      <div className="absolute cursor-move p-2 border border-dashed border-gray-500">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="bg-transparent border-none focus:outline-none focus:ring-0"
          onClick={(e) => e.stopPropagation()} // ドラッグとクリックの競合を防ぐ
        />
      </div>
    </Draggable>
  );
};

export default DraggableText;
