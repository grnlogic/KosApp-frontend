import React, { useState, useEffect } from "react";

interface BlinkBlurProps {
  color: string[];
}

export const BlinkBlur: React.FC<BlinkBlurProps> = ({
  color = ["#32cd32", "#327fcd", "#cd32cd", "#cd8032"],
}) => {
  const [currentColorIndex, setCurrentColorIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentColorIndex((prevIndex) => (prevIndex + 1) % color.length);
    }, 700);

    return () => clearInterval(interval);
  }, [color.length]);

  return (
    <div className="flex justify-center items-center">
      <div
        className="w-16 h-16 rounded-full animate-pulse"
        style={{
          backgroundColor: color[currentColorIndex],
          boxShadow: `0 0 15px 5px ${color[currentColorIndex]}`,
          transition: "all 0.5s ease",
        }}
      />
    </div>
  );
};

export default BlinkBlur;
