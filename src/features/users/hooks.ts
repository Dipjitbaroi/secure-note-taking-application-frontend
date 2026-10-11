import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import * as usersApi from './api'
import type { InterestGroupsParams, UpdateUserInput } from './api'

export const USERS_PAGE_SIZE = 10

export const userKeys = {
  all: ['users'] as const,
  list: (page: number) => ['users', 'list', page] as const,
  interests: (params: InterestGroupsParams) => ['users', 'interests', params] as const,
}

export function useUsers(page: number) {
  return useQuery({
    queryKey: userKeys.list(page),
    queryFn: () => usersApi.listUsers({ page, limit: USERS_PAGE_SIZE }),
    placeholderData: keepPreviousData,
  })
}

export function useInterestGroups(params: InterestGroupsParams) {
  return useQuery({
    queryKey: userKeys.interests(params),
    queryFn: () => usersApi.groupByInterest(params),
    placeholderData: keepPreviousData,
  })
}

// User changes can affect every user-related view (lists, interest groups)
// and notes/posts (a deleted user's content is removed too).
function useInvalidateUsers() {
  const queryClient = useQueryClient()
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: userKeys.all }),
      queryClient.invalidateQueries({ queryKey: ['notes'] }),
      queryClient.invalidateQueries({ queryKey: ['posts'] }),
    ])
}

export function useCreateUser() {
  const invalidate = useInvalidateUsers()
  return useMutation({ mutationFn: usersApi.createUser, onSuccess: invalidate })
}

export function useUpdateUser() {
  const invalidate = useInvalidateUsers()
  return useMutation({
    mutationFn: ({ id, ...body }: UpdateUserInput & { id: string }) =>
      usersApi.updateUser(id, body),
    onSuccess: invalidate,
  })
}

export function useDeleteUser() {
  const invalidate = useInvalidateUsers()
  return useMutation({ mutationFn: usersApi.deleteUser, onSuccess: invalidate })
}

export function useUpdateProfile() {
  const invalidate = useInvalidateUsers()
  return useMutation({ mutationFn: usersApi.updateMe, onSuccess: invalidate })
}
