import React, { useState, useEffect } from "react";
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

  useEffect(() => {
    setSelected(propSelected);
  }, [propSelected, question]);

  const handleSelect = (index: number) => {
    setSelected(index);
    onSelect?.(index);
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
