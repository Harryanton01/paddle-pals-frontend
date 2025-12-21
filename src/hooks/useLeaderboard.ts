import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export interface LeaderboardEntry {
  id: number;
  username: string;
  elo: number;
  _count: {
    matchesWon: number;
    matchesLost: number;
  };
}

export const useLeaderboard = () => {
  return useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => {
      const response = await api.get<LeaderboardEntry[]>("/users/leaderboard");

      return response.data;
    },
  });
};
