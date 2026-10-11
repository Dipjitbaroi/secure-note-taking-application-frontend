export type Role = 'user' | 'admin'

export interface User {
  _id: string
  name: string
  email: string
  role: Role
  interests: string[]
  createdAt: string
  updatedAt: string
}

export interface Note {
  _id: string
  owner: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface NoteWithOwner extends Omit<Note, 'owner'> {
  owner: Pick<User, '_id' | 'name' | 'email'> | null
}

export interface Post {
  _id: string
  title: string
  content: string
  createdAt: string
  updatedAt: string
}

export interface PostWithAuthor extends Post {
  author: Pick<User, '_id' | 'name'> | null
}

export interface InterestGroup {
  interest: string
  count: number
  users: Pick<User, '_id' | 'name' | 'email'>[]
}

export interface PageMeta {
  page: number
  limit: number
  total: number
  totalPages: number
}

export interface Paginated<T> {
  items: T[]
  meta: PageMeta
}

export interface UserPosts extends Paginated<Post> {
  author: Pick<User, '_id' | 'name'>
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
}

export interface AuthResult extends AuthTokens {
  user: User
}

export interface PageParams {
  page: number
  limit?: number
}
