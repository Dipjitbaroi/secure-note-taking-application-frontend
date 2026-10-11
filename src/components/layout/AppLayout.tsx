import { LogOutIcon, NotebookPenIcon, UserIcon } from 'lucide-react'
import { NavLink, Outlet, useNavigate } from 'react-router'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useAuth } from '@/features/auth/auth-context'
import { cn } from '@/lib/utils'

const userLinks = [
  { to: '/notes', label: 'My notes' },
  { to: '/posts', label: 'Posts' },
]

const adminLinks = [
  { to: '/admin/users', label: 'Users' },
  { to: '/admin/notes', label: 'All notes' },
  { to: '/admin/interests', label: 'Interests' },
]

function navClass({ isActive }: { isActive: boolean }) {
  return cn(
    'rounded-md px-3 py-1.5 text-sm transition-colors hover:bg-muted',
    isActive ? 'bg-muted font-medium text-foreground' : 'text-muted-foreground',
  )
}

export function AppLayout() {
  const { user, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const links = isAdmin ? [...userLinks, ...adminLinks] : userLinks

  return (
    <div className="min-h-svh bg-muted/30">
      <header className="sticky top-0 z-10 border-b bg-background">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4">
          <NavLink to="/notes" className="flex items-center gap-2 font-semibold">
            <NotebookPenIcon className="size-5" />
            <span className="hidden sm:inline">Secure Notes</span>
          </NavLink>

          <nav className="flex flex-1 items-center gap-1 overflow-x-auto">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} className={navClass}>
                {link.label}
              </NavLink>
            ))}
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger render={<Button variant="ghost" className="gap-2" />}>
              <UserIcon />
              <span className="hidden max-w-32 truncate sm:inline">{user?.name}</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex flex-col gap-1">
                  <span className="truncate">{user?.email}</span>
                  <Badge variant={isAdmin ? 'default' : 'secondary'} className="capitalize">
                    {user?.role}
                  </Badge>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => navigate('/profile')}>
                <UserIcon />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem variant="destructive" onClick={() => logout()}>
                <LogOutIcon />
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-6">
        <Outlet />
      </main>
    </div>
  )
}
