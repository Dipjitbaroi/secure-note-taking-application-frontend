import { zodResolver } from '@hookform/resolvers/zod'
import { Controller, useForm } from 'react-hook-form'
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
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { getErrorMessage } from '@/lib/api'
import { parseInterests } from '@/lib/format'
import type { User } from '@/types/api'
import { useCreateUser, useUpdateUser } from './hooks'
import { createUserSchema, editUserSchema, type UserFormValues } from './schemas'

const roleItems = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
]

interface UserFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  user?: User | null
}

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit user' : 'Add user'}</DialogTitle>
        </DialogHeader>
        <UserForm user={user} onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}

function UserForm({ user, onDone }: { user?: User | null; onDone: () => void }) {
  const createUser = useCreateUser()
  const updateUser = useUpdateUser()
  const isEdit = !!user

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserFormValues>({
    resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
    defaultValues: {
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
      role: user?.role ?? 'user',
      interests: user?.interests.join(', ') ?? '',
    },
  })

  const onSubmit = async ({ password, interests, ...values }: UserFormValues) => {
    const body = {
      ...values,
      interests: parseInterests(interests),
      ...(password ? { password } : {}),
    }
    try {
      if (user) {
        await updateUser.mutateAsync({ id: user._id, ...body })
        toast.success('User updated')
      } else {
        await createUser.mutateAsync({ ...body, password })
        toast.success('User created')
      }
      onDone()
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <FieldGroup>
        <Field data-invalid={!!errors.name}>
          <FieldLabel htmlFor="user-name">Name</FieldLabel>
          <Input id="user-name" aria-invalid={!!errors.name} {...register('name')} />
          <FieldError errors={[errors.name]} />
        </Field>
        <Field data-invalid={!!errors.email}>
          <FieldLabel htmlFor="user-email">Email</FieldLabel>
          <Input id="user-email" type="email" aria-invalid={!!errors.email} {...register('email')} />
          <FieldError errors={[errors.email]} />
        </Field>
        <Field data-invalid={!!errors.password}>
          <FieldLabel htmlFor="user-password">Password</FieldLabel>
          <Input
            id="user-password"
            type="password"
            autoComplete="new-password"
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          {isEdit && (
            <FieldDescription>
              Leave empty to keep the current password. Setting one signs the user out.
            </FieldDescription>
          )}
          <FieldError errors={[errors.password]} />
        </Field>
        <Field>
          <FieldLabel>Role</FieldLabel>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <Select
                items={roleItems}
                value={field.value}
                onValueChange={(value) => value && field.onChange(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {roleItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="user-interests">Interests</FieldLabel>
          <Input id="user-interests" placeholder="chess, reading" {...register('interests')} />
          <FieldDescription>Separated by commas.</FieldDescription>
        </Field>
        <DialogFooter>
          <DialogClose render={<Button type="button" variant="outline" />}>Cancel</DialogClose>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : 'Save'}
          </Button>
        </DialogFooter>
      </FieldGroup>
    </form>
  )
}
