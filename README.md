# Secure Notes – Client

React + TypeScript frontend for the Secure Notes API, built with Vite, Tailwind CSS and shadcn/ui.

## Setup

The API must be running on `http://localhost:4000` (see the backend repo).

```bash
npm install
npm run dev        # http://localhost:5173
```

In development, Vite proxies `/api` to the backend, so the refresh-token cookie is same-origin.
To call a different API URL, copy `.env.example` to `.env` and set `VITE_API_URL`.

## Stack

- React Router for routing, with guards for signed-in users and admins
- TanStack Query for fetching, caching and invalidation
- react-hook-form + zod for forms and validation
- axios client that keeps the access token in memory and refreshes it from the
  httpOnly cookie on page load or when a request returns 401

## Structure

```
src/
  lib/          api client, query client, formatting helpers
  types/        API response types
  features/     auth, notes, posts, users – api calls, hooks, schemas, feature components
  pages/        route pages (admin pages under pages/admin)
  components/   layout, shared components and shadcn/ui primitives
```

## Pages

| Route | Who | |
| --- | --- | --- |
| `/login`, `/register` | guests | |
| `/notes` | users | create, edit, delete own notes |
| `/posts` | users | public feed, write posts |
| `/users/:id/posts` | users | all posts by one user |
| `/profile` | users | name, interests, change password |
| `/admin/users` | admins | add, edit, delete users |
| `/admin/notes` | admins | everyone's notes, filter by owner |
| `/admin/interests` | admins | users grouped by interest |
