import { useStats } from "../hooks/useStats";
import { match } from "ts-pattern";
import {
  Trophy,
  History,
  Percent,
  Users,
  ChartLine,
  Sword,
} from "lucide-react";
import { StatsCard } from "../components/StatsCard";
import { OpponentBreakdown } from "../components/OpponentBreakdown";

export const Stats = () => {
  const { data: stats, isLoading } = useStats();

  if (!stats) return null;

  const winsToLosses = match(stats.winRate)
    .when(
      (winrate) => winrate >= 50,
      () => (
        <p className="text-green-500">
          {stats.wins}W - {stats.losses}L
        </p>
      )
    )
    .when(
      (winrate) => winrate === 0,
      () => (
        <p className="text-gray-500">
          {stats.wins}W - {stats.losses}L
        </p>
      )
    )
    .otherwise(() => (
      <p className="text-red-500">
        {stats.wins}W - {stats.losses}L
      </p>
    ));

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="grid grid-cols-3 gap-8">
        <StatsCard
          title="Current Rank"
          description="Out of 7 players"
          value={stats?.rank}
          icon={<Trophy className="w-8 h-8 text-teal-400" />}
        />
        <StatsCard
          title="Total Matches"
          description="Games played"
          value={stats?.totalMatches}
          icon={<History className="w-8 h-8 text-teal-400" />}
        />
        <StatsCard
          title="Win Rate"
          description={winsToLosses}
          value={`${stats?.winRate}%`}
          icon={<Percent className="w-8 h-8 text-teal-400" />}
        />
        <StatsCard
          title="Rivals"
          description="Active players"
          value={stats?.totalPlayers}
          icon={<Users className="w-8 h-8 text-teal-400" />}
        />
        <StatsCard
          title="Current ELO"
          description="Your rating"
          value={stats?.elo}
          icon={<ChartLine className="w-8 h-8 text-teal-400" />}
        />
      </div>
      <OpponentBreakdown />
    </div>
  );
};
