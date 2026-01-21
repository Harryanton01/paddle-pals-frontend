import { useState, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import dayjs from "dayjs";
import clsx from "clsx";
import { useGroupMatches, type Match } from "./useGroupMatches";
import { useUser } from "src/context/AuthContext";
import { useGroup } from "src/context/GroupContext";
import { ErrorState } from "src/components/ErrorState";
import { Spinner } from "src/components";
import { PendingMatchesButton } from "src/components/PendingMatchesButton/PendingMatchesButton";
import { useMatchAction } from "src/hooks/useMatches";

type MatchListProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  gameId: number | null;
  filter: "mine" | "all";
};

const MatchList = ({ page, setPage, gameId, filter }: MatchListProps) => {
  const { data } = useGroupMatches({
    page,
    gameId,
    filter,
  });

  const matches = data?.data || [];
  const meta = data?.meta;

  if (matches.length === 0) return <div>No matches played</div>;

  return (
    <>
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {matches.map((match) => (
          <MatchCard key={match.id} match={match} />
        ))}
      </div>

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-6 border-t border-gray-800">
          <button
            onClick={() => setPage((old) => Math.max(old - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors cursor-pointer font-medium"
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
            className="px-4 py-2 text-sm rounded-lg bg-gray-800 hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-white transition-colors cursor-pointer font-medium"
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
  const { group } = useGroup();

  const handleToggleMyMatches = () => {
    setShowOnlyMyMatches((prev) => !prev);
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <ErrorBoundary fallback={<>Error</>}>
            <Suspense fallback={null}>
              <PendingMatchesButton groupId={group.id} />
            </Suspense>
          </ErrorBoundary>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label
            className="flex items-center gap-3 cursor-pointer select-none bg-gray-900/50 px-3 py-1.5 rounded-lg border border-gray-800 hover:border-gray-700 transition-colors"
            onClick={handleToggleMyMatches}
          >
            <span
              className={clsx(
                "text-sm font-medium transition-colors",
                showOnlyMyMatches ? "text-teal-400" : "text-gray-400"
              )}
            >
              My Matches
            </span>
            <div
              className={clsx(
                "w-9 h-5 rounded-full p-1 transition-colors relative",
                showOnlyMyMatches ? "bg-teal-600" : "bg-gray-700"
              )}
            >
              <div
                className={clsx(
                  "bg-white w-3 h-3 rounded-full shadow-md transform transition-transform absolute top-1",
                  showOnlyMyMatches ? "left-[calc(100%-16px)]" : "left-1"
                )}
              />
            </div>
          </label>
        </div>
      </div>

      <ErrorBoundary
        fallbackRender={({ error, resetErrorBoundary }) => (
          <ErrorState error={error} onRetry={resetErrorBoundary} />
        )}
      >
        <Suspense fallback={<Spinner />}>
          <MatchList
            page={page}
            setPage={setPage}
            gameId={selectedGameId}
            filter={showOnlyMyMatches ? "mine" : "all"}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

const MatchCard = ({ match }: { match: Match }) => {
  const user = useUser();
  const { group } = useGroup();

  // 1. Hooks & State
  const currentMember = group?.members.find((m) => m.user.id === user.id);
  const isAdmin = currentMember?.role === "ADMIN";

  const { mutate: performAction, isPending: isActionLoading } =
    useMatchAction();

  // 2. Status Checks
  const isPending = match.status === "PENDING";
  const isRejected = match.status === "REJECTED";
  const isDraw = match.result === "DRAW";
  const isTeamBWin = match.result === "TEAM_B_WIN";
  const isTeamAWin = match.result === "TEAM_A_WIN";

  const proposer = match.createdBy;
  const showScores = !(match.scoreA === 0 && match.scoreB === 0);

  // 3. User Involvement
  const inTeamA = match.teamA.some((u) => u.id === user.id);
  const inTeamB = match.teamB.some((u) => u.id === user.id);
  const didIPlay = inTeamA || inTeamB;

  // 4. Personal Result Calculation
  let personalResult = "SPECTATOR";
  if (didIPlay) {
    if (isDraw) personalResult = "DRAW";
    else if ((inTeamA && !isTeamBWin) || (inTeamB && isTeamBWin))
      personalResult = "VICTORY";
    else personalResult = "DEFEAT";
  }

  // 5. Visual Configuration
  let stripeColor = "rgba(255, 255, 255, 0.05)";
  let borderColor = "border-gray-800";
  let bgColor = "bg-gray-900/40";

  if (isPending) {
    borderColor = "border-orange-500/40";
    if (personalResult === "VICTORY") stripeColor = "rgba(34, 197, 94, 0.1)";
    else if (personalResult === "DEFEAT")
      stripeColor = "rgba(239, 68, 68, 0.1)";
    else if (personalResult === "DRAW") stripeColor = "rgba(250, 204, 21, 0.1)";
    else stripeColor = "rgba(251, 146, 60, 0.08)";
  } else if (isRejected) {
    bgColor = "bg-red-950/10";
    borderColor = "border-red-900/30";
  } else {
    if (personalResult === "VICTORY") {
      bgColor = "bg-green-900/10";
      borderColor = "border-green-500/30";
    } else if (personalResult === "DEFEAT") {
      bgColor = "bg-red-900/10";
      borderColor = "border-red-500/30";
    } else if (personalResult === "DRAW") {
      bgColor = "bg-yellow-900/10";
      borderColor = "border-yellow-500/30";
    }
  }

  const stripeStyle = {
    backgroundImage: `repeating-linear-gradient(
      45deg,
      transparent,
      transparent 10px,
      ${stripeColor} 10px,
      ${stripeColor} 20px
    )`,
  };

  const handleAdminAction = (action: "accept" | "reject") => {
    if (isActionLoading) return;
    performAction({ matchId: match.id, action });
  };

  const showAdminActions = isAdmin && (isPending || isRejected);

  return (
    <div
      className={clsx(
        "relative p-4 rounded-xl border transition-all duration-300 flex flex-col gap-4 overflow-hidden group hover:shadow-lg",
        bgColor,
        borderColor,
        isPending && "border-dashed",
        isRejected && "opacity-80 saturate-50"
      )}
    >
      {/* PENDING STRIPES */}
      {isPending && (
        <div
          className="absolute inset-0 pointer-events-none z-0"
          style={stripeStyle}
        />
      )}

      {/* --- HEADER --- */}
      <div className="relative z-10 flex justify-between items-center border-b border-gray-700/30 pb-3 min-h-[32px]">
        {/* Left: Date & Proposer */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 font-medium bg-gray-900/60 border border-gray-700/50 px-2 py-1 rounded-md shadow-sm">
            {dayjs(match.playedAt).format("DD/MM/YYYY")}
          </span>

          {isPending && proposer && (
            <span className="hidden sm:inline-block text-[10px] text-gray-500 bg-gray-900/60 border border-gray-700/50 px-2 py-1 rounded-md">
              Proposed by:{" "}
              <span className="text-gray-300">{proposer.username}</span>
            </span>
          )}
        </div>

        {/* CENTER: ADMIN ACTIONS (Absolute Center) */}
        {showAdminActions && (
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2">
            {/* Mobile: Always visible (flex)
               Desktop: Hidden by default, visible on hover (md:hidden group-hover:md:flex)
            */}
            <div className="flex items-center gap-1 md:hidden group-hover:md:flex bg-gray-900/90 border border-gray-700/80 rounded-lg px-1 py-0.5 shadow-xl animate-in fade-in zoom-in duration-200">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdminAction("accept");
                }}
                disabled={isActionLoading}
                className="p-1 hover:bg-green-500/20 text-green-400 rounded transition-colors cursor-pointer"
                title="Force Accept"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </button>
              {!isRejected && (
                <>
                  <div className="w-px h-3 bg-gray-700" />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAdminAction("reject");
                    }}
                    disabled={isActionLoading}
                    className="p-1 hover:bg-red-500/20 text-red-400 rounded transition-colors cursor-pointer"
                    title="Force Reject"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={3}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>
        )}

        {/* Right: STATUS BADGES */}
        <div className="flex items-center gap-2">
          {isPending ? (
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest bg-orange-500/10 px-2 py-1 rounded border border-orange-500/20 flex items-center gap-2 backdrop-blur-md shadow-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
              <span className="hidden sm:inline">Pending</span>
            </span>
          ) : isRejected ? (
            <span className="text-xs font-bold text-red-400 bg-red-500/5 border border-red-500/20 px-2 py-1 rounded uppercase tracking-wider">
              Rejected
            </span>
          ) : (
            <span
              className={clsx(
                "text-xs font-bold uppercase tracking-widest px-2 py-1 rounded border shadow-sm backdrop-blur-md",
                personalResult === "VICTORY" &&
                  "text-green-400 bg-green-500/10 border-green-500/20",
                personalResult === "DEFEAT" &&
                  "text-red-400 bg-red-500/10 border-red-500/20",
                personalResult === "DRAW" &&
                  "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
                personalResult === "SPECTATOR" &&
                  "text-gray-400 bg-gray-800 border-gray-700"
              )}
            >
              {personalResult}
            </span>
          )}
        </div>
      </div>

      {/* --- TEAMS GRID --- */}
      <div className="relative z-10 grid grid-cols-[1fr_auto_1fr] items-start gap-4">
        {/* Team A */}
        <div className="flex flex-col items-start gap-1">
          <div
            className={clsx(
              "text-[10px] font-bold uppercase tracking-wider mb-1",
              isTeamAWin ? "text-green-500" : "text-gray-500"
            )}
          >
            Team A
          </div>
          {match.teamA.map((p) => (
            <span
              key={p.id}
              className={clsx(
                "text-sm font-medium leading-tight",
                p.id === user.id ? "text-blue-400" : "text-gray-300"
              )}
            >
              {p.username}
            </span>
          ))}
        </div>

        {/* Center Score */}
        <div className="flex flex-col items-center justify-center relative">
          {/* Game Name (Chip Style) */}
          <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2 bg-gray-900/60 border border-gray-700/50 px-2 py-0.5 rounded-md shadow-sm">
            {match.game?.name}
          </span>

          {/* Score Box */}
          <div
            className={clsx(
              "px-5 py-2 rounded-lg border text-2xl font-black min-w-[90px] text-center shadow-lg backdrop-blur-sm",
              isPending
                ? "bg-gray-800/80 text-gray-400 border-gray-600"
                : isDraw
                ? "bg-yellow-500/5 text-yellow-400 border-yellow-500/20"
                : "bg-gray-900 text-white border-gray-700"
            )}
          >
            {showScores ? `${match.scoreA} - ${match.scoreB}` : "VS"}
          </div>
        </div>

        {/* Team B */}
        <div className="flex flex-col items-end gap-1">
          <div
            className={clsx(
              "text-[10px] font-bold uppercase tracking-wider mb-1",
              isTeamBWin ? "text-green-500" : "text-gray-500"
            )}
          >
            Team B
          </div>
          {match.teamB.map((p) => (
            <span
              key={p.id}
              className={clsx(
                "text-sm font-medium leading-tight",
                p.id === user.id ? "text-blue-400" : "text-gray-300"
              )}
            >
              {p.username}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
