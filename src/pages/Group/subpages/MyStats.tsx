import { useMyGameStats } from "src/hooks/useStats";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Spinner, StatsCard } from "src/components";
import { ErrorState } from "src/components/ErrorState";
import { WinLossDraw, NoGameSelected, NoMatchesPlayed } from "../components";
import { useGroup } from "src/context/GroupContext";
import {
  SwordsIcon,
  SkullIcon,
  TargetIcon,
  TrendingDown,
  TrendingUp,
  ActivityIcon,
  Gamepad2Icon,
  CrosshairIcon,
  CrownIcon,
} from "lucide-react";

const streakTypeToProps: Record<
  "win" | "loss" | "draw",
  {
    label: string;
    icon: React.ReactNode;
  }
> = {
  win: {
    label: "Wins",
    icon: <TrendingUp className="text-teal-400" />,
  },
  loss: {
    label: "Losses",
    icon: <TrendingDown className="text-teal-400" />,
  },
  draw: {
    label: "Draws",
    icon: <TargetIcon className="text-teal-400" />,
  },
};

const StatsContent = ({ gameId }: { gameId: number | null }) => {
  const { data } = useMyGameStats(gameId);
  const { group } = useGroup();

  if (!data || !data.hasPlayed) return <NoMatchesPlayed />;

  const currentGameSelected = group.games.find((g) => g.id === gameId);

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard
          title="Rank"
          value={`#${data.rank}`}
          icon={<CrownIcon className="text-teal-400" />}
          description={`Out of ${group.members.length} players`}
        />
        <StatsCard
          title="ELO"
          value={data.stats.elo}
          icon={<SwordsIcon className="text-teal-400" />}
          description={`For ${currentGameSelected?.name}`}
        />
        <StatsCard
          title="Win Rate"
          value={`${data.stats.winRate}%`}
          icon={<CrosshairIcon className="text-teal-400" />}
          description={`You have a ${data.stats.winRate}% win rate`}
        />
        <StatsCard
          title="Results"
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
          icon={<Gamepad2Icon className="text-teal-400" />}
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
          icon={<ActivityIcon className="text-teal-400" />}
          description="Past 5 matches"
        />
        {data.streak.type && (
          <StatsCard
            title="Current Streak"
            value={`${data.streak.count} ${
              streakTypeToProps[data.streak.type].label
            }`}
            icon={streakTypeToProps[data.streak.type].icon}
            description={`You have a ${data.streak.count} ${data.streak.type} streak`}
          />
        )}
        {data.rivals.nemesis && (
          <StatsCard
            title="Your nightmare"
            value={data.rivals.nemesis.username}
            icon={<SkullIcon className="text-teal-400" />}
            description={`${Math.round(
              data.rivals.nemesis.winRate
            )}% win rate against ${data.rivals.nemesis.username}`}
          />
        )}
        {data.rivals.bunny && (
          <StatsCard
            title="Your playground"
            value={data.rivals.bunny.username}
            icon={<TargetIcon className="text-teal-400" />}
            description={`${Math.round(
              data.rivals.bunny.winRate
            )}% win rate against ${data.rivals.bunny.username}`}
          />
        )}
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
    return <NoGameSelected />;
  }
  return (
    <ErrorBoundary
      fallbackRender={({ error, resetErrorBoundary }) => (
        <ErrorState error={error} onRetry={resetErrorBoundary} />
      )}
    >
      <Suspense fallback={<Spinner />}>
        <StatsContent gameId={selectedGameId} />
      </Suspense>
    </ErrorBoundary>
  );
};
