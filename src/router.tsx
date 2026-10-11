import { createBrowserRouter, Navigate } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { GuestOnly, RequireAuth } from '@/features/auth/RouteGuards'
import LoginPage from '@/pages/LoginPage'
import NotesPage from '@/pages/NotesPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PostsPage from '@/pages/PostsPage'
import ProfilePage from '@/pages/ProfilePage'
import RegisterPage from '@/pages/RegisterPage'
import UserPostsPage from '@/pages/UserPostsPage'

export const router = createBrowserRouter([
  {
    element: <GuestOnly />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <Navigate to="/notes" replace /> },
          { path: '/notes', element: <NotesPage /> },
          { path: '/posts', element: <PostsPage /> },
          { path: '/users/:userId/posts', element: <UserPostsPage /> },
          { path: '/profile', element: <ProfilePage /> },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
