import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-3">
      <p className="text-4xl font-semibold">404</p>
      <p className="text-muted-foreground">This page doesn't exist.</p>
      <Button render={<Link to="/notes" />}>Go home</Button>
    </div>
  )
}
