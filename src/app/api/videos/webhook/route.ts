import { db } from '@/db'
import { videos } from '@/db/schema'
import { mux } from '@/lib/mux'

import type {
  VideoAssetCreatedWebhookEvent,
  VideoAssetErroredWebhookEvent,
  VideoAssetReadyWebhookEvent,
  VideoAssetTrackReadyWebhookEvent,
} from '@mux/mux-node/resources/webhooks'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'

const SIGNIN_SECRET = process.env.MUX_WEBHOOK_SECRET

type WebhookEvent =
  | VideoAssetCreatedWebhookEvent
  | VideoAssetErroredWebhookEvent
  | VideoAssetReadyWebhookEvent
  | VideoAssetTrackReadyWebhookEvent

export const POST = async (request: Request) => {
  if (!SIGNIN_SECRET) {
    throw new Error('Secret is not set')
  }

  const headersPayload = await headers()

  const muxSignature = headersPayload.get('mux-signature')

  if (!muxSignature) {
    return new Response('No signature found', { status: 401 })
  }

  const payload = await request.json()
  const body = JSON.stringify(payload)

  mux.webhooks.verifySignature(
    body,
    {
      'mux-signature': muxSignature,
    },
    SIGNIN_SECRET
  )

  switch (payload.type as WebhookEvent['type']) {
    case 'video.asset.created': {
      const data = payload.data as VideoAssetCreatedWebhookEvent['data']

      if (!data.upload_id) {
        return new Response('No upload ID found', { status: 400 })
      }

      await db
        .update(videos)
        .set({
          muxAssetId: data.id,
          muxStatus: data.status,
        })
        .where(eq(videos.muxUploadId, data.upload_id))

      break
    }
    case 'video.asset.ready': {
      const data = payload.data as VideoAssetReadyWebhookEvent['data']

      if (!data.upload_id) {
        return new Response('Missing upload ID', { status: 400 })
      }

      const playbackId = data.playback_ids?.[0].id

      if (!playbackId) {
        return new Response('Missing playback ID', { status: 400 })
      }

      const thumbnailUrl = `https://image.mux.com/${playbackId}/thumbnail.jpg`
      const previewUrl = `https://image.mux.com/${playbackId}/animated.gif`

      const duration = data.duration ? Math.round(data.duration * 1000) : 0

      await db
        .update(videos)
        .set({
          muxStatus: data.status,
          muxPlaybackId: playbackId,
          muxAssetId: data.id,
          thumbnailUrl,
          previewUrl,
          duration,
        })
        .where(eq(videos.muxUploadId, data.upload_id))
      break
    }
  }

  return new Response('Webhook received', { status: 200 })
}
