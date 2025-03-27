import { formatDuration } from '@/lib/utils'
import Image from 'next/image'

interface VideoThumbnailProps {
  title: string
  duration: number
  imageUrl?: string | null
  previewUrl?: string | null
}

export function VideoThumbnail({
  title,
  duration,
  imageUrl,
  previewUrl,
}: VideoThumbnailProps) {
  return (
    <div className="relative group">
      {/* Thumbnail wrapper */}
      <div className="relative w-full overflow-hidden rounded-xl aspect-video">
        <Image
          src={imageUrl ?? '/placeholder.svg'}
          className="size-full object-cover group-hover:opacity-0"
          alt={title}
          fill
        />
        <Image
          src={previewUrl ?? '/placeholder.svg'}
          className="size-full object-cover opacity-0 group-hover:opacity-100"
          alt={title}
          fill
        />
      </div>

      {/* Video duration box */}
      <div className="absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs">
        {formatDuration(duration)}
      </div>
    </div>
  )
}
