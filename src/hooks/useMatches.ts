import { useQuery } from "@tanstack/react-query";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

export interface Match {
  id: number;
  winnerScore: number;
  loserScore: number;
  playedAt: string;
  winner: {
    id: number;
    username: string;
    avatarUrl: string | null;
  };
  loser: {
    id: number;
    username: string;
    avatarUrl: string | null;
  };
}

const fetchMatches = async (): Promise<Match[]> => {
  const { data } = await api.get("/matches");
  return data;
};

export const useMatches = () => {
  return useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
  });
};

// 1. Hook to get list of opponents
export const useOpponents = () => {
  return useQuery({
    queryKey: ["opponents"],
    queryFn: async () => {
      const { data } = await api.get("/matches/opponents");
      return data as { id: number; username: string }[];
    },
  });
};

// 2. Hook to create a match
export const useCreateMatch = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: {
      opponentId: number;
      myScore: number;
      opponentScore: number;
    }) => {
      await api.post("/matches", data);
    },
    onSuccess: () => {
      // Invalidate queries to refresh the dashboard
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["user"] }); // To update my ELO

      // Go back to dashboard
      navigate("/");
    },
  });
};

export const useDeleteMatch = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (matchId: number) => {
      await api.delete(`/matches/${matchId}`);
    },
    onSuccess: () => {
      // Refresh list AND user stats (since ELO changed)
      queryClient.invalidateQueries({ queryKey: ["matches"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
