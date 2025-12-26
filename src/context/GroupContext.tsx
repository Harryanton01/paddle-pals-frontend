import { createContext, useContext, type ReactNode } from "react";
import { useParams } from "react-router-dom";
import { useSuspenseQuery } from "@tanstack/react-query";
import api from "src/api/axios";

export type Group = {
  id: number;
  name: string;
  inviteCode: string;
  members: {
    user: {
      id: number;
      username: string;
    };
    role: string;
  }[];
  games: {
    id: number;
    name: string;
  }[];
};

type GroupContextType = {
  group: Group;
};

const GroupContext = createContext<GroupContextType | null>(null);

const fetchGroup = async (id: string) => {
  const { data } = await api.get<Group>(`/groups/${id}`);
  return data;
};

export const GroupProvider = ({ children }: { children: ReactNode }) => {
  const params = useParams<{ id: string }>();

  if (!params.id) {
    throw new Error("GroupProvider must be used inside a route with :id");
  }

  const { data: group } = useSuspenseQuery({
    queryKey: ["group", params.id],
    queryFn: () => fetchGroup(params.id!),
  });

  return (
    <GroupContext.Provider value={{ group }}>{children}</GroupContext.Provider>
  );
};

export const useGroup = (): GroupContextType => {
  const context = useContext(GroupContext);
  if (!context) {
    throw new Error("useGroup must be used within GroupProvider");
  }
  return context;
};
