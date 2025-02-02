import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNewGame, addPlayerToGame } from "../firebase/firestore";
import Cookies from "js-cookie";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import splash from "./../assets/splash.svg";
import rightSplash from "./../assets/right-splash.svg";
import leftSplash from "./../assets/left-splash.svg";

function Home() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    gameCode: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const playerID = await addPlayerToGame(
        formData.username,
        formData.gameCode
      );

      Cookies.set("username", formData.username, { expires: 1 });
      Cookies.set("gameId", formData.gameCode, { expires: 1 });
      Cookies.set("playerId", playerID, { expires: 1 });

      navigate(`/join-game`);
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "An unexpected error occurred"
      );
      console.error("Error joining game:", error);
    }
  };

  return (
    <div className="flex flex-col items-center relative min-h-screen">
      {/* Splash images in the corners */}
      <img
        src={splash}
        alt="Splash"
        className="absolute top-0 left-0 w-48 h-48 -z-1 opacity-0"
      />
      <img
        src={splash}
        alt="Splash"
        className="absolute top-0 right-0 w-100 h-80 p-0 -z-1"
      />
      <img
        src={leftSplash}
        alt="Left Splash"
        className="absolute bottom-0 left-0 w-48 h-48 -z-1"
      />
      <img
        src={rightSplash}
        alt="Right Splash"
        className="absolute bottom-0 right-0 w-48 h-36 -z-1 p-0"
      />

      {/* Main content */}
      <div className="flex flex-col items-center justify-center my-auto mx-0 h-screen">
        <div className="flex flex-row items-center my-5 flex-wrap justify-center">
          <h1 className="text-7xl font-bold text-center">GUESS OR</h1>
          <h1 className="custom-font text-9xl block mt-5 ml-5">MESS</h1>
        </div>
        <div className="space-y-6">
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
            <button className="join-game-button mr-3" onClick={handleStartGame}>
              Start Game
            </button>
            <button
              className="join-game-button ml-3"
              onClick={() => setIsModalOpen(true)}
            >
              Join Game
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal" onClick={() => setIsModalOpen(false)}>
          <div
            className="modal-content relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button positioned top-right */}
            <button
              className="absolute top-0 right-0 p-2 bg-transparent"
              onClick={() => setIsModalOpen(false)}
            >
              <CloseRoundedIcon />
            </button>

            <h2 className="text-xl mb-4">Enter Game Code</h2>
            <input
              type="text"
              name="gameCode"
              value={formData.gameCode}
              onChange={handleInputChange}
              placeholder="Game Code"
              className="w-full neon-input mb-4"
            />
            <div className="">
              <button className="join-game-button" onClick={handleJoinGame}>
                Join
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Home;
