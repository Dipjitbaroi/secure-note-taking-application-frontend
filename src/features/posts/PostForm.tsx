import { zodResolver } from '@hookform/resolvers/zod'
import type { ReactNode } from 'react'
import { useForm } from 'react-hook-form'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { postSchema, type PostValues } from './schemas'

// Shared by the "new post" card and the edit dialog. `onSubmit` returns true
// when the form should be cleared.
export function PostForm({
  defaultValues = { title: '', content: '' },
  onSubmit,
  renderActions,
}: {
  defaultValues?: PostValues
  onSubmit: (values: PostValues) => Promise<boolean>
  renderActions: (isSubmitting: boolean) => ReactNode
}) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<PostValues>({ resolver: zodResolver(postSchema), defaultValues })

  const submit = async (values: PostValues) => {
    if (await onSubmit(values)) reset({ title: '', content: '' })
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.title}>
          <FieldLabel htmlFor="post-title">Title</FieldLabel>
          <Input id="post-title" aria-invalid={!!errors.title} {...register('title')} />
          <FieldError errors={[errors.title]} />
        </Field>
        <Field data-invalid={!!errors.content}>
          <FieldLabel htmlFor="post-content">Content</FieldLabel>
          <Textarea
            id="post-content"
            rows={4}
            aria-invalid={!!errors.content}
            {...register('content')}
          />
          <FieldError errors={[errors.content]} />
        </Field>
        {renderActions(isSubmitting)}
      </FieldGroup>
    </form>
  )
}
