import { api, unwrap } from '@/lib/api'
import type { InterestGroup, PageParams, Paginated, Role, User } from '@/types/api'

export interface CreateUserInput {
  name: string
  email: string
  password: string
  role: Role
  interests: string[]
}

export type UpdateUserInput = Partial<CreateUserInput>

export interface UpdateProfileInput {
  name?: string
  interests?: string[]
}

export interface InterestGroupsParams extends PageParams {
  interest?: string
}

export const getMe = () => unwrap<User>(api.get('/users/me'))

export const updateMe = (body: UpdateProfileInput) => unwrap<User>(api.patch('/users/me', body))

export const listUsers = (params: PageParams) =>
  unwrap<Paginated<User>>(api.get('/users', { params }))

export const createUser = (body: CreateUserInput) => unwrap<User>(api.post('/users', body))

export const updateUser = (id: string, body: UpdateUserInput) =>
  unwrap<User>(api.patch(`/users/${id}`, body))

export const deleteUser = (id: string) => api.delete(`/users/${id}`)

export const groupByInterest = (params: InterestGroupsParams) =>
  unwrap<Paginated<InterestGroup>>(api.get('/users/interests', { params }))
