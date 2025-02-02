import { motion } from "framer-motion";
import EmojiEventsRoundedIcon from "@mui/icons-material/EmojiEventsRounded";
import { Player } from "../types/game";

const dummyPlayers: Player[] = [
  { username: "Tayba", score: 1250 },
  { username: "Julia", score: 980 },
  { username: "Sahar", score: 875 },
  { username: "James", score: 800 },
  { username: "Your Mom", score: 750 }
];

const Leaderboard = () => {
  const podiumOrder = [1, 0, 2] as const;

  const trophyColors = {
    0: "#F1087B", // Gold
    1: "#7236D2", // Silver
    2: "#F7E641", // Bronze
  } as const;

  const podiumGradients = {
    0: "from-[#0DD6F4] to-[#F1087B]", // Gold gradient
    1: "from-[#08B9C3] to-[#7236D2]", // Silver gradient
    2: "from-[#33F3F8] to-[#F7E641]", // Bronze gradient
  } as const;

  // Get remaining players (4th place onwards)
  const remainingPlayers = dummyPlayers.slice(3);

  return (
    <div className="w-full mx-auto p-8">
      <h2 className="text-4xl font-bold text-center mb-12">Top Players</h2>

      {/* Podium Section */}
      <div className="flex justify-center items-end gap-4 h-96 mb-8">
        {podiumOrder.map((position) => {
          const player = dummyPlayers[position];
          if (!player) return null;

          return (
            <motion.div
              key={player.username}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: position * 0.2 }}
            >
              <motion.div
                className="flex flex-col items-center mb-2"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: position * 0.2 + 0.3, type: "spring" }}
              >
                <EmojiEventsRoundedIcon
                  sx={{ color: trophyColors[position as keyof typeof trophyColors] }}
                  fontSize="large"
                />
                <span className="text-lg font-semibold mb-1">
                  {player.username}
                </span>
                <motion.span
                  className="text-sm text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: position * 0.2 + 0.5 }}
                >
                  {player.score} pts
                </motion.span>
              </motion.div>

              <motion.div
                className={`w-24 ${
                  position === 0 ? "h-64" : position === 1 ? "h-48" : "h-32"
                } bg-gradient-to-t ${podiumGradients[position as keyof typeof podiumGradients]} rounded-t-lg shadow-lg`}
                initial={{ height: 0 }}
                animate={{
                  height: position === 0 ? 256 : position === 1 ? 192 : 128,
                }}
                transition={{
                  delay: position * 0.2,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              />
            </motion.div>
          );
        })}
      </div>

      {/* Remaining Players Section */}
      {remainingPlayers.length > 0 && (
        <div className="mt-8">
          {remainingPlayers.map((player, index) => (
            <motion.div
              key={player.username}
              className="flex items-center justify-between bg-gray-800 rounded-lg p-4 mb-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="flex items-center">
                <span className="text-gray-400 mr-4">#{index + 4}</span>
                <span className="font-semibold">{player.username}</span>
              </div>
              <span className="text-gray-400">{player.score} pts</span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Leaderboard;
