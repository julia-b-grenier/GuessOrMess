import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createNewGame, addPlayerToGame } from './../firestore'; // Import your function
import Cookies from 'js-cookie';  // Import js-cookie

function Home() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    gameCode: ""
  });
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: { target: { name: string; value: string } }) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleStartGame = async () => {
    if (formData.username.trim() === '') {
      setError('Username cannot be empty');
      return; // Prevent starting the game if the username is empty
    }
    setError(null); // Clear the error if username is valid

    try {
      const newGameId = await createNewGame();  // Call createNewGame to generate the gameId
      await addPlayerToGame(formData.username, newGameId);

      Cookies.set('username', formData.username, { expires: 1 }); // Set username cookie for 7 days
      Cookies.set('newGameId', newGameId, { expires: 1 }); // Set newGameId cookie for 7 days


      navigate(`/start-game`);  // Redirect to the new game page
    } catch (error) {
      console.error('Error creating game:', error);
    }
  };

  const handleJoinGame = async () => {
    if (formData.username.trim() === '') {
      setError('Username cannot be empty');
      return; // Prevent starting the game if the username is empty
    }
    setError(null); // Clear the error if username is valid

    try {
      Cookies.set('username', formData.username, { expires: 1 }); // Set username cookie for 7 days
      navigate(`/join-game`);  // Redirect to join game page
    } catch (error) {
      console.error('Error joining game:', error);
    }
  };

  return (
    <>
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
      <div style={{ visibility: error ? 'visible' : 'hidden', color: 'red', margin: '10px' }}>
        Username cannot be empty
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
      

    </>
  );
}

export default Home;
