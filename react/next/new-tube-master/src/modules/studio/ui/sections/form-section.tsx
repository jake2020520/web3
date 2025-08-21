'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { z } from 'zod';

import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { APP_URL, DEFAULT_LIMIT } from '@/constants';
import { videoUpdateSchema } from '@/db/schema';
import { snakeCaseToTitle } from '@/lib/utils';
import ThumbnailGenerateModal from '@/modules/studio/ui/components/thumbnail-generate-modal';
import ThumbnailUploadModal from '@/modules/studio/ui/components/thumbnail-upload-modal';
import { THUMBNAIL_PLACEHOLDER } from '@/modules/videos/constants';
import VideoPlayer from '@/modules/videos/ui/components/video-player';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  CopyCheckIcon,
  CopyIcon,
  Globe2Icon,
  ImagePlusIcon,
  Loader2Icon,
  LockIcon,
  MoreVerticalIcon,
  RotateCcwIcon,
  SparklesIcon,
  TrashIcon,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

interface FormSectionProps {
  videoId: string;
}

const FormSection = ({ videoId }: FormSectionProps) => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [thumbnaiModalOpen, setThumbnailModalOpen] = useState(false);
  const [thumbnaiGenerateModalOpen, setThumbnailGenerateModalOpen] =
    useState(false);

  const { data: video } = useSuspenseQuery(
    trpc.studio.getOne.queryOptions({ id: videoId }),
  );
  const { data: categories } = useSuspenseQuery(
    trpc.categories.getMany.queryOptions(),
  );
  const update = useMutation(
    trpc.videos.update.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.studio.getMany.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          }),
        );
        await queryClient.invalidateQueries(
          trpc.studio.getOne.queryOptions({ id: videoId }),
        );
        toast.success('Video updated');
      },
      onError: (error) => {
        console.error('update error', error);
        toast.error('Error while updating video');
      },
    }),
  );

  const remove = useMutation(
    trpc.videos.remove.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.studio.getMany.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          }),
        );
        toast.success('Video deleted');
        router.push('/studio');
      },
      onError: (error) => {
        console.error('delete error', error);
        toast.error('Error while deleting video');
      },
    }),
  );

  const revalidate = useMutation(
    trpc.videos.revalidate.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.studio.getMany.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          }),
        );
        await queryClient.invalidateQueries(
          trpc.studio.getOne.queryOptions({
            id: videoId,
          }),
        );
        toast.success('Video revalidated');
      },
      onError: (error) => {
        console.error('revalidate error', error);
        toast.error('Error while revalidating video');
      },
    }),
  );

  const restoreThumbnail = useMutation(
    trpc.videos.restoreThumbnail.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.studio.getMany.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          }),
        );
        await queryClient.invalidateQueries(
          trpc.studio.getOne.queryOptions({
            id: videoId,
          }),
        );
        toast.success('Thumbnail restored');
      },
      onError: (error) => {
        console.error('restoreThumbnail error', error);
        toast.error('Error while restoring thumbnail');
      },
    }),
  );

  const generateTitle = useMutation(
    trpc.videos.generateTitle.mutationOptions({
      onSuccess: () => {
        toast.success('Background title generation started', {
          description: 'It may take a few minutes to complete.',
        });
      },
      onError: (error) => {
        console.error('generateTitle error', error);
        toast.error('Error while generating title');
      },
    }),
  );

  const generateDescription = useMutation(
    trpc.videos.generateDescription.mutationOptions({
      onSuccess: () => {
        toast.success('Background description generation started', {
          description: 'It may take a few minutes to complete.',
        });
      },
      onError: (error) => {
        console.error('generateDescription error', error);
        toast.error('Error while generating description');
      },
    }),
  );

  const form = useForm<z.infer<typeof videoUpdateSchema>>({
    resolver: zodResolver(videoUpdateSchema),
    defaultValues: video,
  });

  const onSubmit = (data: z.infer<typeof videoUpdateSchema>) => {
    update.mutate(data);
  };

  const fullUrl = `${APP_URL}/videos/${video.id}`;
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(fullUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };
  return (
    <>
      <ThumbnailGenerateModal
        videoId={videoId}
        open={thumbnaiGenerateModalOpen}
        onOpenChange={setThumbnailGenerateModalOpen}
      />
      <ThumbnailUploadModal
        videoId={videoId}
        open={thumbnaiModalOpen}
        onOpenChange={setThumbnailModalOpen}
      />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='flex items-center justify-between mb-6'>
            <div className=''>
              <h1 className='text-2xl font-bold'>Video Details</h1>
              <p className='text-xs text-muted-foreground'>
                Manage your video details here
              </p>
            </div>
            <div className='flex items-center gap-x-2'>
              <Button
                type='submit'
                disabled={update.isPending || !form.formState.isDirty}
              >
                Save
              </Button>

              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button variant='ghost' size='icon'>
                    <MoreVerticalIcon />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align='end'>
                  <DropdownMenuItem
                    onClick={() => revalidate.mutate({ id: video.id })}
                  >
                    <RotateCcwIcon className='size-4 mr-2' />
                    Revalidate
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => remove.mutate({ id: video.id })}
                  >
                    <TrashIcon className='size-4 mr-2' />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
            <div className='space-y-8 lg:col-span-3'>
              <FormField
                name='title'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className='flex items-center gap-2'>
                        Title
                        <Button
                          size={'icon'}
                          type='button'
                          variant='outline'
                          className='rounded-full size-6 [&_svg]:size-3'
                          onClick={() => generateTitle.mutate({ id: video.id })}
                          disabled={
                            generateTitle.isPending || !video.muxTrackId
                          }
                        >
                          {generateTitle.isPending ? (
                            <Loader2Icon className='animate-spin' />
                          ) : (
                            <SparklesIcon />
                          )}
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder='Add a title to your video'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name='description'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      <div className='flex items-center gap-2'>
                        Description
                        <Button
                          size={'icon'}
                          type='button'
                          variant='outline'
                          className='rounded-full size-6 [&_svg]:size-3'
                          onClick={() =>
                            generateDescription.mutate({ id: video.id })
                          }
                          disabled={
                            generateDescription.isPending || !video.muxTrackId
                          }
                        >
                          {generateDescription.isPending ? (
                            <Loader2Icon className='animate-spin' />
                          ) : (
                            <SparklesIcon />
                          )}
                        </Button>
                      </div>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        {...field}
                        value={field.value ?? ''}
                        rows={10}
                        className='resize-none pr-10'
                        placeholder='Add a description to your video'
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                name='thumbnailUrl'
                control={form.control}
                render={() => (
                  <FormItem>
                    <FormLabel>Thumbnail</FormLabel>
                    <FormControl>
                      <div className='p-0.5 border border-dashed border-neutral-400 relative h-[84px] w-[153px] group'>
                        <Image
                          fill
                          alt='thumbnail'
                          src={video.thumbnailUrl || THUMBNAIL_PLACEHOLDER}
                          className='object-cover'
                        />
                        <DropdownMenu modal={false}>
                          <DropdownMenuTrigger asChild>
                            <Button
                              type='button'
                              size='icon'
                              className='bg-black/50 hover:bg-black/50 absolute top-1 right-1 rounded-full opacity-100 md:opacity-0 hover:opacity-100 group-hover:opacity-100 duration-300'
                            >
                              <MoreVerticalIcon className='text-white' />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align='start' side='right'>
                            <DropdownMenuItem
                              onClick={() => setThumbnailModalOpen(true)}
                            >
                              <ImagePlusIcon className='size-4 mr-1' />
                              Change
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                setThumbnailGenerateModalOpen(true)
                              }
                            >
                              <SparklesIcon className='size-4 mr-1' />
                              AI-generated
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                restoreThumbnail.mutate({ id: video.id })
                              }
                            >
                              <RotateCcwIcon className='size-4 mr-1' />
                              Restore
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                name='categoryId'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select a category' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
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

            <div className='flex flex-col gap-8 lg:col-span-2'>
              <div className='flex flex-col gap-4 bg-[#f9f9f9] rounded-xl overflow-hidden h-fit'>
                <div className='aspect-video relative'>
                  <VideoPlayer
                    playbackId={video.muxPlaybackId}
                    thumbnailUrl={video.thumbnailUrl}
                  />
                </div>
                <div className='p-4 flex flex-col gap-6'>
                  <div className='flex justify-between items-center gap-2'>
                    <div className='flex flex-col gap-1'>
                      <p className='text-xs text-muted-foreground'>
                        Video Link
                      </p>
                      <div className='flex items-center gap-2'>
                        <Link prefetch href={`/videos/${video.id}`}>
                          <p className='line-clamp-1 text-sm text-blue-500'>
                            {fullUrl}
                          </p>
                        </Link>
                        <Button
                          type='button'
                          variant='ghost'
                          size='icon'
                          className='shrink-0'
                          onClick={onCopy}
                          disabled={copied}
                        >
                          {copied ? <CopyCheckIcon /> : <CopyIcon />}
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-1'>
                      <p className='text-muted-foreground text-xs'>
                        Video Status
                      </p>
                      <p className='text-sm'>
                        {snakeCaseToTitle(video.muxStatus || 'preparing')}
                      </p>
                    </div>
                  </div>

                  <div className='flex justify-between items-center'>
                    <div className='flex flex-col gap-1'>
                      <p className='text-muted-foreground text-xs'>
                        Subtitles Status
                      </p>
                      <p className='text-sm'>
                        {snakeCaseToTitle(
                          video.muxTrackStatus || 'no_subtitles',
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <FormField
                name='visibility'
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Visibility</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select visibility' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='public'>
                          <div className='flex items-center'>
                            <Globe2Icon className='size-4 mr-2' />
                            Public
                          </div>
                        </SelectItem>
                        <SelectItem value='private'>
                          <div className='flex items-center'>
                            <LockIcon className='size-4 mr-2' />
                            Private
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </form>
      </Form>
    </>
  );
};

export default FormSection;

export const FormSectionSkeleton = () => {
  return (
    <div>
      <div className='flex items-center justify-between mb-6'>
        <div className='spacey-y-2'>
          <Skeleton className='h-7 w-32' />
          <Skeleton className='h-4 w-40' />
        </div>

        <Skeleton className='h-9 w-24' />
      </div>

      <div className='grid grid-cols-1 lg:grid-cols-5 gap-6'>
        <div className='space-y-8 lg:col-span-3'>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-16' />
            <Skeleton className='h-10 w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-24' />
            <Skeleton className='h-[220px] w-full' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-20' />
            <Skeleton className='h-[84px] w-[153px]' />
          </div>
          <div className='space-y-2'>
            <Skeleton className='h-5 w-20' />
            <Skeleton className='h-10 w-full' />
          </div>
        </div>

        <div className='flex flex-col gap-y-8 lg:col-span-2'>
          <div className='flex flex-col gap-4 bg-[#f9f9f9] rounded-xl overflow-hidden'>
            <Skeleton className='aspect-video' />
            <div className='space-y-2'>
              <Skeleton className='h-4 w-20' />
              <Skeleton className='h-5 w-full' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-5 w-32' />
            </div>
            <div className='space-y-2'>
              <Skeleton className='h-4 w-24' />
              <Skeleton className='h-5 w-32' />
            </div>
          </div>
        </div>
        <div className='space-y-2'>
          <Skeleton className='h-5 w-20' />
          <Skeleton className='h-10 w-full' />
        </div>
      </div>
    </div>
  );
};
