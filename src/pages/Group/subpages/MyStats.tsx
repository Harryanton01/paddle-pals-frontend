import { useMyGameStats } from "src/hooks/useStats";
import { Suspense } from "react";
import { Spinner, StatsCard } from "src/components";
import { WinLossDraw } from "../components";
import { useGroup } from "src/context/GroupContext";
import {
  ChartBarIcon,
  TrophyIcon,
  PercentIcon,
  SkullIcon,
  TargetIcon,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

const StatsContent = ({ gameId }: { gameId: number | null }) => {
  const { data } = useMyGameStats(gameId);
  const { group } = useGroup();

  if (!data || !data.hasPlayed) return null;

  const currentGameSelected = group.games.find((g) => g.id === gameId);

  return (
    <>
      <div className="grid grid-cols-3 gap-4">
        <StatsCard
          title="Rank"
          value={`#${data.rank}`}
          icon={<TrophyIcon className="text-teal-400" />}
          description={`Out of ${group.members.length} players`}
        />
        <StatsCard
          title="ELO"
          value={data.stats.elo}
          icon={<ChartBarIcon className="text-teal-400" />}
          description={`For ${currentGameSelected?.name}`}
        />
        <StatsCard
          title="Win Rate"
          value={`${data.stats.winRate}%`}
          icon={<PercentIcon className="text-teal-400" />}
          description={`You have a ${data.stats.winRate}% win rate`}
        />
        <StatsCard
          title="Played"
          value={
            <div className="flex gap-1">
              <WinLossDraw result="W" prefix={<span>{data.stats.wins}</span>} />
              {" - "}
              <WinLossDraw
                result="L"
                prefix={<span>{data.stats.losses}</span>}
              />
              {!!data.stats.draws && (
                <>
                  {" - "}
                  <WinLossDraw
                    result="D"
                    prefix={<span>{data.stats.draws}</span>}
                  />
                </>
              )}
            </div>
          }
          icon={<ChartBarIcon className="text-teal-400" />}
          description={`In ${data.stats.totalPlayed} matches`}
        />
        <StatsCard
          title="Performance"
          value={
            <div className="flex gap-1">
              {data.form.map((result, i) => (
                <WinLossDraw key={i} result={result} withBg={true} />
              ))}
            </div>
          }
          icon={<ChartBarIcon className="text-teal-400" />}
          description="Past 5 matchess"
        />
        <StatsCard
          title="Current Streak"
          value={`${data.streak.count} ${
            data.streak.type === "win" ? "Wins" : "Losses"
          }`}
          icon={<TrophyIcon className="text-teal-400" />}
          description={`You have a ${data.streak.count} ${
            data.streak.type === "win" ? "win" : "loss"
          } streak`}
        />
        <StatsCard
          title="Your nightmare"
          value={data.rivals.nemesis?.username}
          icon={<SkullIcon className="text-teal-400" />}
          description={`${Math.round(
            data.rivals.nemesis?.winRate ?? 0
          )}% win rate against ${data.rivals.nemesis?.username}`}
        />
        <StatsCard
          title="Your playground"
          value={data.rivals.bunny?.username}
          icon={<TargetIcon className="text-teal-400" />}
          description={`${Math.round(
            data.rivals.bunny?.winRate ?? 0
          )}% win rate against ${data.rivals.bunny?.username}`}
        />
      </div>
    </>
  );
};

export const MyStats = ({
  selectedGameId,
}: {
  selectedGameId: number | null;
}) => {
  if (!selectedGameId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
          <ChartBarIcon className="w-8 h-8 text-gray-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Select a Game</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            Please select a specific game (e.g., Pool, Darts) from the top menu
            to view its leaderboard.
          </p>
        </div>
      </div>
    );
  }
  return (
    <Suspense fallback={<Spinner />}>
      <StatsContent gameId={selectedGameId} />
    </Suspense>
  );
};
