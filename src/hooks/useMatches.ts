import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useGroup } from "src/context/GroupContext";
import api from "src/api/axios";
import { useNotification } from "src/hooks/useNotification";
import type { Match } from "src/pages/Group/subpages/MatchHistory/useGroupMatches";

export type MatchPayload = {
  gameId: number;
  outcome: "teamA" | "teamB" | "draw";
  playedAt: string;
  teamA: {
    memberIds: number[];
    score?: number;
  };
  teamB: {
    memberIds: number[];
    score?: number;
  };
};

export const useCreateMatch = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { group } = useGroup();
  const { addErrorNotification } = useNotification();

  return useMutation({
    mutationFn: async (payload: MatchPayload) => {
      await api.post("/matches", payload);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["matches"] });

      navigate(`/group/${group.id}`);
    },
    onError: (error) => {
      addErrorNotification(error);
    },
  });
};

export const usePendingMatches = (groupId: number) => {
  return useSuspenseQuery({
    queryKey: ["matches", "pending", groupId],
    queryFn: async () => {
      const { data } = await api.get<Match[]>(
        `/groups/${groupId}/matches/pending`
      );
      return data;
    },
  });
};

export const useMatchAction = () => {
  const queryClient = useQueryClient();
  const { addErrorNotification } = useNotification();

  return useMutation({
    mutationFn: async ({
      matchId,
      action,
    }: {
      matchId: number;
      action: "accept" | "reject";
    }) => {
      await api.post(`/matches/${matchId}/${action}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["matches"] });
    },
    onError: (error) => {
      addErrorNotification(error);
    },
  });
};
