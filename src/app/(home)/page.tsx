import { HydrateClient, trpc } from '@/trpc/server'
import { Suspense } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { PageClient } from './client'

export default async function Home() {
  void trpc.hello.prefetch({ text: 'World!' })

  return (
    <HydrateClient>
      <Suspense fallback={<p>loading..</p>}>
        <ErrorBoundary fallback={<p>error...</p>}>
          <PageClient />
        </ErrorBoundary>
      </Suspense>
    </HydrateClient>
  )
}
