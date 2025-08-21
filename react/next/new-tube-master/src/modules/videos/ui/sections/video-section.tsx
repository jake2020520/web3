'use client';

import { cn } from '@/lib/utils';
import VideoBanner from '@/modules/videos/ui/components/video-banner';
import VideoPlayer, {
  VideoPlayerSkeleton,
} from '@/modules/videos/ui/components/video-player';
import VideoTopRow, {
  VideoTopRowSkeleton,
} from '@/modules/videos/ui/components/video-top-row';
import { useTRPC } from '@/trpc/client';
import { useAuth } from '@clerk/nextjs';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';

interface VideoSectionProps {
  videoId: string;
}

const VideoSection = ({ videoId }: VideoSectionProps) => {
  const { isSignedIn } = useAuth();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { data: video } = useSuspenseQuery(
    trpc.videos.getOne.queryOptions({ id: videoId }),
  );

  const createView = useMutation(
    trpc.videoViews.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries({
          queryKey: trpc.videos.getOne.queryKey({ id: videoId }),
        });
      },
    }),
  );

  const handlePlay = () => {
    if (!isSignedIn) return;
    createView.mutate({ videoId });
  };

  return (
    <>
      <div
        className={cn(
          'aspect-video bg-black rounded-xl overflow-hidden relative',
          video.muxStatus !== 'reday' && 'rounded-b-none',
        )}
      >
        <VideoPlayer
          autoPlay={false}
          onPlay={handlePlay}
          playbackId={video.muxPlaybackId}
          thumbnailUrl={video.thumbnailUrl}
        />
      </div>

      <VideoBanner status={video.muxStatus} />
      <VideoTopRow video={video} />
    </>
  );
};

export default VideoSection;

export const VideoSectionSkeleton = () => {
  return (
    <>
      <VideoPlayerSkeleton />
      <VideoTopRowSkeleton />
    </>
  );
};
