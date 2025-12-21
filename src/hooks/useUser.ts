import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

interface User {
  id: number;
  username: string;
  email: string;
  elo: number;
}

const fetchUser = async (): Promise<User | null> => {
  try {
    const { data } = await api.get("/auth/me");
    return data.user;
  } catch (error: unknown) {
    console.error(error);
    // If 401 (Unauthorized), we return null (not logged in)
    // We do NOT want to throw an error here, or the UI will crash
    return null;
  }
};

export const useUser = () => {
  return useSuspenseQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    staleTime: Infinity, // User data doesn't change unless we change it
  });
};

export const useRegister = () => {
  const navigate = useNavigate(); // Make sure to import useNavigate from 'react-router-dom'

  return useMutation({
    mutationFn: async (credentials: {
      email: string;
      password: string;
      username: string;
    }) => {
      // 1. Create the account
      await api.post("/auth/register", credentials);
    },
    onSuccess: () => {
      // 2. Redirect to login so they can sign in
      alert("Account created! Please log in.");
      navigate("/login");
    },
    onError: () => {
      alert("Registration failed");
    },
  });
};

// --- Mutations (Login/Logout) ---

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (credentials: { email: string; password: string }) => {
      const { data } = await api.post("/auth/login", credentials);
      return data.user;
    },
    onSuccess: (user) => {
      // Direct Cache Update: No need to refetch!
      // We instantly tell React Query: "Here is the user data"
      queryClient.setQueryData(["user"], user);
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      await api.post("/auth/logout");
    },
    onSuccess: () => {
      queryClient.setQueryData(["user"], null);
      queryClient.removeQueries({ queryKey: ["matches"] });
    },
  });
};
