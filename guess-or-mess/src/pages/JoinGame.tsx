import { useState } from "react";
import { useNavigate } from "react-router-dom";

const JoinGame = () => {
  const [formData, setFormData] = useState({
    gameCode: "",
    username: "",
  });

  const [errors, setErrors] = useState({
    gameCode: "",
    username: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e: { target: { name: any; value: any } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { gameCode: "", username: "" };

    // TODO: add game code validation

    // TODO: add username validation

    return isValid;
  };

  const handleJoinGame = () => {
    if (validateForm()) {
      navigate(`/lobby/${formData.gameCode}`);
    }
  };

  return (
    <div>
      <h2>
        Welcome to Join Game Page
      </h2>

      <div>
        <label>Game Code:</label>
        <input
          type="text"
          name="gameCode"
          value={formData.gameCode}
          onChange={handleInputChange}
          placeholder="Enter game code"
        />
        {errors.gameCode && (
          <p>{errors.gameCode}</p>
        )}
      </div>

      <div>
        <label>Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleInputChange}
          placeholder="Enter your username"
        />
        {errors.username && (
          <p className="text-red-500 text-sm">{errors.username}</p>
        )}
      </div>

      <button
        onClick={handleJoinGame}
      >
        JOIN!
      </button>
    </div>
  );
};

export default JoinGame;
