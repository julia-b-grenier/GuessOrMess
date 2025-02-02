import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Player from "./Player";
import { getPlayersInGame } from "../firebase/firestore"; // Adjust path if needed

const WaitingArea = () => {
  const [players, setPlayers] = useState<any[]>([]); // Store player objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const gameId = Cookies.get("gameId"); // Get gameId from cookies
  const username = Cookies.get("username"); // Get gameId from cookies

  useEffect(() => {
    if (!gameId) {
      setError("Game ID not found. Please join a game.");
      setLoading(false);
      return;
    }

    // Use the updated getPlayersInGame function that provides real-time updates
    const unsubscribe = getPlayersInGame(gameId, (updatedPlayers) => {
      setPlayers(updatedPlayers); // Update the players state with the real-time data
      setLoading(false); // Stop loading once players are fetched
    });

    // Cleanup the listener when the component is unmounted or gameId changes
    return () => unsubscribe();
  }, [gameId]);

  if (!gameId) return <div className="text-red-500">Game ID missing!</div>;
  if (loading) return <div>Loading players...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div style={{backgroundColor: "#4a4a4a66"}} className="flex flex-row gap-5 flex-wrap justify-evenly overflow-auto p-4 max-w-4xl h-80 mx-auto rounded-xl">
      {players.length > 0 ? (
        players.map((player, index) => (
          <Player key={index} name={player.username} disableEmojiChange={username === player.username} />
        ))
      ) : (
        <div className="text-gray-500">No players have joined yet.</div>
      )}
    </div>
  );
};

export default WaitingArea;
