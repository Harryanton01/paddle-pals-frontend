import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "src/api/axios";

export type MatchUser = {
  id: number;
  username: string;
};

export type Match = {
  id: number;
  playedAt: string;
  gameId: number;
  game: {
    name: string;
  };

  teamA: MatchUser[];
  teamB: MatchUser[];

  scoreA: number;
  scoreB: number;

  result: "TEAM_A_WIN" | "TEAM_B_WIN" | "DRAW";
};

type MatchResponse = {
  data: Match[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
};

type MatchFilters = {
  filter?: "mine" | "all";
  page?: number;
  gameId?: number | null;
};

export const useGroupMatches = ({ filter, page = 1, gameId }: MatchFilters) => {
  const { id } = useParams<{ id: string }>();

  return useSuspenseQuery({
    queryKey: ["groupMatches", id, gameId, filter, page],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10",
      });

      if (gameId) params.append("gameId", gameId.toString());
      if (filter === "mine") params.append("filter", "mine");

      const { data } = await api.get<MatchResponse>(
        `/groups/${id}/matches?${params.toString()}`
      );
      return data;
    },
  });
};
