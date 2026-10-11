import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link, useLocation, useNavigate } from 'react-router'
import { toast } from 'sonner'
import { AuthLayout } from '@/components/layout/AuthLayout'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/features/auth/auth-context'
import { DEMO_ADMIN } from '@/features/auth/demoAccount'
import { loginSchema, type LoginValues } from '@/features/auth/schemas'
import { getErrorMessage } from '@/lib/api'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: { pathname: string } } | null)?.from?.pathname ?? '/notes'

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })

  const onSubmit = async (values: LoginValues) => {
    try {
      await login(values)
      navigate(from, { replace: true })
    } catch (error) {
      toast.error(getErrorMessage(error, 'Login failed'))
    }
  }

  const fillDemoAdmin = () => {
    setValue('email', DEMO_ADMIN.email, { shouldValidate: true })
    setValue('password', DEMO_ADMIN.password, { shouldValidate: true })
  }

  return (
    <AuthLayout>
      <Card>
        <CardHeader>
          <CardTitle>Log in</CardTitle>
          <CardDescription>Enter your email and password to continue.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            <FieldGroup>
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
                  autoComplete="current-password"
                  aria-invalid={!!errors.password}
                  {...register('password')}
                />
                <FieldError errors={[errors.password]} />
              </Field>
              <Button type="submit" disabled={isSubmitting} className="w-full">
                {isSubmitting ? 'Logging in…' : 'Log in'}
              </Button>
              <p className="text-center text-sm text-muted-foreground">
                No account?{' '}
                <Link to="/register" className="text-foreground underline underline-offset-4">
                  Sign up
                </Link>
              </p>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <Card size="sm" className="mt-4 bg-muted/50">
        <CardHeader>
          <CardTitle className="text-sm">Demo admin account</CardTitle>
          <CardDescription>Use it to try the admin features.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 text-sm">
            <dt className="text-muted-foreground">Email</dt>
            <dd className="font-mono select-all">{DEMO_ADMIN.email}</dd>
            <dt className="text-muted-foreground">Password</dt>
            <dd className="font-mono select-all">{DEMO_ADMIN.password}</dd>
          </dl>
          <Button type="button" variant="outline" size="sm" className="w-full" onClick={fillDemoAdmin}>
            Use demo admin
          </Button>
        </CardContent>
      </Card>
    </AuthLayout>
  )
}
