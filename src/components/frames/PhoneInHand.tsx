interface FrameProps {
  screenshots: string[];
}

export default function PhoneInHand({ screenshots }: FrameProps) {
  // This component assumes only one screenshot for simplicity
  const screenshot = screenshots[0];

  return (
    <div
      className="w-[300px] h-[600px] bg-gray-400 bg-cover bg-center rounded-lg shadow-lg flex items-center justify-center"
      // style={{ backgroundImage: "url('/hand-holding-phone.png')" }} // Placeholder for the hand image
    >
      <div className="w-[140px] h-[300px] relative mt-[-40px]">
        {screenshot ? (
          <img src={screenshot} alt="App screenshot" className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <p className="text-white text-xs text-center">Your image here</p>
          </div>
        )}
      </div>
    </div>
  );
}
