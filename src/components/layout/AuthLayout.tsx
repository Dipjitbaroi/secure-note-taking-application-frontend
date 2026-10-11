import type { ReactNode } from 'react'
import { NotebookPenIcon } from 'lucide-react'

export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-muted/40 p-4">
      <div className="flex items-center gap-2 text-lg font-semibold">
        <NotebookPenIcon className="size-5" />
        Secure Notes
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  )
}
