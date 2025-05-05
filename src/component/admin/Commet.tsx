import React, { useState, useEffect } from "react";

interface CommetProps {
  color?: string;
  size?: "small" | "medium" | "large";
  text?: string;
  textColor?: string;
}

const Commet: React.FC<CommetProps> = ({
  color = "#32cd32",
  size = "medium",
  text = "Loading...",
  textColor = "#333",
}) => {
  const [position, setPosition] = useState<number>(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prev) => (prev + 1) % 100);
    }, 30);

    return () => clearInterval(interval);
  }, []);

  // Size mapping
  const sizeMap = {
    small: { ball: 8, trail: 20, container: 100 },
    medium: { ball: 12, trail: 30, container: 150 },
    large: { ball: 16, trail: 40, container: 200 },
  };

  const { ball, trail, container } = sizeMap[size];

  return (
    <div className="flex flex-col items-center justify-center">
      <div
        className="relative"
        style={{
          width: `${container}px`,
          height: `${container}px`,
        }}
      >
        <div
          className="absolute rounded-full animate-pulse"
          style={{
            width: `${ball}px`,
            height: `${ball}px`,
            backgroundColor: color,
            boxShadow: `0 0 ${trail}px ${trail / 2}px ${color}`,
            top: `${
              (Math.sin((position * Math.PI) / 50) * container) / 3 +
              container / 2
            }px`,
            left: `${position}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 10,
          }}
        />
        <div
          className="absolute rounded-full blur-sm"
          style={{
            width: `${ball * 1.5}px`,
            height: `${ball * 1.5}px`,
            backgroundColor: color,
            opacity: 0.3,
            top: `${
              (Math.sin((position * Math.PI) / 50) * container) / 3 +
              container / 2
            }px`,
            left: `${position}%`,
            transform: "translate(-50%, -50%)",
            zIndex: 5,
          }}
        />
      </div>
      {text && (
        <div
          className="mt-4 text-center font-medium animate-pulse"
          style={{ color: textColor }}
        >
          {text}
        </div>
      )}
    </div>
  );
};

export default Commet;
