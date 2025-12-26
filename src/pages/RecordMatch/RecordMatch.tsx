import { useForm, FormProvider, useFormContext } from "react-hook-form";
import { useState } from "react";
import { match, P } from "ts-pattern";
import { useCreateMatch, type MatchPayload } from "src/hooks/useMatches";
import { useGroup } from "src/context/GroupContext";
import { useNavigate } from "react-router-dom";
import { CreateGameButton } from "src/components";
import clsx from "clsx";

type MatchFormValues = {
  gameId: number | null;
  outcome: "teamA" | "teamB" | "draw" | null;
  teamA: {
    score: number;
    members: number[];
  };
  teamB: {
    score: number;
    members: number[];
  };
};

export function mapFormValuesToPayload(data: MatchFormValues): MatchPayload {
  if (!data.gameId) throw new Error("Game ID is required");

  const outcome = data.outcome || "draw";

  return {
    gameId: data.gameId,
    result: outcome,
    teamA: {
      memberIds: data.teamA.members,
      score: data.teamA.score,
    },
    teamB: {
      memberIds: data.teamB.members,
      score: data.teamB.score,
    },
  };
}

const MatchFormContent = ({ onSubmit }: { onSubmit: () => void }) => {
  const { group } = useGroup();
  const [isScoreAvailable, setScoreAvailability] = useState(false);

  const {
    register,
    setValue,
    watch,
    formState: { isSubmitting },
  } = useFormContext<MatchFormValues>();

  const gameId = watch("gameId");
  const outcome = watch("outcome");
  const teamAIds = watch("teamA.members");
  const teamBIds = watch("teamB.members");
  const navigate = useNavigate();
  const opponents = group?.members.map((m) => m.user) || [];

  const isFormValid =
    gameId && outcome && teamAIds.length > 0 && teamBIds.length > 0;

  const hasGames = group?.games?.length > 0;

  // --- Helper Functions ---

  const getAvailablePlayers = () => {
    return opponents.filter(
      (p) => !teamAIds.includes(p.id) && !teamBIds.includes(p.id)
    );
  };

  const addPlayer = (id: number, team: "A" | "B") => {
    if (team === "A") setValue("teamA.members", [...teamAIds, id]);
    else setValue("teamB.members", [...teamBIds, id]);
  };

  const removePlayer = (id: number, team: "A" | "B") => {
    if (team === "A")
      setValue(
        "teamA.members",
        teamAIds.filter((pid) => pid !== id)
      );
    else
      setValue(
        "teamB.members",
        teamBIds.filter((pid) => pid !== id)
      );
  };

  const toggleOutcome = (target: "teamA" | "teamB") => {
    if (outcome === "draw") return;
    setValue("outcome", outcome === target ? null : target);
  };

  const toggleDraw = () => {
    setValue("outcome", outcome === "draw" ? null : "draw");
  };

  const toggleScoreAvailability = () => {
    setScoreAvailability(!isScoreAvailable);
  };

  return match(gameId)
    .with(P.nullish, () => (
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold tracking-tight">Select Game</h1>
          <div className="flex items-center gap-6">
            <CreateGameButton />
            <button
              type="button"
              onClick={() => navigate(`/group/${group?.id}`)}
              className="text-gray-400 hover:text-white transition cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {hasGames ? (
            group?.games?.map((game) => (
              <button
                type="button"
                key={game.id}
                onClick={() => setValue("gameId", game.id)}
                className="bg-gray-700 hover:bg-teal-600 hover:text-white text-gray-200 py-4 px-6 rounded-lg font-bold transition-all transform hover:scale-105 cursor-pointer"
              >
                {game.name}
              </button>
            ))
          ) : (
            <span className="text-gray-500 text-sm italic">No games found</span>
          )}
        </div>
      </div>
    ))
    .otherwise(() => (
      <>
        <div className="flex justify-between items-center mb-6">
          <button
            type="button"
            onClick={() => setValue("gameId", null)}
            className="cursor-pointer"
          >
            <h1 className="text-2xl font-bold tracking-tight">← Change Game</h1>
          </button>
          <div className="flex items-center gap-6">
            <button
              type="button"
              onClick={() => navigate(`/group/${group?.id}`)}
              className="text-gray-400 hover:text-white transition cursor-pointer"
            >
              Back
            </button>
          </div>
        </div>

        <form onSubmit={onSubmit} className="space-y-8">
          <div className="flex justify-end gap-4 items-center bg-gray-900/50 p-4 rounded-lg">
            <label className="flex items-center space-x-3 cursor-pointer">
              <span
                className={clsx(
                  "text-sm font-medium",
                  outcome === "draw" ? "text-yellow-400" : "text-gray-400"
                )}
              >
                🤝 Draw Match
              </span>
              <div
                className={clsx(
                  "w-12 h-6 rounded-full p-1 transition-colors duration-300",
                  outcome === "draw" ? "bg-yellow-500" : "bg-gray-600"
                )}
                onClick={toggleDraw}
              >
                <div
                  className={clsx(
                    "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300",
                    outcome === "draw" ? "translate-x-6" : "translate-x-0"
                  )}
                />
              </div>
            </label>
            <label className="flex items-center space-x-3 cursor-pointer">
              <span className={clsx("text-sm font-medium")}>Enable score</span>
              <div
                className={clsx(
                  "w-12 h-6 rounded-full p-1 transition-colors duration-300",
                  isScoreAvailable ? "bg-green-500" : "bg-gray-600"
                )}
                onClick={toggleScoreAvailability}
              >
                <div
                  className={clsx(
                    "bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300",
                    isScoreAvailable ? "translate-x-6" : "translate-x-0"
                  )}
                />
              </div>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TeamCard
              teamName="Team A"
              isWinner={outcome === "teamA"}
              isDraw={outcome === "draw"}
              onSelectWinner={() => toggleOutcome("teamA")}
            >
              <div className="space-y-4">
                <div className="min-h-[40px] flex flex-wrap gap-2">
                  {teamAIds.length === 0 && (
                    <span className="text-gray-500 text-sm italic w-full text-center">
                      Add player/s
                    </span>
                  )}
                  {teamAIds.map((id) => {
                    const p = opponents.find((o) => o.id === id);
                    return (
                      <Badge
                        key={id}
                        onClick={() => removePlayer(id, "A")}
                        color="blue"
                      >
                        {p?.username} ×
                      </Badge>
                    );
                  })}
                </div>

                <div
                  className={clsx(
                    "overflow-hidden transition-all duration-500 ease-in-out",
                    isScoreAvailable
                      ? "max-h-20 opacity-100 mt-4"
                      : "max-h-0 opacity-0 mt-0"
                  )}
                >
                  <input
                    type="number"
                    placeholder="0"
                    {...register("teamA.score", { valueAsNumber: true })}
                    className="w-full bg-black/20 text-4xl font-bold text-center py-3 rounded-md outline-none focus:ring-2 ring-blue-500/50"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="pt-4 border-t border-gray-600/50">
                  <p className="text-xs text-gray-400 mb-2 uppercase font-bold">
                    Add to Team A
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getAvailablePlayers().map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addPlayer(p.id, "A");
                        }}
                        className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-blue-600 hover:text-white text-gray-300 transition-colors"
                      >
                        + {p.username}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </TeamCard>

            <TeamCard
              teamName="Team B"
              isWinner={outcome === "teamB"}
              isDraw={outcome === "draw"}
              onSelectWinner={() => toggleOutcome("teamB")}
            >
              <div className="space-y-4">
                <div className="min-h-[40px] flex flex-wrap gap-2">
                  {teamBIds.length === 0 && (
                    <span className="text-gray-500 text-sm italic w-full text-center">
                      Add player/s
                    </span>
                  )}
                  {teamBIds.map((id) => {
                    const p = opponents.find((o) => o.id === id);
                    return (
                      <Badge
                        key={id}
                        onClick={() => removePlayer(id, "B")}
                        color="blue"
                      >
                        {p?.username} ×
                      </Badge>
                    );
                  })}
                </div>

                <div
                  className={clsx(
                    "overflow-hidden transition-all duration-500 ease-in-out",
                    isScoreAvailable
                      ? "max-h-20 opacity-100 mt-4"
                      : "max-h-0 opacity-0 mt-0"
                  )}
                >
                  <input
                    type="number"
                    placeholder="0"
                    {...register("teamB.score", { valueAsNumber: true })}
                    className="w-full bg-black/20 text-4xl font-bold text-center py-3 rounded-md outline-none focus:ring-2 ring-blue-500/50"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>

                <div className="pt-4 border-t border-gray-600/50">
                  <p className="text-xs text-gray-400 mb-2 uppercase font-bold">
                    Add to Team B
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {getAvailablePlayers().map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          addPlayer(p.id, "B");
                        }}
                        className="px-2 py-1 text-xs rounded bg-gray-700 hover:bg-purple-600 hover:text-white text-gray-300 transition-colors"
                      >
                        + {p.username}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </TeamCard>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || !isFormValid}
            className="w-full py-4 bg-gradient-to-r from-teal-600 to-gray-600 rounded-lg font-bold text-lg hover:from-teal-500 hover:to-gray-500 transition-all disabled:opacity-50 shadow-lg"
          >
            {isSubmitting ? "Saving match..." : "🏆 Add Match Result"}
          </button>
        </form>
      </>
    ));
};

export const RecordMatch = () => {
  const { group } = useGroup();
  const { mutate: createMatch } = useCreateMatch();

  const methods = useForm<MatchFormValues>({
    defaultValues: {
      gameId: null,
      outcome: null,
      teamA: { score: 0, members: [] },
      teamB: { score: 0, members: [] },
    },
  });

  const onSubmit = (data: MatchFormValues) => {
    createMatch(mapFormValuesToPayload(data));
  };

  if (!group) return null;

  return (
    <div className="text-white flex items-flex-start justify-center p-4">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-3xl border border-gray-700">
        <FormProvider {...methods}>
          <MatchFormContent onSubmit={methods.handleSubmit(onSubmit)} />
        </FormProvider>
      </div>
    </div>
  );
};

const TeamCard = ({
  teamName,
  isWinner,
  isDraw,
  onSelectWinner,
  children,
}: {
  teamName: string;
  isWinner: boolean;
  isDraw: boolean;
  onSelectWinner: () => void;
  children: React.ReactNode;
}) => {
  return (
    <div
      onClick={onSelectWinner}
      className={clsx(
        "relative p-5 rounded-xl border-2 transition-all duration-300 cursor-pointer flex flex-col h-full",
        isWinner
          ? "bg-green-900/20 border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.2)]"
          : "bg-gray-700/30 border-gray-600 hover:bg-gray-700/50",
        isDraw && "opacity-80 cursor-default hover:bg-gray-700/30"
      )}
    >
      {isWinner && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-green-500 text-black text-xs font-bold px-3 py-1 rounded-full shadow-lg">
          WINNER
        </div>
      )}
      <h2
        className={clsx(
          "font-bold text-lg mb-4 text-center",
          isWinner ? "text-green-400" : "text-gray-200"
        )}
      >
        {teamName}
      </h2>
      {children}
    </div>
  );
};

const Badge = ({
  children,
  onClick,
  color,
}: {
  children: React.ReactNode;
  onClick: () => void;
  color: "blue" | "purple";
}) => (
  <span
    onClick={(e) => {
      e.stopPropagation();
      onClick();
    }}
    className={clsx(
      "cursor-pointer px-2 py-1 rounded text-sm font-medium transition-colors flex items-center gap-1 group",
      color === "blue"
        ? "bg-blue-600 hover:bg-red-500"
        : "bg-purple-600 hover:bg-red-500"
    )}
  >
    {children}
  </span>
);
