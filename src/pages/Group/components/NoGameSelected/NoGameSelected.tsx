import { ChartBarIcon, GamepadIcon } from "lucide-react";
import { useGroup } from "src/context/GroupContext";
import { match } from "ts-pattern";
import { CreateGameButton } from "src/components";

export const NoGameSelected = () => {
  const { group } = useGroup();

  const hasGames = group.games.length > 0;

  const fallbackContent = match(hasGames)
    .with(true, () => (
      <>
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
          <ChartBarIcon className="w-8 h-8 text-gray-600" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">Select a Game</h3>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            Please select a specific game from the top menu to view more stats.
          </p>
        </div>
      </>
    ))
    .with(false, () => (
      <>
        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
          <GamepadIcon className="w-8 h-8 text-gray-600" />
        </div>
        <div>
          <div className="flex items-center justify-center mb-2">
            <CreateGameButton />
          </div>
          <p className="text-gray-500 text-sm max-w-xs mx-auto">
            No games exist in this group. Create a game to get started.
          </p>
        </div>
      </>
    ))
    .exhaustive();

  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
      {fallbackContent}
    </div>
  );
};
