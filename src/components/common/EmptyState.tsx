import type { ReactNode } from 'react'

export function EmptyState({ title, description }: { title: string; description?: ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed bg-background p-10 text-center">
      <p className="font-medium">{title}</p>
      {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
    </div>
  )
}
