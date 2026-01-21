import { useState } from "react";
import dayjs from "dayjs";
import clsx from "clsx";
import { usePendingMatches, useMatchAction } from "src/hooks/useMatches";
import { useUser } from "src/context/AuthContext";
import type { Match } from "src/pages/Group/subpages/MatchHistory/useGroupMatches";

export const PendingMatchesButton = ({ groupId }: { groupId: number }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: pendingMatches } = usePendingMatches(groupId);

  if (!pendingMatches || pendingMatches.length === 0) return null;

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 border border-gray-700 shadow-sm cursor-pointer"
      >
        <span>Unresolved</span>
        <span className="bg-red-500 text-white text-xs font-bold px-1.5 py-0.5 rounded-full min-w-[20px] text-center">
          {pendingMatches.length}
        </span>
      </button>

      <PendingMatchesModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        matches={pendingMatches}
      />
    </>
  );
};

const PendingMatchesModal = ({
  isOpen,
  onClose,
  matches,
}: {
  isOpen: boolean;
  onClose: () => void;
  matches: Match[];
}) => {
  const { mutate, isPending } = useMatchAction();

  const handleAction = (matchId: number, action: "accept" | "reject") => {
    mutate({ matchId, action });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative bg-gray-900 border border-gray-700 w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-gray-800 flex justify-between items-center bg-gray-900 sticky top-0 z-10">
          <h3 className="text-xl font-bold text-white">Matches to Review</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="overflow-y-auto p-6 space-y-4">
          {matches.map((match) => (
            <PendingMatchCard
              key={match.id}
              match={match}
              onAction={handleAction}
              isProcessing={isPending}
            />
          ))}

          {matches.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              No more matches to review!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const TeamBox = ({
  teamName,
  isWinner,
  members,
  currentUserId,
}: {
  teamName: string;
  isWinner: boolean;
  members: any[];
  currentUserId: number;
}) => {
  return (
    <div
      className={clsx(
        "relative flex-1 flex flex-col gap-2 p-3 rounded-lg border mt-2", // Added mt-2 to make room for the badge
        isWinner
          ? "bg-green-900/10 border-green-500/30"
          : "bg-gray-800/30 border-transparent"
      )}
    >
      {/* ABSOLUTE WINNER BADGE CUTTING THROUGH BORDER */}
      {isWinner && (
        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-green-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm border border-green-400 z-10 leading-none">
          WINNER
        </div>
      )}

      <div className="flex justify-center items-center">
        <span
          className={clsx(
            "text-xs font-bold uppercase tracking-wider",
            isWinner ? "text-green-400" : "text-gray-500"
          )}
        >
          {teamName}
        </span>
      </div>

      <div className="flex flex-wrap justify-center gap-1.5">
        {members.map((m) => (
          <span
            key={m.id}
            className={clsx(
              "text-xs font-medium border px-2 py-0.5 rounded",
              m.id === currentUserId
                ? "bg-teal-900/40 border-teal-500/50 text-teal-300"
                : "bg-gray-900/60 border-gray-700 text-gray-300"
            )}
          >
            {m.username}
          </span>
        ))}
      </div>
    </div>
  );
};

const PendingMatchCard = ({ match, onAction, isProcessing }: any) => {
  const user = useUser();

  // 1. Am I Team A or Team B?
  const isTeamA = match.teamA.some((u: any) => u.id === user.id);

  // 2. What is the result Fact?
  const isDraw = match.result === "DRAW";
  const isTeamAWin = match.result === "TEAM_A_WIN";
  const isTeamBWin = match.result === "TEAM_B_WIN";

  // 3. What is the result Perspective?
  let buttonText = "Confirm Result";
  let perspective = "NEUTRAL";

  if (isDraw) {
    buttonText = "Accept Draw";
    perspective = "DRAW";
  } else if ((isTeamA && isTeamAWin) || (!isTeamA && isTeamBWin)) {
    buttonText = "Accept Victory";
    perspective = "VICTORY";
  } else {
    buttonText = "Accept Defeat";
    perspective = "DEFEAT";
  }

  const proposer = match.creator || match.createdBy;
  const showScores = !(match.scoreA === 0 && match.scoreB === 0);

  return (
    <div className="bg-gray-800/40 border border-gray-700 rounded-lg overflow-visible flex flex-col shadow-sm">
      {/* HEADER */}
      <div className="bg-gray-900/50 px-4 py-2 flex justify-between items-center border-b border-gray-700/50 rounded-t-lg">
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="font-bold text-teal-500 uppercase tracking-wider">
            {match.game.name}
          </span>
          <span>•</span>
          <span>{dayjs(match.playedAt).format("DD MMM HH:mm")}</span>
        </div>
        {proposer && (
          <div className="text-xs flex items-center gap-1.5 bg-gray-800 px-2 py-1 rounded border border-gray-700">
            <span className="text-gray-500">Proposed by:</span>
            <span className="text-gray-200 font-bold">{proposer.username}</span>
          </div>
        )}
      </div>

      {/* CONTENT */}
      <div className="p-4 flex flex-col gap-4">
        <div className="flex items-start justify-between gap-2">
          {/* TEAM A */}
          <TeamBox
            teamName="Team A"
            isWinner={isTeamAWin}
            members={match.teamA}
            currentUserId={user.id}
          />

          {/* SCORES */}
          <div className="flex flex-col items-center justify-center min-w-[60px] pt-4">
            {showScores ? (
              <div className="text-2xl font-black text-white tracking-widest whitespace-nowrap">
                {match.scoreA} <span className="text-gray-600">-</span>{" "}
                {match.scoreB}
              </div>
            ) : (
              <span className="text-sm font-bold text-gray-600">VS</span>
            )}
            {isDraw && (
              <span className="mt-2 text-[10px] font-bold bg-yellow-500/20 text-yellow-500 px-2 py-0.5 rounded-full border border-yellow-500/20">
                DRAW
              </span>
            )}
          </div>

          {/* TEAM B */}
          <TeamBox
            teamName="Team B"
            isWinner={isTeamBWin}
            members={match.teamB}
            currentUserId={user.id}
          />
        </div>
      </div>

      {/* ACTIONS */}
      <div className="px-4 pb-4 flex gap-3">
        <button
          onClick={() => onAction(match.id, "accept")}
          disabled={isProcessing}
          className={clsx(
            "flex-1 py-2 rounded-lg font-bold text-sm transition-all shadow-lg capitalize cursor-pointer",
            perspective === "VICTORY" &&
              "bg-teal-600 hover:bg-teal-500 text-white shadow-teal-900/20",
            perspective === "DEFEAT" &&
              "bg-red-600 hover:bg-red-500 text-white shadow-red-900/20",
            perspective === "DRAW" &&
              "bg-yellow-600 hover:bg-yellow-500 text-white shadow-yellow-900/20",
            perspective === "NEUTRAL" &&
              "bg-gray-700 hover:bg-gray-600 text-white"
          )}
        >
          {buttonText}
        </button>
        <button
          onClick={() => onAction(match.id, "reject")}
          disabled={isProcessing}
          className="px-6 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 py-2 rounded-lg font-bold text-sm transition-colors cursor-pointer"
        >
          Reject
        </button>
      </div>
    </div>
  );
};
