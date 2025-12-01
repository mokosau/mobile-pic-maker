import React from 'react';

type Props = {
  children: React.ReactNode;
};

const SimpleFrame: React.FC<Props> = ({ children }) => {
  return (
    <div className="flex-shrink-0 w-[250px] h-[500px] bg-white rounded-[30px] p-2 border-[10px] border-black overflow-hidden shadow-lg">
      <div className="w-full h-full overflow-hidden rounded-[20px]">
        {children}
      </div>
    </div>
  );
};

export default SimpleFrame;
