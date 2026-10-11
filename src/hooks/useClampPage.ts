import { useEffect } from 'react'
import type { PageMeta } from '@/types/api'

// Steps back to the last page when the current one ends up empty,
// e.g. after deleting the only item on the last page.
export function useClampPage(meta: PageMeta | undefined, setPage: (page: number) => void) {
  useEffect(() => {
    if (meta && meta.totalPages > 0 && meta.page > meta.totalPages) {
      setPage(meta.totalPages)
    }
  }, [meta, setPage])
}
