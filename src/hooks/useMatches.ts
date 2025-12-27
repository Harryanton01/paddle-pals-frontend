import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useGroup } from "src/context/GroupContext";
import api from "src/api/axios";
import { useNotification } from "src/hooks/useNotification";

export type MatchPayload = {
  gameId: number;
  result: "teamA" | "teamB" | "draw";
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
