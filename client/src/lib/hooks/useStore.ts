import { useContext } from "react";
import { StoreContext } from "../../features/stores/store";

export function useStore() {
  return useContext(StoreContext);
}