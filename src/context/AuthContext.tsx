import { createContext, useContext, type ReactNode } from "react";
import { useSuspenseQuery, useQueryClient } from "@tanstack/react-query";
import api from "../api/axios";

export type User = {
  id: number;
  username: string;
};

export const fetchCurrentUser = async (): Promise<User | null> => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  try {
    const { data } = await api.get<User>("/auth/me");
    return data;
  } catch (error) {
    localStorage.removeItem("token");
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
    const { data } = await api.post("/auth/login", payload);
    

    localStorage.setItem("token", data.token);

    queryClient.setQueryData(["authUser"], data.user);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (e) {
      // Ignore logout errors (e.g. server already thinks we are logged out)
    }

    localStorage.removeItem("token");

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