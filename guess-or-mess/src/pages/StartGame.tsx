import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';  // Make sure to import js-cookie

function StartGame() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    // Get values from cookies when the component mounts
    const storedGameId = Cookies.get('newGameId');
    const storedUsername = Cookies.get('username');

    setGameId(storedGameId || null);
    setUsername(storedUsername || null);
  }, []);  // Empty dependency array ensures this effect runs only once on mount

  return (
    <div>
      <h2>Welcome to Start Game Page</h2>
      {gameId && username ? (
        <>
          <p>Game ID: {gameId}</p>
          <p>Username: {username}</p>
        </>
      ) : (
        <p>Game and username are not available.</p>
      )}
      <p>Game will begin soon!</p>
    </div>
  );
}

export default StartGame;
