import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/layout/AuthLayout'
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
import { useAuth } from '@/features/auth/auth-context'
import { registerSchema, type RegisterValues } from '@/features/auth/schemas'
import { getErrorMessage } from '@/lib/api'
import { parseInterests } from '@/lib/format'

export default function RegisterPage() {
  const { register: signUp } = useAuth()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: '', email: '', password: '', confirmPassword: '', interests: '' },
  })

  const onSubmit = async ({ name, email, password, interests }: RegisterValues) => {
    try {
      await signUp({ name, email, password, interests: parseInterests(interests) })
      navigate('/notes', { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error, 'Sign up failed'))
    }
  }

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle>Create an account</CardTitle>
          <CardDescription>Sign up to start writing notes.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="name">Name</FieldLabel>
                <Input id="name" autoComplete="name" aria-invalid={!!errors.name} {...register('name')} />
                <FieldError errors={[errors.name]} />
              </Field>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!errors.email}
                  {...register('email')}
                />
                <FieldError errors={[errors.email]} />
              </Field>
              <Field data-invalid={!!errors.password}>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                <FieldError errors={[errors.password]} />
              </Field>
              <Field data-invalid={!!errors.confirmPassword}>
                <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  {...register('confirmPassword')}
                />
                <FieldError errors={[errors.confirmPassword]} />
              </Field>
              <Field>
                <FieldLabel htmlFor="interests">Interests</FieldLabel>
                <Input id="interests" placeholder="chess, reading" {...register('interests')} />
                <FieldDescription>Optional, separated by commas.</FieldDescription>
              </Field>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Creating account…' : 'Sign up'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                Already have an account?{' '}
                <Link to="/login" className="text-foreground underline underline-offset-4">
                  Log in
                </Link>
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
