import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Activity, Photo, Profile, User } from "../types";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { useMemo, useState } from "react";
import type { EditProfileSchema } from "../schemas/editProfileSchema";

export const useProfile = (id?: string) => {
  const [filter, setFilter] = useState<string | null>(null);
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading: loadingProfile
  } = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const response = await agent.get<Profile>(`/profiles/${id}`);
      return response.data;
    },
    meta: {
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error("Profile fetch failed:" + ` ${err.message}`);
        } else {
          toast.error("Unknown error");
        }
      }
    }
  });

  const {
    data: photos,
    isLoading: loadingPhotos,
  } = useQuery<Photo[]>({
    queryKey: ["photos", id],
    queryFn: async () => {
      const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
      return response.data;
    },
    meta: {
      onError: (err: unknown) => {
        if (err instanceof Error) {
          toast.error("Profile fetch failed:" + ` ${err.message}`);
        } else {
          toast.error("Unknown error");
        }
      }
    },
    enabled: !!id
  });

  const uploadPhoto = useMutation({
    mutationFn: async (file: Blob) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await agent.post("/profiles/add-photo", formData, {
        headers: { "Contet-type": "multipart/form-data" }
      });
      return response.data;
    },
    onSuccess: async (photo: Photo) => {
      await queryClient.invalidateQueries({ queryKey: ["photos", id] });
      queryClient.setQueryData(["user"], (data: User) => {
        if (!data) return data;
        return {
          ...data,
          imageUrl: data.imageUrl ?? photo.url
        };
      });
      queryClient.setQueryData(["profile"], (data: Profile) => {
        if (!data) return data;
        return {
          ...data,
          imageUrl: data.imageUrl ?? photo.url
        };
      });
    }
  })

  const setMainPhoto = useMutation({
    mutationFn: async (photoId: string) => {
      await agent.put(`/profiles/${photoId}/set-main`);
    },

    // OPTIMISTIC UPDATE
    onMutate: async (photoId: string) => {
      await queryClient.cancelQueries({ queryKey: ["photos", id] });

      const previousPhotos = queryClient.getQueryData<Photo[]>(["photos", id]);
      const previousUser = queryClient.getQueryData<User>(["user"]);

      // Optimistically update photos
      if (previousPhotos) {
        const updatedPhotos = previousPhotos.map((p) => ({
          ...p,
          isMain: p.id === photoId
        }));

        queryClient.setQueryData(["photos", id], updatedPhotos);
      }

      // Optimistically update currentUser imageUrl
      const mainPhotoUrl = previousPhotos?.find(p => p.id === photoId)?.url;
      if (previousUser && mainPhotoUrl) {
        queryClient.setQueryData(["user"], {
          ...previousUser,
          imageUrl: mainPhotoUrl
        });
      }

      return { previousPhotos, previousUser };
    },

    // ROLLBACK IF ERROR
    onError: (_err, _photoId, context) => {
      if (context?.previousPhotos) {
        queryClient.setQueryData(["photos", id], context.previousPhotos);
      }
      if (context?.previousUser) {
        queryClient.setQueryData(["user"], context.previousUser);
      }
    },

    // AFTER SUCCESS
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile", id] });
      await queryClient.invalidateQueries({ queryKey: ["photos", id] });
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    }
  });

  const deletePhoto = useMutation({
    mutationFn: (photoId: string) => agent.delete(`/profiles/${photoId}/photos`),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["photos", id] });
      await queryClient.invalidateQueries({ queryKey: ["profile", id] });
    }
  });

  const isCurrentUser = useMemo(() => {
    return id === queryClient.getQueryData<User>(["user"])?.id;
  }, [id, queryClient])

  const updateFollow = useMutation({
    mutationFn: async (id: string) => {
      if (!profile) return;

      if (profile.following) {
        await agent.delete(`/follows/${id}`);
      } else {
        await agent.post(`/follows/${id}`);
      }
    },

    // OPTIMISTIC UPDATE
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["profile", id] });

      const previousProfile = queryClient.getQueryData<Profile>(["profile", id]);

      if (previousProfile) {
        queryClient.setQueryData<Profile>(["profile", id], {
          ...previousProfile,
          following: !previousProfile.following,
          followersCount: previousProfile.following
            ? previousProfile.followersCount - 1
            : previousProfile.followersCount + 1
        });
      }

      return { previousProfile };
    },

    // ROLLBACK
    onError: (_err, _vars, context) => {
      if (context?.previousProfile) {
        queryClient.setQueryData(["profile", id], context.previousProfile);
      }
    },

    // SYNC WITH SERVER
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["profile", id] });
    }
  });

  const updateProfile = useMutation({
    mutationFn: async (profile: EditProfileSchema) => {
      await agent.put(`/profiles`, profile);
    },
    onSuccess: (_, profile) => {
      queryClient.setQueryData(['profile', id], (data: Profile) => {
        if (!data) return data;
        return {
          ...data,
          displayName: profile.displayName,
          bio: profile.bio
        }
      });
      queryClient.setQueryData(['user'], (userData: User) => {
        if (!userData) return userData;
        return {
          ...userData,
          displayName: profile.displayName
        }
      });
    }
  });

  const { data: userActivities, isLoading: loadingUserActivities } = useQuery({
    queryKey: ['user-activities', filter],
    queryFn: async () => {
      const response = await agent.get<Activity[]>(`/profiles/${id}/activities`, {
        params: {
          filter
        }
      });
      return response.data
    },
    enabled: !!id && !!filter
  });
  return {
    profile,
    loadingProfile,
    photos,
    loadingPhotos,
    isCurrentUser,
    uploadPhoto,
    setMainPhoto,
    deletePhoto,
    updateFollow,
    updateProfile,
    userActivities,
    loadingUserActivities,
    filter,
    setFilter
  }
}