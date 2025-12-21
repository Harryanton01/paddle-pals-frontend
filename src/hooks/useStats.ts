import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

interface UserStats {
  elo: number;
  rank: number;
  totalPlayers: number;
  topPercent: number;
  wins: number;
  losses: number;
  totalMatches: number;
  winRate: number;
}

export const useStats = () => {
  return useQuery({
    queryKey: ["stats"],
    queryFn: async () => {
      const response = await api.get<UserStats>("/users/stats");

      return response.data;
    },
  });
};
