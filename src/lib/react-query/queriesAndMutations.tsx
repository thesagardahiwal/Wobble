import { INewPost, INewUser, IUpdatePost } from "@/types";
import {
    useQuery,
    useMutation,
    useQueryClient,
    useInfiniteQuery
} from "@tanstack/react-query";
import { createPost, createUserAccount, deletePost, deleteSavedPost, getCurrentUser, getInfinitePost, getPostById, getRecentPosts, getUserById, getUsers, likedPost, savePost, searchPost, signInAccount, signOutAccount, updatePost } from "../appwrite/api";
import { QUERY_KEYS } from "./queryKeys";
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

export const useGetInfinitePosts = () => {
    return useInfiniteQuery ({
        queryKey: [QUERY_KEYS.GET_INFINITE_POSTS],
        queryFn: getInfinitePost,
        getNextPageParam: (lastPage) => {
            if (lastPage && lastPage.documents.length === 0) return null;

            const lastId = lastPage?.documents[lastPage?.documents.length - 1].$id;
            return lastId;
        }
    })
}

export const useGetRecentPostMutation = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
        queryFn: getRecentPosts,
    })
}

export const useGetPostById = (postId: string) => {
    return useQuery ({
        queryKey: [QUERY_KEYS.GET_POST_BY_ID, postId],
        queryFn: () => getPostById(postId),
        enabled: !!postId
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

export const useGetUserById = (userId: string) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
      queryFn: () => getUserById(userId),
      enabled: !!userId,
    });
  };

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
export const useGetUsers = (limit?: number) => {
    return useQuery({
      queryKey: [QUERY_KEYS.GET_USERS],
      queryFn: () => getUsers(limit),
    });
  };
export const useGetCurrentUser = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_CURRENT_USER],
        queryFn: getCurrentUser

    })
}

export const useUpdatePost = () => {
    const queryClient = useQueryClient();
    return useMutation ({
        mutationFn: (post: IUpdatePost) => updatePost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_POST_BY_ID, data?.$id]
            })
        }
    })
}

export const useDeletePost = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({postId, imageId}: {postId: string, imageId: string})=>deletePost(postId, imageId),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS]
            })
        }
    })
}

export const useSearchPosts = (searchTerm: string) => {
    return useQuery ({
        queryKey: [QUERY_KEYS.SEARCH_POSTS, searchTerm],
        queryFn: () => searchPost(searchTerm),
        enabled: !!searchTerm
    })
}