import { useSuspenseQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import api from "../api/axios";

export type LeaderboardEntry = {
  rank: number;
  userId: number;
  username: string;
  elo: number;
  wins: number;
  losses: number;
  draws: number;
  totalPlayed: number;
  winRate: number;
};

type StatsResponse = {
  overview: {
    totalMatches: number;
    totalPlayers: number;
  };
  leaderboard: LeaderboardEntry[];
};

export const useGameStats = (gameId: number) => {
  const { id } = useParams<{ id: string }>();

  return useSuspenseQuery({
    queryKey: ["groupStats", id, gameId],
    queryFn: async () => {
      const { data } = await api.get<StatsResponse>(
        `/groups/${id}/stats?gameId=${gameId}`
      );
      return data;
    },
  });
};

type Rival = {
  username: string;
  winRate: number;
  total: number;
  winsAgainst: number;
};

type PersonalStatsResponse = {
  hasPlayed: boolean;
  rank: number;
  stats: {
    elo: number;
    wins: number;
    losses: number;
    draws: number;
    winRate: number;
    totalPlayed: number;
  };
  streak: {
    type: "win" | "loss" | "draw" | null;
    count: number;
  };
  form: Array<"W" | "L" | "D">;
  rivals: {
    nemesis: Rival | null;
    bunny: Rival | null;
  };
};

export const useMyGameStats = (gameId: number | null) => {
  const { id } = useParams<{ id: string }>();

  return useSuspenseQuery({
    queryKey: ["myGameStats", id, gameId],
    queryFn: async () => {
      const { data } = await api.get<PersonalStatsResponse>(
        `/groups/${id}/stats/me?gameId=${gameId}`
      );
      return data;
    },
  });
};
