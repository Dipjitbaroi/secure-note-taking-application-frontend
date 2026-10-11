import { SearchIcon, XIcon } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import { Link } from 'react-router'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { ListSkeleton } from '@/components/common/ListSkeleton'
import { PageHeader } from '@/components/common/PageHeader'
import { PaginationBar } from '@/components/common/PaginationBar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useInterestGroups } from '@/features/users/hooks'
import { useClampPage } from '@/hooks/useClampPage'

const PAGE_SIZE = 12

// Backed by the single-aggregate endpoint: GET /users/interests
export default function InterestsPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [interest, setInterest] = useState<string>()

  const { data, isPending, isError, error, refetch } = useInterestGroups({
    page,
    limit: PAGE_SIZE,
    interest,
  })
  useClampPage(data?.meta, setPage)

  const applyFilter = (event: FormEvent) => {
    event.preventDefault()
    setPage(1)
    setInterest(search.trim().toLowerCase() || undefined)
  }

  const clearFilter = () => {
    setSearch('')
    setInterest(undefined)
    setPage(1)
  }

  return (
    <>
      <PageHeader title="Users by interest" description="Users grouped by the interests in their profile." />

      <form onSubmit={applyFilter} className="mb-6 flex max-w-md gap-2">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by interest, e.g. chess"
          aria-label="Interest"
        />
        <Button type="submit" variant="secondary">
          <SearchIcon />
          Filter
        </Button>
        {interest && (
          <Button type="button" variant="ghost" onClick={clearFilter}>
            <XIcon />
            Clear
          </Button>
        )}
      </form>

      {isPending ? (
        <ListSkeleton />
      ) : isError ? (
        <ErrorState error={error} onRetry={refetch} />
      ) : data.items.length === 0 ? (
        <EmptyState
          title={interest ? `Nobody is interested in "${interest}"` : 'No interests yet'}
          description="Users can add interests from their profile page."
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((group) => (
            <Card key={group.interest}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between gap-2">
                  <span className="capitalize">{group.interest}</span>
                  <Badge variant="secondary">
                    {group.count} {group.count === 1 ? 'user' : 'users'}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {group.users.map((user) => (
                    <li key={user._id} className="flex flex-col">
                      <Link to={`/users/${user._id}/posts`} className="font-medium hover:underline">
                        {user.name}
                      </Link>
                      <span className="text-xs text-muted-foreground">{user.email}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <PaginationBar meta={data?.meta} onPageChange={setPage} />
    </>
  )
}
