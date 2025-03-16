import { DEFAULT_LIMIT } from "@/constants"
import { StudioView } from '@/modules/studio/ui/view/studio-view'
import { HydrateClient, trpc } from '@/trpc/server'

export default async function StudioPage() {
  void trpc.studio.getMany.prefetchInfinite({
    limit: DEFAULT_LIMIT,

  })

  return (
    <HydrateClient>
      <StudioView />
    </HydrateClient>
  )
}
