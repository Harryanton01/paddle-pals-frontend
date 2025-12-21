import { useOpponentStats } from "../hooks/useOpponentStats";

export const OpponentBreakdown = () => {
  const { data: opponents, isLoading } = useOpponentStats();

  if (isLoading)
    return <div className="text-gray-500">Loading rivalries...</div>;

  return (
    <div className="bg-gray-800 rounded-xl border border-gray-700 overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-gray-700">
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
          <span>⚔️</span> Rivalries
        </h3>
        <p className="text-sm text-gray-400">breakdown by opponent</p>
      </div>

      <div className="flex-1 overflow-y-auto max-h-96">
        {opponents?.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No matches recorded yet.
          </div>
        ) : (
          <div className="divide-y divide-gray-700">
            {opponents?.map((op) => (
              <div
                key={op.username}
                className="p-4 flex items-center justify-between hover:bg-gray-750 transition-colors"
              >
                {/* Left: Opponent Info */}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center font-bold text-gray-300">
                    {op.avatarUrl ? (
                      <img
                        src={op.avatarUrl}
                        className="w-full h-full rounded-full"
                      />
                    ) : (
                      op.username.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-white">{op.username}</p>
                    <p className="text-xs text-gray-500">
                      {op.total} matches played
                    </p>
                  </div>
                </div>

                {/* Right: Win Rate Bar */}
                <div className="text-right w-32">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-green-400">{op.wins} W</span>
                    <span className="text-red-400">{op.losses} L</span>
                  </div>

                  {/* Visual Bar */}
                  <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden flex">
                    <div
                      className="bg-green-500 h-full"
                      style={{ width: `${op.winRate}%` }}
                    />
                    <div
                      className="bg-red-500 h-full"
                      style={{ width: `${100 - op.winRate}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">{op.winRate}% WR</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
