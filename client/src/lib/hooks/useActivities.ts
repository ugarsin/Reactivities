import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Activity, ActivityCreate, PagedList } from "../types";
import agent from "../api/agent";
import { useAccount } from "./useAccount";
import { useStore } from "./useStore";

export const useActivities = (id?: string) => {
  const queryClient = useQueryClient();
  const { currentUser } = useAccount();
  const { activityStore: { filter, startDate } } = useStore();
  
  const startDateKey = startDate ? startDate.toISOString() : null;
  const filterKey = String(filter); // or filter ?? "all"
  const {
    data: activitiesGroup,
    isLoading,
    isPending,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  } = useInfiniteQuery<PagedList<Activity, string>>({
    refetchOnWindowFocus: false,
    queryKey: ["activities", filterKey, startDateKey],
    queryFn: async ({ pageParam = null }) => {
      const response = await agent.get<PagedList<Activity, string>>("/activities", {
        params: {
          cursor: pageParam,
          pageSize: 3,
          filter: filterKey,
          startDate: startDateKey
        }
      });
      return response.data;
    },
    initialPageParam: null,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    enabled: !id && !!currentUser,
    // enabled:
    //   !id
    //   &&
    //   location.pathname.startsWith("/activities")
    //   &&
    //   !!currentUser,
    select:
      data => ({
        ...data,
        pages: data.pages.map((page) => ({
          ...page,
          items: page.items.map(activity => {
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
          })
        }))
      })
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
      await agent.put(`/activities/${activity.id}`, activity);
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
    activitiesGroup,
    isPending,
    updateActivity,
    createActivity,
    deleteActivity,
    activity,
    isLoadingActivity,
    updateAttendance,
    isLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage
  }
}