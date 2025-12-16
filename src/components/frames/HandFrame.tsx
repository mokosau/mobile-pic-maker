import React from 'react';

type Props = {
  children: React.ReactNode;
  color: string;
};

const HandFrame: React.FC<Props> = ({ children, color }) => {
  return (
    <div
      className="flex-shrink-0 w-[250px] h-[500px] bg-white rounded-[30px] p-2 border-[10px] overflow-hidden shadow-lg"
      style={{ borderColor: color }}
    >
      <div className="w-full h-full overflow-hidden rounded-[20px]">
        {children}
      </div>
    </div>
  );
};

export default HandFrame;
