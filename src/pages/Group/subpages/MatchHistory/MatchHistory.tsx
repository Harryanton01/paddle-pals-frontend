import { useState, Suspense } from "react";
import dayjs from "dayjs";
import clsx from "clsx";
import { useGroupMatches, type Match } from "./useGroupMatches";
import { useUser } from "../../../../context/AuthContext";
import { Spinner } from "../../../../components";

type MatchListProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  gameId: number | null;
  filter: "mine" | "all";
};

const MatchList = ({ page, setPage, gameId, filter }: MatchListProps) => {
  const user = useUser();

  const { data } = useGroupMatches({
    page,
    gameId,
    filter,
  });

  const matches = data?.data || [];
  const meta = data?.meta;

  return (
    <>
      <div className="space-y-4 animate-in fade-in duration-300">
        {matches.length === 0 ? (
          <div className="text-center py-10 text-gray-500 bg-gray-900/50 rounded-lg border border-dashed border-gray-800">
            No matches found for this filter.
          </div>
        ) : (
          matches.map((match) => (
            <MatchCard key={match.id} match={match} currentUserId={user.id} />
          ))
        )}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-4 border-t border-gray-800">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
            className="px-3 py-1 text-sm rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
          >
            Previous
          </button>

          <span className="text-gray-400 text-sm">
            Page <span className="text-white font-bold">{page}</span> of{" "}
            {meta.totalPages}
          </span>

          <button
            onClick={() => {
              if (page < meta.totalPages) {
                setPage((old) => old + 1);
              }
            }}
            disabled={page === meta.totalPages}
            className="px-3 py-1 text-sm rounded bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </>
  );
};

export const MatchHistory = ({
  selectedGameId,
}: {
  selectedGameId: number | null;
}) => {
  const [page, setPage] = useState(1);
  const [showOnlyMyMatches, setShowOnlyMyMatches] = useState(false);

  const handleToggleMyMatches = () => {
    setShowOnlyMyMatches((prev) => !prev);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-white">Match History</h2>

        <div className="flex flex-wrap items-center gap-4">
          <label
            className="flex items-center gap-2 cursor-pointer select-none"
            onClick={handleToggleMyMatches}
          >
            <span
              className={clsx(
                "text-sm font-medium",
                showOnlyMyMatches ? "text-teal-400" : "text-gray-400"
              )}
            >
              My Matches
            </span>
            <div
              className={clsx(
                "w-10 h-5 rounded-full p-1 transition-colors",
                showOnlyMyMatches ? "bg-teal-600" : "bg-gray-700"
              )}
            >
              <div
                className={clsx(
                  "bg-white w-3 h-3 rounded-full shadow-md transform transition-transform",
                  showOnlyMyMatches ? "translate-x-5" : "translate-x-0"
                )}
              />
            </div>
          </label>
        </div>
      </div>

      <Suspense fallback={<Spinner />}>
        <MatchList
          page={page}
          setPage={setPage}
          gameId={selectedGameId}
          filter={showOnlyMyMatches ? "mine" : "all"}
        />
      </Suspense>
    </div>
  );
};

const MatchCard = ({
  match,
  currentUserId,
}: {
  match: Match;
  currentUserId: number;
}) => {
  const isDraw = match.result === "DRAW";
  const isTeamBWin = match.result === "TEAM_B_WIN";

  const inTeamA = match.teamA.some((u) => u.id === currentUserId);
  const inTeamB = match.teamB.some((u) => u.id === currentUserId);
  const didIPlay = inTeamA || inTeamB;

  let outcome = "SPECTATOR";
  if (didIPlay) {
    if (isDraw) {
      outcome = "DRAW";
    } else if ((inTeamA && !isTeamBWin) || (inTeamB && isTeamBWin)) {
      outcome = "VICTORY";
    } else {
      outcome = "DEFEAT";
    }
  }

  const leftTeam = isTeamBWin ? match.teamB : match.teamA;
  const rightTeam = isTeamBWin ? match.teamA : match.teamB;

  const scoreA = match.scoreA ?? 0;
  const scoreB = match.scoreB ?? 0;
  const hasValidScore =
    match.scoreA !== null &&
    match.scoreB !== null &&
    !(scoreA === 0 && scoreB === 0);

  const leftScore = isTeamBWin ? scoreB : scoreA;
  const rightScore = isTeamBWin ? scoreA : scoreB;

  const containerClass = clsx(
    "relative p-4 rounded-xl border transition-all duration-300",
    outcome === "VICTORY" &&
      "bg-green-900/20 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.1)]",
    outcome === "DEFEAT" && "bg-red-900/10 border-red-500/30",
    outcome === "DRAW" && "bg-yellow-900/10 border-yellow-500/30",
    outcome === "SPECTATOR" &&
      "bg-gray-900/40 border-gray-800 hover:bg-gray-800/60"
  );

  const text = isDraw ? "DRAW" : "VS";

  return (
    <div className={containerClass}>
      <div className="flex justify-between items-center mb-4 border-b border-gray-700/50 pb-2">
        <span className="text-xs text-gray-500 font-medium uppercase tracking-wider">
          {dayjs(match.playedAt).format("DD/MM/YYYY, HH:mm")}
        </span>

        {outcome === "VICTORY" && (
          <span className="text-xs font-bold text-green-400 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded">
            Victory
          </span>
        )}
        {outcome === "DEFEAT" && (
          <span className="text-xs font-bold text-red-400 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded">
            Defeat
          </span>
        )}
        {outcome === "DRAW" && (
          <span className="text-xs font-bold text-yellow-500 uppercase tracking-widest bg-yellow-500/10 px-2 py-0.5 rounded">
            Draw
          </span>
        )}
      </div>

      <div className="flex items-center justify-between">
        {/* Left Side */}
        <div className="flex-1 flex flex-col items-start">
          <div
            className={clsx(
              "text-xs font-bold uppercase mb-1 tracking-wider flex items-center gap-2",
              isDraw ? "text-gray-500" : "text-green-500"
            )}
          >
            {isDraw ? "Team A" : "Winners"}
          </div>
          <div className="flex flex-col gap-0.5">
            {leftTeam.map((p) => (
              <span
                key={p.id}
                className={clsx(
                  "text-sm",
                  p.id === currentUserId
                    ? "text-blue-400 font-bold"
                    : "text-gray-300 font-medium"
                )}
              >
                {p.username}
              </span>
            ))}
            {leftTeam.length === 0 && (
              <span className="text-gray-600 text-sm italic">Unknown</span>
            )}
          </div>
        </div>

        {/* Score */}
        <div className="px-6 flex flex-col items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-gray-400">
            {match.game?.name}
          </span>
          <div
            className={clsx(
              "text-2xl font-black tracking-widest px-4 py-1 rounded-lg border min-w-[100px] text-center",
              isDraw
                ? "text-yellow-500 border-yellow-500/20 bg-yellow-500/5"
                : "text-white border-gray-700 bg-gray-900"
            )}
          >
            {hasValidScore ? `${leftScore} - ${rightScore}` : text}
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-1 flex flex-col items-end">
          <span
            className={clsx(
              "text-xs font-bold uppercase mb-1 tracking-wider",
              isDraw ? "text-gray-500" : "text-red-500"
            )}
          >
            {isDraw ? "Team B" : "Losers"}
          </span>
          <div className="flex flex-col gap-0.5 items-end">
            {rightTeam.map((p) => (
              <span
                key={p.id}
                className={clsx(
                  "text-sm",
                  p.id === currentUserId
                    ? "text-blue-400 font-bold"
                    : "text-gray-400 font-medium"
                )}
              >
                {p.username}
              </span>
            ))}
            {rightTeam.length === 0 && (
              <span className="text-gray-600 text-sm italic">Unknown</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
