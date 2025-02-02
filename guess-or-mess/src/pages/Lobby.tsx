import { useParams } from "react-router-dom";
import GameCode from "../components/GameCode.tsx";

const Lobby = () => {
  const { gameCode } = useParams<{ gameCode: string }>();

  return (
    <div>
      <div>
        <h1 className="text-5xl font-bold mb-10">Game Lobby</h1>
        <GameCode textToCopy={gameCode ?? ""} />
      </div>

      {/* Placeholder sections for future lobby features */}
      <div>
        <div>
          <h3>Players</h3>
          <div>
            {/* Player list will go here */}
            <p>Waiting for players to join...</p>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <button>Start Game</button>
      </div>
    </div>
  );
};

export default Lobby;
