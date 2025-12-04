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
      await agent.post("/account/login", creds);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  });

  // REGISTER ------------------------------------------
  const registerUser = useMutation<User, HandledError, RegisterSchema>({
    mutationFn: async (creds) => {
      const response = await agent.post<User>("/account/register", creds);
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
      await agent.post("/account/logout");
    },
    onSuccess: async () => {
      queryClient.clear();
      navigate("/");
    }
  });

  // // GET CURRENT USER ----------------------------------
  // const { data: currentUser, isLoading: loadingUserInfo } = useQuery<
  //   User | null,
  //   HandledError
  // >({
  //   queryKey: ["user"],
  //   queryFn: async () => {
  //     const response = await agent.get<User>("/account/user-info");
  //     return response.data ?? null;
  //   },
  //   enabled: !queryClient.getQueryData(["data"])
  // });

  const { data: currentUser, isLoading: loadingUserInfo } = useQuery<
    User | null,
    HandledError
  >({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await agent.get<User>("/account/user-info");
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
