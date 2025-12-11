"use client";

import React, { useState } from 'react';
import Draggable from 'react-draggable';

const DraggableText = () => {
  const [text, setText] = useState('ここにテキスト');
  const [isEditing, setIsEditing] = useState(false);
  const nodeRef = React.useRef(null);

  const handleDoubleClick = () => {
    setIsEditing(true);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
  };

  return (
    <Draggable nodeRef={nodeRef}>
      <div ref={nodeRef} onDoubleClick={handleDoubleClick} style={{ position: 'absolute', cursor: 'move', zIndex: 10 }}>
        {isEditing ? (
          <input
            type="text"
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            autoFocus
            className="bg-transparent border border-dashed border-white text-white p-1"
          />
        ) : (
          <div className="text-2xl font-bold p-1" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
            {text}
          </div>
        )}
      </div>
    </Draggable>
  );
};

export default DraggableText;
