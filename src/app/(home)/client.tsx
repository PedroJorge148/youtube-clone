'use client'

import { trpc } from '@/trpc/client'

export function PageClient() {
  const [data] = trpc.hello.useSuspenseQuery({
    text: 'World!',
  })

  return <div>Page Client says: {data.greeting}</div>
}
