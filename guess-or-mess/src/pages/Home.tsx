import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNewGame, addPlayerToGame } from "../firebase/firestore";
import Cookies from "js-cookie";

function Home() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    gameCode: "",
  });
  const [error, setError] = useState<string | null>(
    "Username cannot be empty."
  );

  useEffect(() => {
    // Remove cookies when the page is refreshed
    Cookies.remove("username");
    Cookies.remove("gameId");
    Cookies.remove("playerId");
  }, []);

  const handleInputChange = (e: {
    target: { name: string; value: string };
  }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartGame = async () => {
    if (formData.username.trim() === "") {
      setError("Username cannot be empty");
      return; // Prevent starting the game if the username is empty
    }
    setError(null); // Clear the error if username is valid

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
      return; // Prevent joining the game if the username is empty
    }

    if (formData.gameCode.trim() === "") {
      setError("Game code cannot be empty");
      return; // Prevent joining the game if the game code is empty
    }

    setError(null); // Clear the error if inputs are valid

    try {
      const playerID = await addPlayerToGame(
        formData.username,
        formData.gameCode
      ); // Use gameCode

      Cookies.set("username", formData.username, { expires: 1 });
      Cookies.set("gameId", formData.gameCode, { expires: 1 });
      Cookies.set("playerId", playerID, { expires: 1 });

      navigate(`/join-game`);
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
      console.error("Error joining game:", error);
    }
  };

  return (
    <div>
      <h1>GUESS OR MESS</h1>
      <div>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Enter your username"
        />
      </div>
      <div
        style={{
          visibility: error ? "visible" : "hidden",
          color: "red",
          margin: "10px",
        }}
      >
        {error}
      </div>
      <div>
        <button onClick={handleStartGame}>Start Game</button>
      </div>
      <div>
        <button onClick={handleJoinGame}>Join Game</button>

        <label>Game Code:</label>
        <input
          type="text"
          name="gameCode"
          value={formData.gameCode}
          onChange={handleInputChange}
          placeholder="Game Code"
        />
      </div>
    </div>
  );
}

export default Home;
