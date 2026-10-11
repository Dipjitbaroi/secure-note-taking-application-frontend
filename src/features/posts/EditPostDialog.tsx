import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { getErrorMessage } from '@/lib/api'
import type { Post } from '@/types/api'
import { useUpdatePost } from './hooks'
import { PostForm } from './PostForm'

export function EditPostDialog({ post, onClose }: { post: Post | null; onClose: () => void }) {
  const updatePost = useUpdatePost()

  return (
    <Dialog open={!!post} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit post</DialogTitle>
        </DialogHeader>
        {post && (
          <PostForm
            defaultValues={{ title: post.title, content: post.content }}
            onSubmit={async (values) => {
              try {
                await updatePost.mutateAsync({ id: post._id, ...values })
                toast.success('Post updated')
                onClose()
              } catch (error) {
                toast.error(getErrorMessage(error))
              }
              return false
            }}
            renderActions={(isSubmitting) => (
              <DialogFooter>
                <DialogClose render={<Button type="button" variant="outline" />}>
                  Cancel
                </DialogClose>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving…' : 'Save'}
                </Button>
              </DialogFooter>
            )}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
