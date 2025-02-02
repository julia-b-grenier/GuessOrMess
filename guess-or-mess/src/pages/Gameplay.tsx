import React, { useEffect, useState } from "react";
import FlippingFlashcard from "../components/Flipping_Flashcard.tsx"; 
import { getCardsOfDeck } from "../firebase/firestore.ts";
import { useParams } from "react-router-dom";

interface Card {
  question: string;
  answer: string;
}

const Gameplay: React.FC = () => {
  const { deckId } = useParams<{ deckId: string }>(); 
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    if (!deckId) {
      console.error("No deck ID provided.");
      return;
    }

    const fetchCards = async () => {
      try {
        const deckCards = await getCardsOfDeck(deckId);
        setCards(deckCards.filter((card: Card | null) => card !== null)); 
        console.log("am i here?");
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, [deckId]);

  return (
    <div className="App">
      {cards.length > 0 ? (
        <FlippingFlashcard 
          question={cards[0].question}
          options={[cards[0].answer, cards[1]?.answer]} 
          clickable={true}
          selected={null}
          correctIndex={0}
        />
      ) : (
        <p>Loading cards...</p>
      )}
    </div>
  );
};

export default Gameplay;
