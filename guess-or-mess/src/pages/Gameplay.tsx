import React, { useEffect, useState } from "react";
import FlippingFlashcard from "../components/Flipping_Flashcard.tsx";
import { useNavigate, useParams } from "react-router-dom";
import { getCardsOfDeck, listenToCurrentCard, incrementCurrentCard, incrementPlayerScore } from "../firebase/firestore";
import Cookies from "js-cookie";

interface Card {
  question: string;
  answer: string;
}

const Gameplay: React.FC = () => {
  const navigate = useNavigate();
  const { deckId, gameId } = useParams<{ deckId: string; gameId: string }>();
  const [cards, setCards] = useState<Card[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [cachedAnswers, setCachedAnswers] = useState<{ [key: number]: { answers: string[]; correctIndex: number } }>({});
  const playerId = Cookies.get("playerId");

  const pause = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

    async function wait() {
    await pause(1000); 
    }

  useEffect(() => {
    if (!deckId) {
      console.error("No deck ID provided.");
      return;
    }

    const fetchCards = async () => {
      console.log(deckId);
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
        setSelectedAnswer(null); 
        setIsFlipped(false);
        wait()
    });

    return () => unsub();
  }, [gameId]);

  useEffect(() => {
    if (cards.length > 0 && currentCardIndex >= cards.length && gameId) {
      navigate(`/leaderboard/${gameId}`);
    }
  }, [currentCardIndex, cards.length, gameId, navigate]);

  const handleNextCard = async () => {
    setSelectedAnswer(null); 
    setIsFlipped(false);
    wait()
    if (!gameId) return;
    await incrementCurrentCard(gameId);
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

  const currentCard = cards[currentCardIndex];

  useEffect(() => {
    return () => {
      if (gameId) {
        incrementCurrentCard(gameId);
      }
    };
  }, [gameId]);

  const getRandomAnswers = (cards: Card[], currentIndex: number, numOptions = 3) => {
    if (cachedAnswers[currentIndex]) {
      return cachedAnswers[currentIndex]; 
    }

    const correctAnswer = cards[currentIndex].answer;
    const otherAnswers = cards
      .filter((_, index) => index !== currentIndex)
      .map((card) => card.answer);

    const shuffledAnswers = otherAnswers.sort(() => Math.random() - 0.5);
    const incorrectAnswers = shuffledAnswers.slice(0, numOptions);
    const allAnswers = [correctAnswer, ...incorrectAnswers].sort(() => Math.random() - 0.5);

    const answerData = { answers: allAnswers, correctIndex: allAnswers.indexOf(correctAnswer) };
    setCachedAnswers((prev) => ({ ...prev, [currentIndex]: answerData })); 

    return answerData;
  };

  useEffect(() => {
    if (currentCard) {
      getRandomAnswers(cards, currentCardIndex);
    }
  }, [currentCardIndex, cards]);

  const { answers: answerOptions, correctIndex } = cachedAnswers[currentCardIndex] || {
    answers: ["Loading..."],
    correctIndex: -1,
  };

  const handleAnswerSelection = (index: number) => {
    setSelectedAnswer(index); 
    if (index === correctIndex && gameId && playerId) {
      incrementPlayerScore(gameId, playerId); 
    }
  };

  return (
    <div className="App">
      {cards.length > 0 && currentCardIndex < cards.length ? (
        <>
          <FlippingFlashcard
            question={currentCard.question}
            options={answerOptions}
            clickable={!isFlipped}
            selected={selectedAnswer} 
            correctIndex={correctIndex}
            onSelect={handleAnswerSelection} 
            isFlipped={isFlipped}
          />
          {isFlipped && (
            <div>
              <button onClick={handleNextCard} className="join-game-button btn-next">
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
