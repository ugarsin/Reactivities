import { useLocalObservable } from "mobx-react-lite"
import { HubConnection, HubConnectionBuilder, HubConnectionState } from "@microsoft/signalr"
import { useEffect, useRef } from "react";
import type { ChatComment } from "../types";
import { runInAction } from "mobx";

export const useComments = (activityId?: string) => {
  const createdConnection = useRef(false);
  const commentStore = useLocalObservable(() => ({
    comments: [] as ChatComment[],
    hubConnection: null as HubConnection | null,
    createHubConnection(activityId: string) {
      if (!activityId) return;

      this.hubConnection = new HubConnectionBuilder()
        .withUrl(`${import.meta.env.VITE_COMMENTS_URL}?activityId=${activityId}`, {
          withCredentials: true,
        })
        .withAutomaticReconnect()
        .build();

      this.hubConnection.start().catch(err =>
        console.log("Error establishing connection", err)
      );

      this.hubConnection.on("ReceiveComment", comment => {
        runInAction(() => {
          comment.createdAt = new Date(comment.createdAt);  // 👈 FIX
          this.comments.push(comment);
        });
      });
    },
    stopHubConnection() {
      if (this.hubConnection?.state === HubConnectionState.Connected) {
        this.hubConnection?.stop().catch(
          error => console.log("Error stopping connection: ", error)
        )
      }
    }
  }));

  useEffect(() => {
    if (activityId && !createdConnection.current) {
      commentStore.createHubConnection(activityId);
      createdConnection.current = true;
    }
    return () => {
      commentStore.stopHubConnection();
      commentStore.comments = [];
    }
  }, [activityId, commentStore]);

  return {
    commentStore
  }
}