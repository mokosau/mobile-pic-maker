interface FrameProps {
  screenshots: string[];
}

export default function SimplePhone({ screenshots }: FrameProps) {
  return (
    <div className="flex space-x-4 overflow-x-auto pb-4">
      {screenshots.length > 0 ? (
        screenshots.map((src, index) => (
          <div key={index} className="flex-shrink-0 w-[200px] h-[400px] sm:w-[250px] sm:h-[500px] bg-white rounded-[24px] sm:rounded-[30px] p-2 border-[8px] sm:border-[10px] border-black overflow-hidden shadow-lg">
            <img src={src} alt={`App screenshot ${index + 1}`} className="w-full h-full object-cover rounded-[16px] sm:rounded-[20px]" />
          </div>
        ))
      ) : (
        <div className="w-[200px] h-[400px] sm:w-[250px] sm:h-[500px] bg-white rounded-[24px] sm:rounded-[30px] p-2 border-[8px] sm:border-[10px] border-black overflow-hidden flex items-center justify-center">
          <p className="text-gray-500 text-center px-4">Your images will appear here</p>
        </div>
      )}
    </div>
  );
}
