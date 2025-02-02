import React, { useState } from "react";
import ReactCardFlip from "react-card-flip";
import FlashCard from "./FlashCard";

interface FlippingFlashcardProps {
  question: string;
  options: string[];
  clickable: boolean;
  selected: number | null;
  correctIndex?: number;
  onSelect?: (index: number) => void;
  isFlipped: boolean; 
}

const FlippingFlashcard: React.FC<FlippingFlashcardProps> = ({
  question,
  options,
  selected: propSelected,
  correctIndex,
  onSelect,
  isFlipped,
}) => {
  const [selected, setSelected] = useState<number | null>(propSelected);

  const handleSelect = (index: number) => {
    setSelected(index);
    if (onSelect) onSelect(index);
  };

  return (
    <div>
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
        <div className="card front text-center">
          <FlashCard
            question={question}
            options={options}
            clickable={true}
            selected={selected}
            onSelect={handleSelect}
          />
        </div>

        <div className="card back text-center">
          <FlashCard
            question={question}
            options={options}
            correctIndex={correctIndex}
            clickable={false}
            selected={selected}
          />
        </div>
      </ReactCardFlip>
    </div>
  );
};

export default FlippingFlashcard;
