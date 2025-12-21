import type { LeaderboardEntry } from "../hooks/useLeaderboard";
import { useUser } from "../hooks/useUser";

export const Leaderboard = ({ players }: { players?: LeaderboardEntry[] }) => {
  const { data: currentUser } = useUser();

  if (!players) return <div className="text-gray-500">Loading rankings...</div>;

  return (
    <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
      <table className="w-full text-left">
        <thead className="bg-gray-900/50 text-gray-400 text-sm uppercase">
          <tr>
            <th className="p-4 w-16">#</th>
            <th className="p-4">Player</th>
            <th className="p-4 text-center">W / L</th>
            <th className="p-4 text-right">ELO</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {players?.map((player, index) => {
            const isMe = player.id === currentUser?.id;
            const rank = index + 1;

            // Special styling for Top 3
            let rankIcon = `#${rank}`;
            if (rank === 1) rankIcon = "🥇";
            if (rank === 2) rankIcon = "🥈";
            if (rank === 3) rankIcon = "🥉";

            return (
              <tr
                key={player.id}
                className={`hover:bg-gray-700/50 transition-colors ${
                  isMe ? "bg-blue-500/10" : ""
                }`}
              >
                <td className="p-4 font-bold text-gray-400">{rankIcon}</td>
                <td className="p-4 font-medium text-white">
                  {player.username}
                  {isMe && (
                    <span className="ml-2 text-xs bg-blue-500 px-2 py-0.5 rounded text-white">
                      YOU
                    </span>
                  )}
                </td>
                <td className="p-4 text-center text-sm text-gray-400">
                  <span className="text-green-400">
                    {player._count.matchesWon}
                  </span>
                  <span className="mx-1">/</span>
                  <span className="text-red-400">
                    {player._count.matchesLost}
                  </span>
                </td>
                <td className="p-4 text-right font-mono font-bold text-blue-400">
                  {player.elo}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};
