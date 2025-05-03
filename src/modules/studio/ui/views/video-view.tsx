interface VideoViewProps {
  videoId: string;
}

export function VideoView({videoId}: VideoViewProps) {
  return (
    <div className="px-4 pt-2.5 max-w-screen-lg">
      {videoId}
    </div>
  )
}