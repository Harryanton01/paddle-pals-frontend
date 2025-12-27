import { Suspense } from "react";
import clsx from "clsx";
import { useGameStats } from "src/hooks/useStats";
import { useUser } from "src/context/AuthContext";
import { NoGameSelected, NoMatchesPlayed } from "../components";
import { Spinner } from "src/components";

const Content = ({ selectedGameId }: { selectedGameId: number }) => {
  const user = useUser();
  const { data: stats } = useGameStats(selectedGameId);

  if (stats.overview.totalMatches === 0) return <NoMatchesPlayed />;

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden shadow-lg">
        <div className="px-6 py-4 border-b border-gray-700 bg-gray-800/50">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            Leaderboard
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400">
            <thead className="bg-gray-900/50 uppercase text-xs font-bold tracking-wider text-gray-500">
              <tr>
                <th className="px-6 py-4">Rank</th>
                <th className="px-6 py-4">Player</th>
                <th className="px-6 py-4 text-right">ELO</th>
                <th className="px-6 py-4 text-center">W - L - D</th>
                <th className="px-6 py-4 text-right">Win Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/50">
              {stats.leaderboard.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="p-8 text-center text-gray-500 italic"
                  >
                    No stats recorded yet. Play a match to show up here!
                  </td>
                </tr>
              ) : (
                stats.leaderboard.map((player) => (
                  <tr
                    key={player.userId}
                    className={clsx(
                      "transition-colors hover:bg-gray-700/30",
                      player.userId === user.id ? "bg-teal-900/10" : ""
                    )}
                  >
                    <td className="px-6 py-4 font-medium">
                      {player.rank === 1 ? (
                        <span className="text-xl">🥇</span>
                      ) : player.rank === 2 ? (
                        <span className="text-xl">🥈</span>
                      ) : player.rank === 3 ? (
                        <span className="text-xl">🥉</span>
                      ) : (
                        `#${player.rank}`
                      )}
                    </td>
                    <td
                      className={clsx(
                        "px-6 py-4 font-bold text-white",
                        player.userId === user.id && "text-teal-400"
                      )}
                    >
                      <p
                        className={clsx(
                          player.userId === user.id && "text-teal-400"
                        )}
                      >
                        {player.username}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-right font-mono text-white text-base">
                      {player.elo}
                    </td>
                    <td className="px-6 py-4 text-center font-medium">
                      <span className="text-green-400">{player.wins}</span>
                      <span className="text-gray-600 mx-1">/</span>
                      <span className="text-red-400">{player.losses}</span>
                      <span className="text-gray-600 mx-1">/</span>
                      <span className="text-yellow-500">{player.draws}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold">
                      <span
                        className={clsx(
                          player.winRate >= 50
                            ? "text-green-400"
                            : "text-orange-400"
                        )}
                      >
                        {player.winRate}%
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export const Leaderboard = ({
  selectedGameId,
}: {
  selectedGameId: number | null;
}) => {
  if (!selectedGameId) {
    return <NoGameSelected />;
  }

  return (
    <Suspense fallback={<Spinner />}>
      <Content selectedGameId={selectedGameId} />
    </Suspense>
  );
};
