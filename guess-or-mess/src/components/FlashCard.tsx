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
    <div className="flex justify-center items-center min-w-5 m-auto">
      <div className="text-left h-3/4 bg-gradient-to-r from-[#1E6373] to-[#362A64] pt-10 p-4 w-4/5 rounded-xl">
        <h2 className="text-2xl mb-10 text-white min-w-5">{question}</h2>
        <div className="flex justify-center items-center min-w-5">
          <div className="flex grid grid-cols-1 sm:grid-cols-2 gap-4 w-full min-w-5">
            {options.map((option, index) => {
              let bgColor = "bg-white opacity-20";

              if (selected === index) {
                bgColor = "bg-white opacity-50";
              }

              if (correctIndex !== undefined) {
                bgColor =
                  index === correctIndex ? " text-white bg-gradient-to-r from-[#17EE6C] to-[#3E27E9] hover:opacity-100" : " text-white bg-gradient-to-r from-[#FFCD3C] to-[#FA0D5D]  hover:opacity-100";
              }

              return (
                <button
                  key={index}
                  className={`${bgColor} text-black rounded-xl h-20 shadow-md hover:opacity-35 m-1 min-w-5 px-4 overflow-y-auto`}
                  onClick={() => handleClick(index)}
                  disabled={!clickable}
                  style={{ lineHeight: "1.2" }} // Ensure text is spaced well
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
