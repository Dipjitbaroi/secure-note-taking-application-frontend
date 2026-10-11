import { EyeIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { useSearchParams } from 'react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { PageHeader } from '@/components/common/PageHeader'
import { PaginationBar } from '@/components/common/PaginationBar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAllNotes } from '@/features/notes/hooks'
import { useClampPage } from '@/hooks/useClampPage'
import { formatDateTime } from '@/lib/format'
import type { NoteWithOwner } from '@/types/api'

const PAGE_SIZE = 10

export default function AllNotesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const owner = searchParams.get('owner') ?? undefined
  const [page, setPage] = useState(1)
  const [viewing, setViewing] = useState<NoteWithOwner | null>(null)

  const { data, isPending, isError, error, refetch } = useAllNotes({
    page,
    limit: PAGE_SIZE,
    owner,
  })
  useClampPage(data?.meta, setPage)

  const ownerName = owner ? data?.items[0]?.owner?.name : undefined

  const filterByOwner = (ownerId?: string) => {
    setPage(1)
    setSearchParams(ownerId ? { owner: ownerId } : {})
  }

  return (
    <>
      <PageHeader
        title="All notes"
        description="Every user's notes. Admins can view them but not edit them."
        actions={
          owner && (
            <Badge variant="secondary" className="h-7 gap-1 pr-1">
              Owner: {ownerName ?? 'selected user'}
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label="Clear owner filter"
                onClick={() => filterByOwner()}
              >
                <XIcon />
              </Button>
            </Badge>
          )
        }
      />

      {isPending ? (
        <ListSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : data.items.length === 0 ? (
        <EmptyState title="No notes found" />
      ) : (
        <Card className="py-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Owner</TableHead>
                <TableHead>Updated</TableHead>
                <TableHead className="w-0 text-right">View</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.items.map((note) => (
                <TableRow key={note._id}>
                  <TableCell className="max-w-72 truncate font-medium">{note.title}</TableCell>
                  <TableCell>
                    {note.owner ? (
                      <button
                        type="button"
                        className="text-left hover:underline"
                        title="Show only this user's notes"
                        onClick={() => filterByOwner(note.owner!._id)}
                      >
                        {note.owner.name}
                        <span className="block text-xs text-muted-foreground">
                          {note.owner.email}
                        </span>
                      </button>
                    ) : (
                      <span className="text-muted-foreground">Deleted user</span>
                    )}
                  </TableCell>
                  <TableCell>{formatDateTime(note.updatedAt)}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      aria-label="View note"
                      onClick={() => setViewing(note)}
                    >
                      <EyeIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}

      <PaginationBar meta={data?.meta} onPageChange={setPage} />

      <Dialog open={!!viewing} onOpenChange={(open) => !open && setViewing(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="break-words">{viewing?.title}</DialogTitle>
            <DialogDescription>
              {viewing?.owner?.name ?? 'Deleted user'} ·{' '}
              {viewing && formatDateTime(viewing.updatedAt)}
            </DialogDescription>
          </DialogHeader>
          <p className="max-h-[60vh] overflow-y-auto text-sm break-words whitespace-pre-wrap">
            {viewing?.content || <span className="text-muted-foreground italic">No content</span>}
          </p>
        </DialogContent>
      </Dialog>
    </>
  )
}
