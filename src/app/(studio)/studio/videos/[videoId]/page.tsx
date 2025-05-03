import { VideoView } from '@/modules/studio/ui/views/video-view'
import { HydrateClient, trpc } from '@/trpc/server'

export const dynamic = 'force-dynamic'

interface VideoPageProps {
  params: Promise<{ videoId: string }>
}

export async function VideoPage({ params }: VideoPageProps) {
  const { videoId } = await params

  void trpc.studio.getOne({ id: videoId })

  return (
    <HydrateClient>
      <VideoView videoId={videoId} />
    </HydrateClient>
  )
}
