import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';
import { VideoGetOneOutput } from '@/modules/videos/types';
import { useTRPC } from '@/trpc/client';
import { useClerk } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ThumbsDownIcon, ThumbsUpIcon } from 'lucide-react';
import React from 'react';
import { toast } from 'sonner';
import { DEFAULT_LIMIT } from '@/constants';

interface VideoReactionsProps {
  videoId: string;
  likes: number;
  dislikes: number;
  viewerReaction: VideoGetOneOutput['viewerReaction'];
}

const VideoReactions = ({
  videoId,
  likes,
  dislikes,
  viewerReaction,
}: VideoReactionsProps) => {
  const clerk = useClerk();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const like = useMutation(
    trpc.videoReactions.like.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.videos.getOne.queryOptions({ id: videoId }),
        );
        await queryClient.invalidateQueries(
          trpc.playlists.getLiked.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          }),
        );
      },
      onError: (error) => {
        if (error.data?.code === 'UNAUTHORIZED') {
          clerk.openSignIn();
          toast.error('You need to be signed in to like videos.');
        } else {
          console.error('Error liking video:', error);
          toast.error('Failed to like video. Please try again later.');
        }
      },
    }),
  );

  const dislike = useMutation(
    trpc.videoReactions.dislike.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(
          trpc.videos.getOne.queryOptions({ id: videoId }),
        );
        await queryClient.invalidateQueries(
          trpc.playlists.getLiked.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          }),
        );
      },
      onError: (error) => {
        if (error.data?.code === 'UNAUTHORIZED') {
          clerk.openSignIn();
          toast.error('You need to be signed in to like videos.');
        } else {
          console.error('Error disliking video:', error);
          toast.error('Failed to disliking video. Please try again later.');
        }
      },
    }),
  );

  return (
    <div className='flex items-center flex-none'>
      <Button
        variant='secondary'
        className='rounded-l-full rounded-r-none gap-2 pr-4'
        onClick={() => like.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
      >
        <ThumbsUpIcon
          className={cn('size-4', viewerReaction === 'like' && 'fill-black')}
        />
        {likes}
      </Button>
      <Separator orientation='vertical' className='h-7' />
      <Button
        variant='secondary'
        className='rounded-l-none rounded-r-full'
        onClick={() => dislike.mutate({ videoId })}
        disabled={like.isPending || dislike.isPending}
      >
        <ThumbsDownIcon
          className={cn('size-4', viewerReaction === 'dislike' && 'fill-black')}
        />
        {dislikes}
      </Button>
    </div>
  );
};

export default VideoReactions;
