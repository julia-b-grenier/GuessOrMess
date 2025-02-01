import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';  // Make sure to import js-cookie

const JoinGame = () => {
  // Get values from cookies when the component mounts
  const storedUsername = Cookies.get('username');
  const navigate = useNavigate();


  const handleJoinGame = () => {
    
  };

  return (
    <div>
      <h2>
        Welcome to the Join Game Page {storedUsername}
      </h2>
      <button
        onClick={handleJoinGame}
      >
        JOIN!
      </button>
    </div>
  );
};

export default JoinGame;
