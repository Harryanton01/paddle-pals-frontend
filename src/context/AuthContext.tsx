// context/AuthContext.tsx
import { createContext, useContext, type ReactNode } from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export type User = {
  id: number;
  username: string;
};

export const fetchCurrentUser = async (): Promise<User | null> => {
  try {
    const { data } = await api.get<User>("/auth/me");

    return data;
  } catch (error) {
    return null;
  }
};
interface AuthContextType {
  user: User | null;
  login: (data: { username: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient();

  const { data: user } = useSuspenseQuery({
    queryKey: ["authUser"],
    queryFn: fetchCurrentUser,
    staleTime: 1000 * 60 * 10,
    retry: false,
  });

  const login = async (payload: { username: string; password: string }) => {
    await api.post("/auth/login", payload);
    await queryClient.invalidateQueries({ queryKey: ["authUser"] });
  };

  const logout = async () => {
    await api.post("/auth/logout");
    queryClient.setQueryData(["authUser"], null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};

export const useUser = (): User => {
  const context = useAuth();
  if (!context.user) {
    throw new Error("useCurrentUser called in a guest context");
  }
  return context.user;
};
