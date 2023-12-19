import { INewPost, INewUser } from "@/types";
import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from "@tanstack/react-query";
import { createPost, createUserAccount, deleteSavedPost, getCurrentUser, getRecentPosts, likedPost, savePost, signInAccount, signOutAccount } from "../appwrite/api";
import { QUERY_KEYS } from "./QueryKeys";
import { string } from "zod";

export const useCreateUserAccountMutation = () => {
    return useMutation ({
        mutationFn: (user: INewUser) => createUserAccount(user)
    })
}

export const useSignInAccountMutation = () => {
    return useMutation ({
        mutationFn: (user: {
            email: string,
            password: string
        } ) => signInAccount(user)
    })
}
 
export const useSignOutAccountMutation = () => {
    return useMutation ({
        mutationFn: signOutAccount
    })
}
 
export const useCreatePostMutaion = () => {
    const queryClient = useQueryClient();
    return useMutation({
      mutationFn: (post: INewPost) => createPost(post),
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        });
      },
    });
  };

export const useGetRecentPostMutation = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}

export const useLikePostMutation = () => {
    const queryClient = useQueryClient();
    return useMutation ({
        mutationFn: ({postId, likesArray}:{postId: string; likesArray: string[]}) => likedPost(postId, likesArray),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, data?.$id]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}
export const useSavePostMutation = () => {
    const queryClient = useQueryClient();
    return useMutation ({
        mutationFn: ({postId, userId}:{postId: string; userId: string}) => savePost(postId, userId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}
export const useDeleteSavedPostMutation = () => {
    const queryClient = useQueryClient();
    return useMutation ({
        mutationFn: (savedRecordId: string) => deleteSavedPost(savedRecordId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POSTS]
            })
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_CURRENT_USER]
            })
        }
    })
}

export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser
    })
}