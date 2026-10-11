import { ArrowLeftIcon } from 'lucide-react'
import { useState } from 'react'
import { Link, useParams } from 'react-router'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { PageHeader } from '@/components/common/PageHeader'
import { PaginationBar } from '@/components/common/PaginationBar'
import { Button } from '@/components/ui/button'
import { EditPostDialog } from '@/features/posts/EditPostDialog'
import { useUserPosts } from '@/features/posts/hooks'
import { PostCard } from '@/features/posts/PostCard'
import { usePostActions } from '@/features/posts/usePostActions'
import { useClampPage } from '@/hooks/useClampPage'

// Backed by the $lookup aggregation: GET /posts/user/:userId
export default function UserPostsPage() {
  const { userId = '' } = useParams()
  const [page, setPage] = useState(1)
  const { data, isPending, isError, error, refetch } = useUserPosts(userId, page)
  useClampPage(data?.meta, setPage)
  const actions = usePostActions()

  return (
    <>
      <Button variant="ghost" size="sm" className="mb-2" render={<Link to="/posts" />}>
        <ArrowLeftIcon />
        All posts
      </Button>
      <PageHeader
        title={data ? `Posts by ${data.author.name}` : 'Posts'}
        description="Every post written by this user."
      />

      {isPending ? (
        <ListSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : data.items.length === 0 ? (
        <EmptyState title="No posts yet" description={`${data.author.name} hasn't posted anything.`} />
      ) : (
        <div className="space-y-4">
          {data.items.map((post) => (
            <PostCard
              key={post._id}
              post={post}
              onEdit={actions.canEdit(userId) ? () => actions.setEditing(post) : undefined}
              onDelete={actions.canDelete(userId) ? () => actions.setDeleting(post) : undefined}
            />
          ))}
        </div>
      )}

      <PaginationBar meta={data?.meta} onPageChange={setPage} />

      <EditPostDialog post={actions.editing} onClose={() => actions.setEditing(null)} />
      <ConfirmDialog
        open={!!actions.deleting}
        onOpenChange={(open) => !open && actions.setDeleting(null)}
        title="Delete this post?"
        description={actions.deleting ? `"${actions.deleting.title}" will be removed.` : undefined}
        pending={actions.isDeleting}
        onConfirm={actions.confirmDelete}
      />
    </>
  )
}
