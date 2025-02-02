import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

interface Player {
  id: string;
  username: string;
  score: number;
}

const dummyPlayers: Player[] = [
  { id: "1", username: "Tayba", score: 1250 },
  { id: "2", username: "Julia", score: 980 },
  { id: "3", username: "Sahar", score: 875 },
];

const Leaderboard = () => {
  const podiumOrder = [1, 0, 2] as const; // Explicitly type as readonly tuple

  const podiumHeights = {
    0: "h-48", // 1st place
    1: "h-40", // 2nd place
    2: "h-32", // 3rd place
  } as const;

  const trophyColors = {
    0: "text-yellow-400", // Gold
    1: "text-gray-300", // Silver
    2: "text-amber-600", // Bronze
  } as const;

  return (
    <div className="w-full max-w-2xl mx-auto p-8">
      <h2 className="text-4xl font-bold text-center mb-12">Top Players</h2>

      <div className="flex justify-center items-end gap-4 h-64">
        {podiumOrder.map((position) => {
          const player = dummyPlayers[position];
          if (!player) return null;

          return (
            <motion.div
              key={player.id}
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
                <Trophy
                  className={`w-8 h-8 ${
                    trophyColors[position as keyof typeof trophyColors]
                  } mb-2`}
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
                  podiumHeights[position as keyof typeof podiumHeights]
                } bg-gradient-to-t from-blue-600 to-blue-400 rounded-t-lg shadow-lg`}
                initial={{ height: 0 }}
                animate={{ height: "100%" }}
                transition={{
                  delay: position * 0.2,
                  duration: 0.5,
                  ease: "easeOut",
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-white">
                    #{position + 1}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default Leaderboard;
