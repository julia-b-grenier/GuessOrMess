import React from "react";

interface FlashCardProps {
  question: string;
  options: string[];
}

const FlashCard: React.FC<FlashCardProps> = ({ question, options }) => {
  return (
    <div style={{ border: "2px solid black", padding: "10px" }}>
      <h2 className="text-2xl font-mono">{question}</h2>
      <div className="grid grid-cols-2 gap-4 w-full mt-4">
        {options.map((option, index) => (
          <button
            key={index}
            className="bg-gray-700 text-white rounded-lg h-12 shadow-md hover:bg-gray-600"
          >
            {option}
          </button>
        ))}
      </div>
    </div>
  );
};

export default FlashCard;
