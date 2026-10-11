import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import type { PageMeta } from '@/types/api'

export function PaginationBar({
  meta,
  onPageChange,
}: {
  meta?: PageMeta
  onPageChange: (page: number) => void
}) {
  if (!meta || meta.total === 0) return null

  const { page, totalPages, total } = meta

  return (
    <div className="mt-6 flex items-center justify-between gap-4 text-sm text-muted-foreground">
      <span>{total} total</span>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeftIcon />
          Prev
        </Button>
        <span>
          Page {page} of {Math.max(totalPages, 1)}
        </span>
        <Button
          variant="outline"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
        >
          Next
          <ChevronRightIcon />
        </Button>
      </div>
    </div>
  )
}
