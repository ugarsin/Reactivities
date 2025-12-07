import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { Photo, Profile, User } from "../types";
import agent from "../api/agent";
import { toast } from "react-toastify";
import { useMemo } from "react";

export const useProfile = (id?: string) => {
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
    isLoading: loadingPhotos
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

  return {
    profile,
    loadingProfile,
    photos,
    loadingPhotos,
    isCurrentUser,
    uploadPhoto,
    setMainPhoto,
    deletePhoto
  }
}