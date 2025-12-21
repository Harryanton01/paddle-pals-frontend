// client/src/pages/Dashboard.tsx
import { useMatches } from "../hooks/useMatches";
import { MatchCard } from "../components/MatchCard";
import { Leaderboard } from "../components/Leaderboard";
import { Link } from "react-router-dom";
import { useLeaderboard } from "../hooks/useLeaderboard";
import { History, Trophy } from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import { useUser } from "../hooks/useUser";

export const Dashboard = () => {
  const { data: matches, isLoading } = useMatches();
  const { data: players } = useLeaderboard();
  const { data: user } = useUser();

  return (
    <div className="flex flex-col gap-8 w-full">
      <div>
        <h1 className="text-2xl font-bold">
          Welcome back, <span className="text-teal-400">{user?.username}</span>!
          👋
        </h1>
        <p className="text-gray-400">
          Ready for another match? Your current ELO is{" "}
          <span className="text-teal-400">{user?.elo}</span>.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-8">
        {/* Left Column */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <Link to="/history">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>📋</span> Recent Matches
              </h2>
            </Link>
            <Link
              to="/matches/new"
              className="bg-teal-600 hover:bg-teal-700 px-3 py-1 rounded text-sm font-bold"
            >
              + New Match
            </Link>
          </div>
          {/* ... match list mapping ... */}
          {matches?.map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>

        {/* Right Column */}
        <div>
          <div className="flex justify-between items-center mb-4">
            <Link to="/leaderboard">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <span>🏆</span> Leaderboard
              </h2>
            </Link>
          </div>
          <Leaderboard players={players} />
        </div>
      </div>
    </div>
  );
};
