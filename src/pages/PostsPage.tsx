import { useState } from 'react'
import { toast } from 'sonner'
import { ConfirmDialog } from '@/components/common/ConfirmDialog'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { PageHeader } from '@/components/common/PageHeader'
import { PaginationBar } from '@/components/common/PaginationBar'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { EditPostDialog } from '@/features/posts/EditPostDialog'
import { useCreatePost, usePostsFeed } from '@/features/posts/hooks'
import { PostCard } from '@/features/posts/PostCard'
import { PostForm } from '@/features/posts/PostForm'
import { usePostActions } from '@/features/posts/usePostActions'
import { useClampPage } from '@/hooks/useClampPage'
import { getErrorMessage } from '@/lib/api'

export default function PostsPage() {
  const [page, setPage] = useState(1)
  const { data, isPending, isError, error, refetch } = usePostsFeed(page)
  useClampPage(data?.meta, setPage)

  const createPost = useCreatePost()
  const actions = usePostActions()

  return (
    <>
      <PageHeader title="Posts" description="Posts are public to every signed-in user." />

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <section className="order-2 space-y-4 lg:order-1">
          {isPending ? (
            <ListSkeleton />
          ) : isError ? (
            <ErrorState error={error} onRetry={refetch} />
          ) : data.items.length === 0 ? (
            <EmptyState title="No posts yet" description="Be the first one to write something." />
          ) : (
            data.items.map((post) => (
              <PostCard
                key={post._id}
                post={post}
                author={post.author}
                onEdit={
                  actions.canEdit(post.author?._id) ? () => actions.setEditing(post) : undefined
                }
                onDelete={
                  actions.canDelete(post.author?._id) ? () => actions.setDeleting(post) : undefined
                }
              />
            ))
          )}
          <PaginationBar meta={data?.meta} onPageChange={setPage} />
        </section>

        <Card className="order-1 h-fit lg:order-2">
          <CardHeader>
            <CardTitle>New post</CardTitle>
          </CardHeader>
          <CardContent>
            <PostForm
              onSubmit={async (values) => {
                try {
                  await createPost.mutateAsync(values)
                  toast.success('Post published')
                  setPage(1)
                  return true
                } catch (err) {
                  toast.error(getErrorMessage(err))
                  return false
                }
              }}
              renderActions={(isSubmitting) => (
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Publishing…' : 'Publish'}
                </Button>
              )}
            />
          </CardContent>
        </Card>
      </div>

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
