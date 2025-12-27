import { BanIcon } from "lucide-react";

export const NoMatchesPlayed = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 bg-gray-900/30 rounded-xl border border-dashed border-gray-800">
      <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
        <BanIcon className="w-8 h-8 text-gray-600" />
      </div>
      <div>
        <div className="flex items-center justify-center mb-2">
          No matches played yet.
        </div>
        <p className="text-gray-500 text-sm max-w-xs mx-auto">
          Record a match to get started.
        </p>
      </div>
    </div>
  );
};
