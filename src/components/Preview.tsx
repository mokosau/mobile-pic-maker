"use client";

type PreviewProps = {
  screenshotUrl: string | null;
  frameUrl: string;
  texts: {
    id: number;
    value: string;
    style: React.CSSProperties;
  }[];
  containerStyle: React.CSSProperties;
};

const Preview = ({ screenshotUrl, frameUrl, texts, containerStyle }: PreviewProps) => {
  return (
    <div id="screenshot-preview" className="relative w-full h-full" style={containerStyle}>
      {screenshotUrl && (
        <img
          src={screenshotUrl}
          alt="Screenshot"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
          }}
        />
      )}
      <img
        src={frameUrl}
        alt="Device Frame"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          pointerEvents: 'none', // Allow interaction with elements behind the frame
        }}
      />
      {texts.map((text) => (
        <div
          key={text.id}
          className="absolute font-display text-white"
          style={text.style}
        >
          {text.value}
        </div>
      ))}
    </div>
  );
};

export default Preview;
