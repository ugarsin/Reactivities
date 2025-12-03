import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import type { LoginSchema } from "../schemas/loginSchema";
import type { RegisterSchema } from "../schemas/registerSchema";
import type { User } from "../types";
import { useNavigate } from "react-router";
import type { AxiosResponse } from "axios";

type HandledError = {
  __handledError: true;
  errors: string[];
};

export const useAccount = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginUser = useMutation({
    mutationFn: async (creds: LoginSchema) => {
      await agent.post("/account/login", creds);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  });

  // const registerUser = useMutation({
  //   mutationFn: async (creds: RegisterSchema) => {
  //     await agent.post("/account/register", creds);
  //     navigate("/activities");
  //   },
  //   onSuccess: async () => {
  //     await queryClient.invalidateQueries({ queryKey: ["user"] });
  //   },
  //   onError: (error: AxiosError | string[]) => {
  //     // CASE 1: Validation errors (array)
  //     if (Array.isArray(error)) {
  //       error.forEach((err: string) => {
  //         if (err.includes("Email")) console.log("Email");
  //         if (err.includes("Password")) console.log("Password");
  //       });
  //       return;
  //     }

  //     // // CASE 2: Axios error object
  //     // if (error.response?.data) {
  //     //   console.log("Server error:", error.response.data);
  //     //   return;
  //     // }
  //   }
  // });

  const registerUser = useMutation<
    AxiosResponse | HandledError, // TData
    unknown,                      // TError (you can type later)
    RegisterSchema                // TVariables (IMPORTANT!)
  >({
    mutationFn: async (creds: RegisterSchema) => {
      const result = await agent.post("/account/register", creds);

      // SAFE TYPE GUARD
      if ("__handledError" in result) {
        return result;
      }

      navigate("/activities");
      return result;
    },

    onSuccess: async (result) => {
      if ("__handledError" in result) return;
      await queryClient.invalidateQueries({ queryKey: ["user"] });
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