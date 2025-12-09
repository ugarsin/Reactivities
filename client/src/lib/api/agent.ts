import axios from "axios";
import { store } from "../../features/stores/store";
import { toast } from "react-toastify";
import { router } from "../../app/router/Routes";
import type { HandledError } from "../hooks/useAccount";

const agent = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true	
});

agent.interceptors.request.use((config) => {
	store.uiStore.isBusy();
	return config;
});

// Convert ALL axios errors into consistent thrown HandledError
agent.interceptors.response.use(
  (response) => {
    store.uiStore.isIdle();
    return response;
  },
  (error) => {
    store.uiStore.isIdle();

    // No response -> network failure
    if (!error.response) {
      const err: HandledError = {
        __handledError: true,
        errors: ["Network error"]
      };
      toast.error(err.errors[0]);
      throw err;
    }

    const { status, data } = error.response;
    const err: HandledError = { __handledError: true, errors: [] };

    // 400 validation
    if (status === 400) {
      if (data?.errors) {
        for (const key in data.errors) {
          err.errors.push(...data.errors[key]);
        }
      } else if (typeof data === "string") {
        err.errors.push(data);
      }

      err.errors.forEach((e) => {
        if (!(e.includes("Username") && e.includes("is already taken")))
          toast.error(e);
      });

      throw err;
    }

    // 401
    if (status === 401) {
      err.errors = ["Unauthorized"];
      toast.error("Unauthorized");
      throw err;
    }

    // 404
    if (status === 404) {
      router.navigate("/notfound");
      err.errors = ["Not Found"];
      throw err;
    }

    // 500
    if (status === 500) {
      router.navigate("/servererror", { state: { error: data } });
      err.errors = ["Server error"];
      throw err;
    }

    // fallback
    err.errors = ["Request failed"];
    toast.error("Request failed");
    throw err;
  }
);

export default agent;
