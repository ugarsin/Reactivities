import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import type { LoginSchema } from "../schemas/loginSchema";
import type { RegisterSchema } from "../schemas/registerSchema";
import type { User } from "../types";
import { useNavigate } from "react-router";

export type HandledError = {
  __handledError: true;
  errors: string[];
};

export const useAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // LOGIN ---------------------------------------------
  const loginUser = useMutation<void, HandledError, LoginSchema>({
    mutationFn: async (creds) => {
      const result = await agent.post("/accounts/login", creds);
      return result.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  });

  // REGISTER ------------------------------------------
  const registerUser = useMutation<User, HandledError, RegisterSchema>({
    mutationFn: async (creds) => {
      const response = await agent.post<User>("/accounts/register", creds);
      navigate("/activities");
      return response.data;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  });

  // LOGOUT --------------------------------------------
  const logoutUser = useMutation<void, HandledError>({
    mutationFn: async () => {
      await agent.post("/accounts/logout");
    },
    onSuccess: async () => {
      queryClient.clear();
      navigate("/");
    }
  });

  // GET CURRENT USER ----------------------------------
  const { data: currentUser, isLoading: loadingUserInfo } = useQuery<
    User | null,
    HandledError
  >({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await agent.get<User>("/accounts/user-info");
      return response.data ?? null;
    },
    retry: 0,
    refetchOnWindowFocus: false,
  });

  return {
    loginUser,
    logoutUser,
    registerUser,
    currentUser,
    loadingUserInfo
  };
};
