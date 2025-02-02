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
    <div className="flex justify-center items-center max-w-200 min-w-5 m-auto ">
      <div className="text-left h-3/4 bg-gradient-to-r from-[#1E6373] to-[#362A64] pt-10 p-3 w-4/5 rounded-2xl min-w-5">
        <h2 className="text-2xl mb-15 text-white min-w-5">{question}</h2>
        <div className="flex justify-center items-center min-w-5">
          <div className="flex grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-5">
            {options.map((option, index) => {
              let bgColor = "bg-white opacity-20";

              if (selected === index) {
                bgColor = "bg-white opacity-50";
              }

              if (correctIndex !== undefined) {
                bgColor =
                  index === correctIndex ? "bg-green-500" : "bg-red-500";
              }

              return (
                <button
                  key={index}
                  className={`${bgColor} text-black rounded-md h-12 shadow-md hover:opacity-35 m-1 min-w-5`}
                  onClick={() => handleClick(index)}
                  disabled={!clickable}
                >
                  {option}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
