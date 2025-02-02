import React, { useEffect, useState } from "react";
import FlippingFlashcard from "../components/Flipping_Flashcard.tsx";
import { useParams } from "react-router-dom";
import { getCardsOfDeck, listenToCurrentCard, incrementCurrentCard } from "../firebase/firestore";

interface Card {
  question: string;
  answer: string;
}

const Gameplay: React.FC = () => {
  const { deckId, gameId } = useParams<{ deckId: string, gameId: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);

  useEffect(() => {
    if (!deckId) {
      console.error("No deck ID provided.");
      return;
    }

    const fetchCards = async () => {
      try {
        const deckCards = await getCardsOfDeck(deckId);
        setCards(deckCards.filter((card: Card | null) => card !== null));
        console.log("Cards fetched:", deckCards);
      } catch (error) {
        console.error("Error fetching cards:", error);
      }
    };

    fetchCards();
  }, [deckId]);

  useEffect(() => {
    if (!gameId) return;

    const unsub = listenToCurrentCard(gameId, (currentCard) => {
      setCurrentCardIndex(currentCard); 
    });

    return () => unsub(); 
  }, [gameId]);


  const handleNextCard = async () => {
    if (!gameId) return;
    await incrementCurrentCard(gameId); 
    setIsFlipped(false); 
  };

  const handleFlipTimer = () => {
    setTimeout(() => {
      setIsFlipped(true); 
    }, 10000); 
  };

  useEffect(() => {
    if (cards.length > 0 && currentCardIndex < cards.length && !isFlipped) {
      handleFlipTimer();
    }
  }, [currentCardIndex, cards, isFlipped]);

  return (
    <div className="App">
      {cards.length > 0 && currentCardIndex < cards.length ? (
        <>
          <FlippingFlashcard
            question={cards[currentCardIndex].question}
            options={[cards[currentCardIndex].answer, cards[currentCardIndex + 1]?.answer]}
            clickable={true}
            selected={null}
            correctIndex={0}
            isFlipped={isFlipped}
          />
          {isFlipped && (
            <div>
              <button onClick={handleNextCard} className="btn-next">
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <p>Loading cards...</p>
      )}
    </div>
  );
};

export default Gameplay;
