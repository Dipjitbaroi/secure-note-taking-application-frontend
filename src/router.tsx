import { createBrowserRouter, Navigate } from 'react-router'
import { AppLayout } from '@/components/layout/AppLayout'
import { GuestOnly, RequireAdmin, RequireAuth } from '@/features/auth/RouteGuards'
import AllNotesPage from '@/pages/admin/AllNotesPage'
import InterestsPage from '@/pages/admin/InterestsPage'
import UsersPage from '@/pages/admin/UsersPage'
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
          {
            path: '/admin',
            element: <RequireAdmin />,
            children: [
              { index: true, element: <Navigate to="/admin/users" replace /> },
              { path: 'users', element: <UsersPage /> },
              { path: 'notes', element: <AllNotesPage /> },
              { path: 'interests', element: <InterestsPage /> },
            ],
          },
        ],
      },
    ],
  },
  { path: '*', element: <NotFoundPage /> },
])
