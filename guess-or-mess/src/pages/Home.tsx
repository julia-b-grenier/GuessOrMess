import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNewGame, addPlayerToGame } from "../firebase/firestore"; // Import your function
import Cookies from "js-cookie"; // Import js-cookie
import { motion } from "framer-motion";

const Home = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    gameCode: "",
  });
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

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
      const newGameId = await createNewGame(); // Call createNewGame to generate the gameId
      await addPlayerToGame(formData.username, newGameId);

      Cookies.set("username", formData.username, { expires: 1 }); // Set username cookie for 7 days
      Cookies.set("newGameId", newGameId, { expires: 1 }); // Set newGameId cookie for 7 days

      navigate(`/start-game`); // Redirect to the new game page
    } catch (error) {
      console.error("Error creating game:", error);
    }
  };

  const handleJoinGame = async () => {
    if (formData.username.trim() === "") {
      setError("Username cannot be empty");
      return; // Prevent starting the game if the username is empty
    }
    setError(null); // Clear the error if username is valid

    try {
      Cookies.set("username", formData.username, { expires: 1 }); // Set username cookie for 7 days
      navigate(`/join-game`); // Redirect to join game page
    } catch (error) {
      console.error("Error joining game:", error);
    }
  };

  return (
    <div className="home-page">
      <h1 className="text-3xl text-black">
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          GUESS
        </motion.span>{" "}
        <motion.span
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          OR
        </motion.span>{" "}
        <motion.span
          className="custom-font"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          onAnimationComplete={() => setShowForm(true)}
        >
          MESS
        </motion.span>
      </h1>

      {/* Reserve space for the form */}
      <div
        style={{ minHeight: "200px", display: "flex", alignItems: "center" }}
      >
        {showForm && (
          <motion.div
            className="fade-in"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              placeholder="Enter your username"
            />
            <div
              style={{
                visibility: error ? "visible" : "hidden",
                color: "red",
                margin: "10px",
              }}
            >
              {error}
            </div>
            <button onClick={handleStartGame}>Start Game</button>
            <button onClick={handleJoinGame}>Join Game</button>
            <label>Game Code:</label>
            <input
              type="text"
              name="gameCode"
              value={formData.gameCode}
              onChange={handleInputChange}
              placeholder="Game Code"
            />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
