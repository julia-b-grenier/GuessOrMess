import React, { useEffect, useState, useRef } from "react";
import FlippingFlashcard from "../components/Flipping_Flashcard.tsx";
import { useNavigate, useParams } from "react-router-dom";
import {
  getCardsOfDeck,
  listenToCurrentCard,
  incrementCurrentCard,
  incrementPlayerScore,
} from "../firebase/firestore";
import Cookies from "js-cookie";
import splash from "./../assets/splash.svg";
import waitSplash from "./../assets/wait-splash.svg";

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
  const [cachedAnswers, setCachedAnswers] = useState<{
    [key: number]: { answers: string[]; correctIndex: number };
  }>({});
  const playerId = Cookies.get("playerId");
  const [timeLeft, setTimeLeft] = useState(10); // 10 seconds countdown
  const flipTimerRef = useRef<NodeJS.Timeout | null>(null);

  const pause = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

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
      wait();
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
    wait();
    if (!gameId) return;
    await incrementCurrentCard(gameId);
  };

  const handleFlipTimer = () => {
    setTimeLeft(10); // Reset timer to 10 seconds

    if (flipTimerRef.current) clearInterval(flipTimerRef.current);

    flipTimerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(flipTimerRef.current!);
          setIsFlipped(true); // Flip the card when timer reaches 0
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    handleFlipTimer(); // Start the timer when a new card appears

    return () => {
      if (flipTimerRef.current) clearInterval(flipTimerRef.current);
    };
  }, []);

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

  const getRandomAnswers = (
    cards: Card[],
    currentIndex: number,
    numOptions = 3
  ) => {
    if (cachedAnswers[currentIndex]) {
      return cachedAnswers[currentIndex];
    }

    const correctAnswer = cards[currentIndex].answer;
    const otherAnswers = cards
      .filter((_, index) => index !== currentIndex)
      .map((card) => card.answer);

    const shuffledAnswers = otherAnswers.sort(() => Math.random() - 0.5);
    const incorrectAnswers = shuffledAnswers.slice(0, numOptions);
    const allAnswers = [correctAnswer, ...incorrectAnswers].sort(
      () => Math.random() - 0.5
    );

    const answerData = {
      answers: allAnswers,
      correctIndex: allAnswers.indexOf(correctAnswer),
    };
    setCachedAnswers((prev) => ({ ...prev, [currentIndex]: answerData }));

    return answerData;
  };

  useEffect(() => {
    if (currentCard) {
      getRandomAnswers(cards, currentCardIndex);
    }
  }, [currentCardIndex, cards]);

  const { answers: answerOptions, correctIndex } = cachedAnswers[
    currentCardIndex
  ] || {
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
    <div>
      <img
        src={splash}
        alt="Splash"
        className="absolute top-0 right-3 w-100 h-80 p-0 -z-1"
      />
      <img
        src={waitSplash}
        alt="Wait Splash"
        className="absolute bottom-0 left-4 w-70 h-70 p-0 -z-1"
      />
      <div className="">
        {cards.length > 0 && currentCardIndex < cards.length ? (
          <>
            <h1 className="text-5xl font-bold">{timeLeft}</h1>
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
                <button
                  onClick={handleNextCard}
                  className="join-game-button btn-next"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <p>Loading cards...</p>
        )}
      </div>
    </div>
  );
};

export default Gameplay;
