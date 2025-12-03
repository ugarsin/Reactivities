import axios from "axios";
import { store } from "../../features/stores/store";
import { toast } from "react-toastify";
import { router } from "../../app/router/Routes";

const agent = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true
});

agent.interceptors.request.use(config => {
  store.uiStore.isBusy();
  return config;
});

// This ensures ALL errors become NORMAL resolved responses.
agent.interceptors.response.use(
  async response => {
    store.uiStore.isIdle();
    return response; // success path
  },
  async error => {
    store.uiStore.isIdle();

    // Defensive: missing response (network error)
    if (!error.response) {
      toast.error("Network error");
      return { __handledError: true, errors: ["Network error"] };
    }

    const { status, data } = error.response;

    // Handle 400 validation
    if (status === 400) {
      const errors: string[] = [];

      if (data?.errors) {
        // Modelstate validation structure
        for (const key in data.errors) {
          errors.push(...data.errors[key]);
        }
      } else if (typeof data === "string") {
        errors.push(data);
      }

      errors.forEach(err => {
          if (
            !(
              err.includes("Username") 
              && 
              err.includes("is already taken")
            )
          ) {
            toast.error(err);
          }
        }
      );

      return {
        __handledError: true,
        errors
      };
    }

    // Handle 401
    if (status === 401) {
      toast.error("Unauthorized");
      return { __handledError: true, errors: ["Unauthorized"] };
    }

    // Handle 404
    if (status === 404) {
      router.navigate("/notfound");
      return { __handledError: true, errors: ["Not Found"] };
    }

    // Handle 500
    if (status === 500) {
      router.navigate("/servererror", { state: { error: data } });
      return { __handledError: true, errors: ["Server error"] };
    }

    // Default fallback
    toast.error("Request failed");
    return {
      __handledError: true,
      errors: ["Request failed"]
    };
  }
);

export default agent;
