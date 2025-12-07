import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Activity, ActivityCreate } from "../types";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { useAccount } from "./useAccount";

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const { currentUser } = useAccount();

  const { data: activities, isPending } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const response = await agent.get<Activity[]>("/activities");
      return response.data;
    },
    enabled:
      !id
      &&
      location.pathname === "/activities"
      &&
      !!currentUser,
    select:
      data => {
        return data.map(activity => {
          const host = activity.attendees.find(x => x.id === activity.hostId);
          const url = host?.imageUrl;
          return {
            ...activity,
            isHost: currentUser?.id === activity.hostId,
            isGoing: activity.attendees.some(
              x => x.id === currentUser?.id
            ),
            hostImageUrl: url
          };
        });
      }
  });

  const { data: activity, isLoading: isLoadingActivity } = useQuery({
    queryKey: ["activities", id],
    queryFn: async () => {
      const response = await agent.get<Activity>(`/activities/${id}`);
      return response.data;
    },
    enabled:
      !!id
      &&
      !!currentUser,
    select:
      (data): Activity => {
        const host = data.attendees.find(x => x.id === data.hostId);
        const url = host?.imageUrl;
        return {
          ...data,
          isHost: currentUser?.id === data.hostId,
          isGoing: data.attendees.some(
            x => x.id === currentUser?.id
          ),
          hostImageUrl: url
        }
      }
  })

  const updateActivity = useMutation({
    mutationFn: async (activity: Activity) => {
      await agent.put("/activities", activity);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["activities"] });
    }
  })

  const createActivity = useMutation({
    mutationFn: async (activity: ActivityCreate) => {
      const response = await agent.post("/activities", activity);
      return response.data; // this is the new id
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["activities"] });
    }
  });

  const deleteActivity = useMutation({
    mutationFn: async (id: string) => {
      await agent.delete(`/activities/${id}`);
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["activities"] });
    }
  })

  const updateAttendance = useMutation({
    mutationFn: async (id: string) => {
      await agent.post(`/activities/${id}/attend`);
    },
    onSuccess: async (_, id) => {
      // Invalidate both the list and the details
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["activities"] }),
        queryClient.invalidateQueries({ queryKey: ["activities", id] })
      ]);
    }
  });

  return {
    activities,
    isPending,
    updateActivity,
    createActivity,
    deleteActivity,
    activity,
    isLoadingActivity,
    updateAttendance
  }
}