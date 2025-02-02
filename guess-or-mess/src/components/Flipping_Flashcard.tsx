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
}

const FlippingFlashcard: React.FC<FlippingFlashcardProps> = ({
  question,
  options,
  selected: propSelected,
  correctIndex,
  onSelect,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [countdown, setCountdown] = useState(10);
  const [selected, setSelected] = useState<number | null>(propSelected);

  useEffect(() => {
    if (countdown === 0) return;

    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setIsFlipped(true);
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [countdown]);

  const handleSelect = (index: number) => {
    setSelected(index);
    if (onSelect) onSelect(index);
  };

  return (
    <div>
      {countdown > 0 && (
        <p className="text-xl font-bold mt-4">You have {countdown} seconds to answer!</p>
      )}
      <ReactCardFlip isFlipped={isFlipped} flipDirection="vertical">
        <div className="card front text-center">
          <FlashCard
            question={question}
            options={options}
            clickable={countdown > 0}
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
