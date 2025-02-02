import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import Player from "./Player";
import { getPlayersInGame } from "../firebase/firestore"; // Adjust path if needed

const WaitingArea = () => {
  const [players, setPlayers] = useState<string[]>([]);
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

    const fetchPlayers = async () => {
      try {
        setLoading(true);
        const playersList = await getPlayersInGame(gameId);
        setPlayers(playersList); // Assuming playersList is an array of usernames
      } catch (err) {
        setError("Failed to load players.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPlayers();
  }, [gameId]);

  if (!gameId) return <div className="text-red-500">Game ID missing!</div>;
  if (loading) return <div>Loading players...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="flex flex-row gap-5 flex-wrap border border-gray-300 justify-evenly max-w-5xl max-h-80 overflow-auto p-4">
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
