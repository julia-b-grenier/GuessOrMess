import { useParams } from "react-router-dom";

const Lobby = () => {
  const { gameCode } = useParams<{ gameCode: string }>();

  return (
    <div>
      <div>
        <h2>Game Lobby</h2>
        <p className="text-gray-700">
          Game Code: {gameCode}
        </p>
      </div>

      {/* Placeholder sections for future lobby features */}
      <div>
        <div>
          <h3>Players</h3>
          <div>
            {/* Player list will go here */}
            <p>
              Waiting for players to join...
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button>
          Start Game
        </button>
      </div>
    </div>
  );
};

export default Lobby;
