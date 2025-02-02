import React from "react";

interface FlashCardProps {
  question: string;
  options: string[];
  clickable: boolean;
  selected: number | null;
  correctIndex?: number;
  onSelect?: (index: number) => void;
}

const FlashCard: React.FC<FlashCardProps> = ({
  question,
  options,
  clickable,
  selected,
  correctIndex,
  onSelect,
}) => {
  const handleClick = (index: number) => {
    if (clickable && onSelect) {
      onSelect(index);
    }
  };

  return (
    <div className="border-2 border-black p-4">
      <h2 className="text-2xl font-mono">{question}</h2>
      <div className="grid grid-cols-2 gap-4 w-full mt-4">
        {options.map((option, index) => {
          let bgColor = "bg-gray-700"; 
          
          if (selected === index) {
            bgColor = "bg-blue-500"; 
          }

          if (correctIndex !== undefined) {
            bgColor = index === correctIndex ? "bg-green-500" : "bg-red-500";
          }

          return (
            <button
              key={index}
              className={`${bgColor} text-white rounded-lg h-12 shadow-md hover:bg-gray-600`}
              onClick={() => handleClick(index)}
              disabled={!clickable}
            >
              {option}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default FlashCard;
