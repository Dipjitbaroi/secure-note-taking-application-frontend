import { PencilIcon, Trash2Icon } from 'lucide-react'
import type { ReactNode } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/format'
import type { Note } from '@/types/api'

export function NoteCard({
  note,
  onEdit,
  onDelete,
  footer,
}: {
  note: Pick<Note, '_id' | 'title' | 'content' | 'updatedAt'>
  onEdit?: () => void
  onDelete?: () => void
  footer?: ReactNode
}) {
  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="line-clamp-2 break-words">{note.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        {note.content ? (
          <p className="line-clamp-6 text-sm break-words whitespace-pre-wrap text-muted-foreground">
            {note.content}
          </p>
        ) : (
          <p className="text-sm text-muted-foreground italic">No content</p>
        )}
      </CardContent>
      <CardFooter className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground">
          {footer ?? `Updated ${formatDateTime(note.updatedAt)}`}
        </span>
        {(onEdit || onDelete) && (
          <div className="flex gap-1">
            {onEdit && (
              <Button variant="ghost" size="icon-sm" aria-label="Edit note" onClick={onEdit}>
                <PencilIcon />
              </Button>
            )}
            {onDelete && (
              <Button variant="ghost" size="icon-sm" aria-label="Delete note" onClick={onDelete}>
                <Trash2Icon className="text-destructive" />
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  )
}
