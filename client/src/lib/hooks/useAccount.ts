import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import type { LoginSchema } from "../schemas/loginSchema";
import type { RegisterSchema } from "../schemas/registerSchema";
import type { User } from "../types";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";
import { AxiosError } from "axios";

export const useAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginUser = useMutation({
    mutationFn: async (creds: LoginSchema) => {
      await agent.post("/account/login", creds);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["user"]});
    }
  });

  const registerUser = useMutation({
    mutationFn: async (creds: RegisterSchema) => {
      await agent.post("/account/register", creds);
      navigate("/activities");
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({queryKey: ["user"]});
    },
    onError: (error: unknown) => {
      // Narrow it down to AxiosError
      if (error instanceof AxiosError) {
        const data = error.response?.data;

        // Case 1: backend returned an array of strings
        if (Array.isArray(data)) {
          data.forEach((msg: string) => toast.error(msg));
          return;
        }

        if (Array.isArray(data)) {
          data.forEach(value => {
            if (typeof value === "string") {
              toast.error(value);
            }
          });
          return;
        }

        toast.error("Registration failed.");
        return;
      }

      // Fallback for non-Axios errors
      toast.error("An unexpected error occurred.");
    }
  });

  const logoutUser = useMutation({
    mutationFn: async () => {
      await agent.post("/account/logout");
    },
    onSuccess: async () => {
      // queryClient.removeQueries({queryKey: ["user"]});
      // queryClient.removeQueries({queryKey: ["activities"]});
      queryClient.clear();
      navigate("/");
    }
  });

  const { data: currentUser, isLoading: loadingUserInfo } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const response = await agent.get<User>("/account/user-info");
      return response.data;
    },
    enabled: !queryClient.getQueryData(["data"])
  });

  return {
    loginUser,
    logoutUser,
    registerUser,
    currentUser,
    loadingUserInfo
  };
}