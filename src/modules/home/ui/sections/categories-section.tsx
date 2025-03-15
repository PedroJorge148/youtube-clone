'use client'

import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'

import { FilterCarousel } from '@/components/filter-carousel'
import { trpc } from '@/trpc/client'
import { useRouter } from 'next/navigation'

interface CategoriesSectionProps {
  categoryId?: string
}

export function CategoriesSection({ categoryId }: CategoriesSectionProps) {
  return (
    <Suspense
      fallback={<FilterCarousel isLoading data={[]} onSelect={() => {}} />}
    >
      <ErrorBoundary fallback={<p>error...</p>}>
        <CategoriesSectionSuspense categoryId={categoryId} />
      </ErrorBoundary>
    </Suspense>
  )
}

function CategoriesSectionSuspense({ categoryId }: CategoriesSectionProps) {
  const router = useRouter()
  const [categories] = trpc.categories.getMany.useSuspenseQuery()

  const data = categories.map(category => ({
    value: category.id,
    label: category.name,
  }))

  function onSelect(value: string | null) {
    const url = new URL(window.location.href)

    if (value) {
      url.searchParams.set('categoryId', value)
    } else {
      url.searchParams.delete('categoryId')
    }

    router.push(url.toString())
  }

  return <FilterCarousel onSelect={onSelect} value={categoryId} data={data} />
}
