import { useState } from "react";
import { useOpponents, useCreateMatch } from "../hooks/useMatches";
import { useNavigate } from "react-router-dom";

export const RecordMatch = () => {
  const navigate = useNavigate();
  const { data: opponents } = useOpponents();
  const { mutate: createMatch, isPending } = useCreateMatch();

  const [opponentId, setOpponentId] = useState<string>("");
  const [myScore, setMyScore] = useState<string>("");
  const [opponentScore, setOpponentScore] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!opponentId || !myScore || !opponentScore) return;

    createMatch({
      opponentId: parseInt(opponentId),
      myScore: parseInt(myScore),
      opponentScore: parseInt(opponentScore),
    });
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl w-full max-w-md">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">🏓 Record Match</h1>
          <button
            onClick={() => navigate("/")}
            className="text-gray-400 hover:text-white"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Opponent Select */}
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              Played Against
            </label>
            <select
              className="w-full p-3 rounded bg-gray-700 border border-gray-600 focus:border-blue-500 outline-none"
              value={opponentId}
              onChange={(e) => setOpponentId(e.target.value)}
              required
            >
              <option value="">Select Opponent...</option>
              {opponents?.map((op) => (
                <option key={op.id} value={op.id}>
                  {op.username}
                </option>
              ))}
            </select>
            {opponents?.length === 0 && (
              <p className="text-xs text-yellow-500 mt-2">
                No other players found. Create another user in Incognito mode to
                test!
              </p>
            )}
          </div>

          {/* 2. Scores */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                My Score
              </label>
              <input
                type="number"
                min="0"
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-center text-xl font-bold focus:border-blue-500 outline-none"
                value={myScore}
                onChange={(e) => setMyScore(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Their Score
              </label>
              <input
                type="number"
                min="0"
                className="w-full p-3 rounded bg-gray-700 border border-gray-600 text-center text-xl font-bold focus:border-blue-500 outline-none"
                value={opponentScore}
                onChange={(e) => setOpponentScore(e.target.value)}
                required
              />
            </div>
          </div>

          {/* 3. Submit */}
          <button
            type="submit"
            disabled={isPending}
            className="w-full bg-green-500 hover:bg-green-600 py-3 rounded font-bold text-lg disabled:opacity-50 transition-colors"
          >
            {isPending ? "Recording..." : "Record Result"}
          </button>
        </form>
      </div>
    </div>
  );
};
