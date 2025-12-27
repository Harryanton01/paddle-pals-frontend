import { useState } from "react";
import { useGroup } from "src/context/GroupContext";
import { Link } from "react-router-dom";
import {
  CopyIcon,
  ChartBarIcon,
  ChartNoAxesCombinedIcon,
  HistoryIcon,
} from "lucide-react";
import { useNotification } from "src/hooks/useNotification";
import { match } from "ts-pattern";
import clsx from "clsx";

import { MatchHistory, Leaderboard, MyStats } from "./subpages";

export const Group = () => {
  const { group } = useGroup();
  const [activeTab, setActiveTab] = useState<
    "history" | "stats" | "leaderboard"
  >("history");
  const [selectedGameId, setSelectedGameId] = useState<number | null>(null);
  const { addNotification } = useNotification();

  const handleCopyInviteCode = () => {
    if (group?.inviteCode) {
      navigator.clipboard.writeText(group.inviteCode);
      addNotification("Invite code copied!", "success");
    }
  };

  const content = match(activeTab)
    .with("history", () => <MatchHistory selectedGameId={selectedGameId} />)
    .with("leaderboard", () => <Leaderboard selectedGameId={selectedGameId} />)
    .with("stats", () => <MyStats selectedGameId={selectedGameId} />)
    .exhaustive();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-black text-white tracking-tight">
              {group.name}
            </h1>
            <button
              onClick={handleCopyInviteCode}
              className="flex items-center gap-2 px-2 py-1 bg-gray-800/50 hover:bg-gray-800 text-gray-400 hover:text-white text-xs font-mono rounded border border-gray-700 transition-colors cursor-pointer"
              title="Copy Invite Code"
            >
              {group.inviteCode}
              <CopyIcon className="w-3 h-3" />
            </button>
          </div>
          <p className="text-gray-400 text-sm">
            {group.members?.length || 0} Members • {group.games?.length || 0}{" "}
            Games
          </p>
        </div>

        <Link
          to="matches/new"
          className="bg-teal-600 hover:bg-teal-500 text-white px-5 py-2.5 rounded-lg font-bold shadow-lg shadow-teal-500/20 transition-all flex items-center gap-2 hover:scale-105 active:scale-95"
        >
          <span>+ Record Match</span>
        </Link>
      </div>

      <div className="flex overflow-x-auto pb-2 gap-2 no-scrollbar border-b border-gray-800/50">
        <button
          onClick={() => setSelectedGameId(null)}
          className={clsx(
            "px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border cursor-pointer",
            selectedGameId === null
              ? "bg-white text-black border-white"
              : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white"
          )}
        >
          All Games
        </button>

        {group.games?.map((game) => (
          <button
            key={game.id}
            onClick={() => setSelectedGameId(game.id)}
            className={clsx(
              "px-4 py-1.5 rounded-full text-sm font-bold whitespace-nowrap transition-all border cursor-pointer",
              selectedGameId === game.id
                ? "bg-teal-600 text-white border-teal-500 shadow-md shadow-teal-500/20"
                : "bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700 hover:text-white"
            )}
          >
            {game.name}
          </button>
        ))}
      </div>

      <div className="border-b border-gray-800 flex gap-6">
        <button
          onClick={() => setActiveTab("history")}
          className={clsx(
            "pb-3 text-sm font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer",
            activeTab === "history"
              ? "border-teal-500 text-white"
              : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
          )}
        >
          <HistoryIcon className="w-4 h-4" />
          History
        </button>
        <button
          onClick={() => setActiveTab("leaderboard")}
          className={clsx(
            "pb-3 text-sm font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer",
            activeTab === "leaderboard"
              ? "border-teal-500 text-white"
              : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
          )}
        >
          <ChartBarIcon className="w-4 h-4" />
          Leaderboard
        </button>
        <button
          onClick={() => setActiveTab("stats")}
          className={clsx(
            "pb-3 text-sm font-bold uppercase tracking-wider border-b-2 flex items-center gap-2 transition-all cursor-pointer",
            activeTab === "stats"
              ? "border-teal-500 text-white"
              : "border-transparent text-gray-500 hover:text-gray-300 hover:border-gray-700"
          )}
        >
          <ChartNoAxesCombinedIcon className="w-4 h-4" />
          Stats
        </button>
      </div>

      <div className="min-h-[400px] animate-in fade-in duration-300">
        {content}
      </div>
    </div>
  );
};
