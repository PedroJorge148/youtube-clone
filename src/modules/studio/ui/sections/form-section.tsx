'use client'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { videoUpdateSchema } from '@/db/schema'
import { VideoPlayer } from '@/modules/videos/ui/components/video-player'
import { trpc } from '@/trpc/client'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  CopyCheckIcon,
  CopyIcon,
  MoreVerticalIcon,
  TrashIcon,
} from 'lucide-react'
import Link from 'next/link'
import { Suspense, useState } from 'react'
import { ErrorBoundary } from 'react-error-boundary'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import type { z } from 'zod'

interface FormSectionProps {
  videoId: string
}

export function FormSection({ videoId }: FormSectionProps) {
  return (
    <Suspense fallback={<FormSectionSkeleton />}>
      <ErrorBoundary fallback={<p>Error</p>}>
        <FormSectionSuspense videoId={videoId} />
      </ErrorBoundary>
    </Suspense>
  )
}

function FormSectionSkeleton() {
  return <p>loading</p>
}

function FormSectionSuspense({ videoId }: FormSectionProps) {
  const utils = trpc.useUtils()
  const [video] = trpc.studio.getOne.useSuspenseQuery({ id: videoId })
  const [categories] = trpc.categories.getMany.useSuspenseQuery()

  const update = trpc.videos.update.useMutation({
    onSuccess: () => {
      utils.studio.getMany.invalidate()
      utils.studio.getOne.invalidate({ id: videoId })
      toast.success('Video updated!')
    },
    onError: () => {
      toast.error('Something went wrong')
    },
  })

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  })

  function onSubmit(data: z.infer<typeof videoUpdateSchema>) {
    update.mutate(data)
  }

  // TODO Change if deploying outside of Vercel
  const fullUrl = `${process.env.VERCEL_URL || 'http://localhost:3000'}/videos/${video.id}`
  const [isCopied, setIsCopied] = useState(false)

  async function onCopy() {
    await navigator.clipboard.writeText(fullUrl)
    setIsCopied(true)

    setTimeout(() => {
      setIsCopied(false)
    }, 2000)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">Video details</h1>
            <p className="text-xs text-muted-foreground">
              Manage your video details
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="submit" disabled={update.isPending}>
              Save
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <MoreVerticalIcon />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <TrashIcon className="size-4 mr-2" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="space-y-8 lg:col-span-3">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Title
                    {/* TODO: Add AI generate button */}
                  </FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Add a title to your video" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    Description
                    {/* TODO: Add AI generate button */}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      rows={10}
                      className="resize-none pr-10"
                      value={field.value ?? ''}
                      placeholder="Add a description to your video"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* TODO: Add thumbnail field here */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value ?? undefined}
                  >
                    <FormControl className="w-full">
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex flex-col gap-8 lg:col-span-2">
            <div className="flex flex-col gap-4 bg-[#F9F9F9] rounded-xl overflow-hidden h-fit">
              <div className="aspect-video overflow-hidden relative">
                <VideoPlayer
                  playbackId={video.muxPlaybackId}
                  thumbnailUrl={video.thumbnailUrl}
                />
              </div>
              <div className="p-4 flex flex-col gap-6">
                <div className="flex justify-between items-center gap-2">
                  <div className="flex flex-col gap-1">
                    <p className="text-muted-foreground text-xs">Video link</p>
                    <div className="flex items-center gap-2">
                      <Link href={`videos/${video.id}`}>
                        <p className="line-clamp-1">{fullUrl}</p>
                      </Link>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="shrink-0 transition"
                        onClick={onCopy}
                        disabled={isCopied}
                      >
                        {isCopied ? <CopyCheckIcon /> : <CopyIcon />}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </Form>
  )
}
