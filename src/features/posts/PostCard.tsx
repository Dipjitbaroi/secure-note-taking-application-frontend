import { PencilIcon, Trash2Icon } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { formatDateTime } from '@/lib/format'
import type { Post, PostWithAuthor } from '@/types/api'

export function PostCard({
  post,
  author,
  onEdit,
  onDelete,
}: {
  post: Post
  author?: PostWithAuthor['author']
  onEdit?: () => void
  onDelete?: () => void
}) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <CardTitle className="break-words">{post.title}</CardTitle>
            <CardDescription className="mt-1">
              {author ? (
                <Link
                  to={`/users/${author._id}/posts`}
                  className="font-medium text-foreground hover:underline"
                >
                  {author.name}
                </Link>
              ) : author === null ? (
                <span>Deleted user</span>
              ) : null}
              {author !== undefined && ' · '}
              {formatDateTime(post.createdAt)}
            </CardDescription>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex shrink-0 gap-1">
              {onEdit && (
                <Button variant="ghost" size="icon-sm" aria-label="Edit post" onClick={onEdit}>
                  <PencilIcon />
                </Button>
              )}
              {onDelete && (
                <Button variant="ghost" size="icon-sm" aria-label="Delete post" onClick={onDelete}>
                  <Trash2Icon className="text-destructive" />
                </Button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm break-words whitespace-pre-wrap">{post.content}</p>
      </CardContent>
    </Card>
  )
}
