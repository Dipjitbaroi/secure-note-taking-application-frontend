import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as postsApi from './api'
import type { PostInput } from './api'

export const POSTS_PAGE_SIZE = 10

export const postKeys = {
  all: ['posts'] as const,
  feed: (page: number) => ['posts', 'feed', page] as const,
  byUser: (userId: string, page: number) => ['posts', 'user', userId, page] as const,
}

export function usePostsFeed(page: number) {
  return useQuery({
    queryKey: postKeys.feed(page),
    queryFn: () => postsApi.listPosts({ page, limit: POSTS_PAGE_SIZE }),
    placeholderData: keepPreviousData,
  })
}

export function useUserPosts(userId: string, page: number) {
  return useQuery({
    queryKey: postKeys.byUser(userId, page),
    queryFn: () => postsApi.listUserPosts(userId, { page, limit: POSTS_PAGE_SIZE }),
    placeholderData: keepPreviousData,
  })
}

function useInvalidatePosts() {
  const queryClient = useQueryClient()
  return () => queryClient.invalidateQueries({ queryKey: postKeys.all })
}

export function useCreatePost() {
  const invalidate = useInvalidatePosts()
  return useMutation({ mutationFn: postsApi.createPost, onSuccess: invalidate })
}

export function useUpdatePost() {
  const invalidate = useInvalidatePosts()
  return useMutation({
    mutationFn: ({ id, ...body }: Partial<PostInput> & { id: string }) =>
      postsApi.updatePost(id, body),
    onSuccess: invalidate,
  })
}

export function useDeletePost() {
  const invalidate = useInvalidatePosts()
  return useMutation({ mutationFn: postsApi.deletePost, onSuccess: invalidate })
}
