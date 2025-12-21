import { useQuery } from "@tanstack/react-query";
import api from "../api/axios";

export interface OpponentStat {
  username: string;
  avatarUrl: string | null;
  wins: number;
  losses: number;
  total: number;
  winRate: number;
}

// ... existing useStats hook ...

export const useOpponentStats = () => {
  return useQuery({
    queryKey: ["stats-opponents"],
    queryFn: async () => {
      const response = await api.get<OpponentStat[]>("/users/stats/opponents");

      return response.data;
    },
  });
};
