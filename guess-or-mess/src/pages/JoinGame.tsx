import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { listenToCurrentCard } from "../firebase/firestore"; // Assuming this function exists
import WaitingArea from '../components/WaitingArea';
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import GameCode from "../components/GameCode";

const JoinGame = () => {
  const navigate = useNavigate();
  const [currentCard, setCurrentCard] = useState<number>(-1); // Start at -1 as per your requirement
  const [deckId, setDeckId] = useState<string | null>(null);
  const storedGameId = Cookies.get('gameId');

  useEffect(() => {
    if (!storedGameId) return;

    // Assuming you have a snapshot listener for the currentCard
    const unsubscribe = listenToCurrentCard(storedGameId, (currentCardValue) => {
      setCurrentCard(currentCardValue);
    });

    return () => {
      unsubscribe();
    };
  }, [storedGameId]);

  useEffect(() => {
    if (storedGameId && currentCard === 0) {
      // If currentCard reaches 0, navigate to the gameplay page
      // Retrieve deckId from gameId deck reference (assuming it's stored in Firestore)
      const gameRef = doc(db, 'games', storedGameId);
      getDoc(gameRef).then(docSnapshot => {
        const gameData = docSnapshot.data();
        const deckIdFromGame = gameData?.deck; // Assuming `deck` is a field in the game document
        setDeckId(deckIdFromGame);
      }).catch(error => console.error("Error fetching deck ID:", error));
    }
  }, [currentCard, storedGameId]);

  useEffect(() => {
    if (deckId && currentCard === 0) {
      // Navigate to gameplay page when currentCard hits 0
      navigate(`/gameplay/${deckId}/${storedGameId}`);
    }
  }, [deckId, currentCard, storedGameId, navigate]);

  
  return (
    <div className="flex flex-col items-center p-8 space-y-12 max-w-4xl mx-auto">
      <div className="flex flex-row justify-start w-full">
        <div className="">
          <GameCode textToCopy={storedGameId ?? ""}></GameCode>
        </div>
          Join Game
      </div>

      <div className="w-full">
        <div className="mb-5 w-100%">
          <WaitingArea />
        </div>
      </div>
    </div>
  );
};

export default JoinGame;
