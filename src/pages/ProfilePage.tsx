import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { PageHeader } from '@/components/common/PageHeader'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import * as authApi from '@/features/auth/api'
import { useAuth } from '@/features/auth/auth-context'
import { changePasswordSchema, type ChangePasswordValues } from '@/features/auth/schemas'
import { useUpdateProfile } from '@/features/users/hooks'
import { profileSchema, type ProfileValues } from '@/features/users/schemas'
import { getErrorMessage, setTokens } from '@/lib/api'
import { formatDate, parseInterests } from '@/lib/format'

export default function ProfilePage() {
  const { user } = useAuth()
  if (!user) return null

  return (
    <>
      <PageHeader
        title="Profile"
        description={
          <span className="flex items-center gap-2">
            {user.email}
            <Badge variant={user.role === 'admin' ? 'default' : 'secondary'} className="capitalize">
              {user.role}
            </Badge>
            <span>· joined {formatDate(user.createdAt)}</span>
          </span>
        }
      />
      <div className="grid gap-6 md:grid-cols-2">
        <ProfileForm />
        <ChangePasswordForm />
      </div>
    </>
  )
}

function ProfileForm() {
  const { user, setUser } = useAuth()
  const updateProfile = useUpdateProfile()

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<ProfileValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: { name: user?.name ?? '', interests: user?.interests.join(', ') ?? '' },
  })

  const onSubmit = async (values: ProfileValues) => {
    try {
      const updated = await updateProfile.mutateAsync({
        name: values.name,
        interests: parseInterests(values.interests),
      })
      setUser(updated)
      reset({ name: updated.name, interests: updated.interests.join(', ') })
      toast.success('Profile updated')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Details</CardTitle>
        <CardDescription>Your interests are used to group users.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="profile-name">Name</FieldLabel>
              <Input id="profile-name" aria-invalid={!!errors.name} {...register('name')} />
              <FieldError errors={[errors.name]} />
            </Field>
            <Field>
              <FieldLabel htmlFor="profile-interests">Interests</FieldLabel>
              <Input
                id="profile-interests"
                placeholder="chess, reading"
                {...register('interests')}
              />
              <FieldDescription>Separated by commas.</FieldDescription>
            </Field>
            <Button type="submit" disabled={isSubmitting || !isDirty} className="w-fit">
              {isSubmitting ? 'Saving…' : 'Save changes'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}

function ChangePasswordForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  })

  const onSubmit = async ({ currentPassword, newPassword }: ChangePasswordValues) => {
    try {
      setTokens(await authApi.changePassword({ currentPassword, newPassword }))
      reset()
      toast.success('Password changed. Other sessions were signed out.')
    } catch (error) {
      toast.error(getErrorMessage(error))
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Change password</CardTitle>
        <CardDescription>This signs you out on every other device.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <Field data-invalid={!!errors.currentPassword}>
              <FieldLabel htmlFor="current-password">Current password</FieldLabel>
              <Input
                id="current-password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.currentPassword}
                {...register('currentPassword')}
              />
              <FieldError errors={[errors.currentPassword]} />
            </Field>
            <Field data-invalid={!!errors.newPassword}>
              <FieldLabel htmlFor="new-password">New password</FieldLabel>
              <Input
                id="new-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.newPassword}
                {...register('newPassword')}
              />
              <FieldError errors={[errors.newPassword]} />
            </Field>
            <Field data-invalid={!!errors.confirmPassword}>
              <FieldLabel htmlFor="confirm-new-password">Confirm new password</FieldLabel>
              <Input
                id="confirm-new-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register('confirmPassword')}
              />
              <FieldError errors={[errors.confirmPassword]} />
            </Field>
            <Button type="submit" disabled={isSubmitting} className="w-fit">
              {isSubmitting ? 'Updating…' : 'Update password'}
            </Button>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  )
}
