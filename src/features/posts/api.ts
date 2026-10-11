import { api, unwrap } from '@/lib/api'
import type { PageParams, Paginated, Post, PostWithAuthor, UserPosts } from '@/types/api'

export interface PostInput {
  title: string
  content: string
}

export const listPosts = (params: PageParams) =>
  unwrap<Paginated<PostWithAuthor>>(api.get('/posts', { params }))

export const listUserPosts = (userId: string, params: PageParams) =>
  unwrap<UserPosts>(api.get(`/posts/user/${userId}`, { params }))

export const createPost = (body: PostInput) => unwrap<Post>(api.post('/posts', body))

export const updatePost = (id: string, body: Partial<PostInput>) =>
  unwrap<Post>(api.patch(`/posts/${id}`, body))

export const deletePost = (id: string) => api.delete(`/posts/${id}`)
