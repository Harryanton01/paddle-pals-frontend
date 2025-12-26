import { useSuspenseQuery } from "@tanstack/react-query";
import api from "src/api/axios";

export type GroupList = Array<{
  id: number;
  name: string;
  memberCount: number;
  gameCount: number;
  matchCount: number;
}>;

export const useGroups = () => {
  return useSuspenseQuery({
    queryKey: ["groups"],
    queryFn: async () => {
      const response = await api.get<GroupList>("/groups");
      return response.data;
    },
  });
};
