import React from 'react';

type SimpleFrameProps = {
  children: React.ReactNode;
};

const SimpleFrame: React.FC<SimpleFrameProps> = ({ children }) => {
  return (
    <div className="w-[270px] h-[585px] p-4 bg-white rounded-[40px] shadow-lg overflow-hidden">
      <div className="w-full h-full rounded-[20px] overflow-hidden">
        {children}
      </div>
    </div>
  );
};

export default SimpleFrame;
