interface FrameProps {
  screenshots: string[];
}

export default function SideBySide({ screenshots }: FrameProps) {
  return (
    <div className="flex space-x-8">
      {/* Show up to 2 screenshots */}
      {screenshots.slice(0, 2).map((src, index) => (
        <div key={index} className="w-[200px] h-[400px] bg-white rounded-xl p-2 shadow-2xl transform hover:scale-105 transition-transform">
           <img src={src} alt={`App screenshot ${index + 1}`} className="w-full h-full object-cover rounded-md" />
        </div>
      ))}
      {screenshots.length === 0 && (
        <div className="w-[200px] h-[400px] bg-white rounded-xl p-2 shadow-2xl flex items-center justify-center">
            <p className="text-gray-500 text-center">Your image here</p>
        </div>
      )}
    </div>
  );
}
