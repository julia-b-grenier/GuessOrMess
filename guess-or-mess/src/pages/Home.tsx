import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNewGame, addPlayerToGame } from "../firebase/firestore";
import Cookies from "js-cookie";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import splash from './../assets/splash.svg'

function Home() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    gameCode: "",
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Cookies.remove("username");
    Cookies.remove("gameId");
    Cookies.remove("playerId");
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartGame = async () => {
    if (formData.username.trim() === "") {
      setError("Username cannot be empty");
      return;
    }
    setError(null);

    try {
      const newGameId = await createNewGame();
      const playerID = await addPlayerToGame(formData.username, newGameId);

      Cookies.set("username", formData.username, { expires: 1 });
      Cookies.set("gameId", newGameId, { expires: 1 });
      Cookies.set("playerId", playerID, { expires: 1 });

      navigate(`/start-game`);
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const handleJoinGame = async () => {
    if (formData.username.trim() === "") {
      setError("Username cannot be empty");
      return;
    }
    if (formData.gameCode.trim() === "") {
      setError("Game code cannot be empty");
      return;
    }
    setError(null);

    try {
      const playerID = await addPlayerToGame(formData.username, formData.gameCode);

      Cookies.set("username", formData.username, { expires: 1 });
      Cookies.set("gameId", formData.gameCode, { expires: 1 });
      Cookies.set("playerId", playerID, { expires: 1 });

      navigate(`/join-game`);
    } catch (error) {
      setError(error instanceof Error ? error.message : "An unexpected error occurred");
      console.error("Error joining game:", error);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-7xl font-bold mb-10 mt-10">
        GUESS OR <span className="custom-font text-9xl">MESS</span>
      </h1>
      <div className="w-full max-w-md space-y-10">
        {error && <div style={{ color: "red" }}>{error}</div>}

        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Enter your username"
          className="rounded-lg w-full neon-input"
        />

        <div className="flex flex-row justify-between">
          <button className="join-game-button" onClick={handleStartGame}>
            Start Game
          </button>
          <button className="join-game-button" onClick={handleJoinGame}>
            Join Game
          </button>
        </div>
      </div>
        <input
          type="text"
          name="gameCode"
          value={formData.gameCode}
          onChange={handleInputChange}
          placeholder="Game Code"
          className="neon-input"
        />
        <button className="join-game-button mt-4" onClick={handleJoinGame}>
          Join
        </button>
    </div>
  );
}

export default Home;
