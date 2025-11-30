interface FrameProps {
  screenshots: string[];
}

export default function SimplePhone({ screenshots }: FrameProps) {
  return (
    <div className="flex space-x-4">
      {screenshots.length > 0 ? (
        screenshots.map((src, index) => (
          <div key={index} className="w-[250px] h-[500px] bg-black rounded-[30px] p-2 border-[10px] border-gray-800 overflow-hidden shadow-lg mx-auto">
            <img src={src} alt={`App screenshot ${index + 1}`} className="w-full h-full object-cover rounded-[20px]" />
          </div>
        ))
      ) : (
        <div className="w-[250px] h-[500px] bg-black rounded-[30px] p-2 border-[10px] border-gray-800 overflow-hidden flex items-center justify-center mx-auto">
          <p className="text-gray-400 text-center px-4">ここに画像が表示されます</p>
        </div>
      )}
    </div>
  );
}
