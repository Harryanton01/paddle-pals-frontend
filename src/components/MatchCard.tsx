import { type Match, useDeleteMatch } from "../hooks/useMatches"; // <--- Import hook
import { useUser } from "../hooks/useUser";

interface MatchCardProps {
  match: Match;
}

export const MatchCard = ({ match }: MatchCardProps) => {
  const { data: user } = useUser();
  const { mutate: deleteMatch, isPending } = useDeleteMatch(); // <--- Use hook

  const isWinner = match.winner.id === user?.id;
  const opponent = isWinner ? match.loser : match.winner;
  const myScore = isWinner ? match.winnerScore : match.loserScore;
  const opponentScore = isWinner ? match.loserScore : match.winnerScore;

  const handleDelete = () => {
    if (confirm("Are you sure? This will revert the ELO changes.")) {
      deleteMatch(match.id);
    }
  };

  return (
    // Added 'group' class to parent to show button on hover
    <div className="group relative flex items-center justify-between bg-gray-800 p-4 rounded-lg border border-gray-700 mb-3 hover:bg-gray-750 transition-colors">
      <div className="flex items-center gap-4">
        <div
          className={`w-2 h-12 rounded-full ${
            isWinner ? "bg-green-500" : "bg-red-500"
          }`}
        ></div>
        <div>
          <p className="text-sm text-gray-400 uppercase font-bold tracking-wider">
            {isWinner ? "Victory" : "Defeat"}
          </p>
          <p className="text-white font-semibold">vs. {opponent.username}</p>
          <p className="text-xs text-gray-500">
            {new Date(match.playedAt).toLocaleDateString()}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6">
        <div className="text-right">
          <span
            className={`text-2xl font-bold ${
              isWinner ? "text-green-400" : "text-red-400"
            }`}
          >
            {myScore}
          </span>
          <span className="text-gray-500 mx-2">-</span>
          <span className="text-2xl font-bold text-gray-400">
            {opponentScore}
          </span>
        </div>

        {/* DELETE BUTTON: Hidden by default, visible on hover */}
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="opacity-0 group-hover:opacity-100 transition-opacity p-2 text-gray-500 hover:text-red-500"
          title="Delete Match"
        >
          {/* Simple Trash Icon SVG */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};
