import { FileTextIcon, PencilIcon, PlusIcon, Trash2Icon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { PageHeader } from '@/components/common/PageHeader'
import { PaginationBar } from '@/components/common/PaginationBar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuth } from '@/features/auth/auth-context'
import { useDeleteUser, useUsers } from '@/features/users/hooks'
import { UserFormDialog } from '@/features/users/UserFormDialog'
import { useClampPage } from '@/hooks/useClampPage'
import { getErrorMessage } from '@/lib/api'
import { formatDate } from '@/lib/format'
import type { User } from '@/types/api'

export default function UsersPage() {
  const { user: me } = useAuth()
  const [page, setPage] = useState(1)
  const { data, isPending, isError, error, refetch } = useUsers(page)
  useClampPage(data?.meta, setPage)

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [deleting, setDeleting] = useState<User | null>(null)
  const deleteUser = useDeleteUser()

  const openForm = (user: User | null) => {
    setEditing(user)
    setFormOpen(true)
  }

  const confirmDelete = async () => {
    if (!deleting) return
    try {
      await deleteUser.mutateAsync(deleting._id)
      toast.success('User deleted')
      setDeleting(null)
    } catch (err) {
      toast.error(getErrorMessage(err))
    }
  }

  return (
    <>
      <PageHeader
        title="Users"
        description="Add, edit and remove accounts."
        actions={
          <Button onClick={() => openForm(null)}>
            <PlusIcon />
            Add user
          </Button>
        }
      />

      {isPending ? (
        <ListSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : data.items.length === 0 ? (
        <EmptyState title="No users" />
      ) : (
        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Interests</TableHead>
                <TableHead>Joined</TableHead>
                <TableHead className="w-0 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((user) => (
                <TableRow key={user._id}>
                  <TableCell className="font-medium">
                    {user.name}
                    {user._id === me?._id && (
                      <span className="ml-1 text-xs text-muted-foreground">(you)</span>
                    )}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={user.role === 'admin' ? 'default' : 'secondary'}
                      className="capitalize"
                    >
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell className="max-w-56">
                    <div className="flex flex-wrap gap-1">
                      {user.interests.length ? (
                        user.interests.map((interest) => (
                          <Badge key={interest} variant="outline">
                            {interest}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-muted-foreground">—</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{formatDate(user.createdAt)}</TableCell>
                  <TableCell>
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="View notes"
                        title="View notes"
                        render={<Link to={`/admin/notes?owner=${user._id}`} />}
                      >
                        <FileTextIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Edit user"
                        onClick={() => openForm(user)}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Delete user"
                        disabled={user._id === me?._id}
                        onClick={() => setDeleting(user)}
                      >
                        <Trash2Icon className="text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <PaginationBar meta={data?.meta} onPageChange={setPage} />

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} user={editing} />
      <ConfirmDialog
        open={!!deleting}
        onOpenChange={(open) => !open && setDeleting(null)}
        title={`Delete ${deleting?.name ?? 'user'}?`}
        description="Their account, notes and posts will be permanently deleted."
        pending={deleteUser.isPending}
        onConfirm={confirmDelete}
      />
    </>
  )
}
