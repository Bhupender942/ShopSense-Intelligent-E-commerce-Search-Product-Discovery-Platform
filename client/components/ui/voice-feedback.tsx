import React, { useEffect, useState } from "react";

interface VoiceFeedbackProps {
  isActive: boolean;
}

export const VoiceFeedback: React.FC<VoiceFeedbackProps> = ({ isActive }) => {
  const [levels, setLevels] = useState<number[]>([
    1, 2, 1, 3, 2, 1, 2, 3, 2, 1,
  ]);

  // Simulate microphone input levels when active
  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setLevels((prev) => {
        const newLevels = [...prev];
        for (let i = 0; i < newLevels.length; i++) {
          newLevels[i] = Math.floor(Math.random() * 5) + 1; // Random level between 1-5
        }
        return newLevels;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center">
        <div className="text-lg font-medium mb-4 text-flipkart-blue">
          Listening...
        </div>

        <div className="flex items-end h-16 space-x-1 mb-4">
          {levels.map((level, index) => (
            <div
              key={index}
              className="w-2 bg-flipkart-blue rounded-full transition-all duration-150 ease-in-out"
              style={{ height: `${level * 20}%` }}
            />
          ))}
        </div>

        <div className="text-sm text-gray-500">Speak now</div>
      </div>
    </div>
  );
};
