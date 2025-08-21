'use client';
import InfiniteScroll from '@/components/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import VideoGridCard, {
  VideoGridCardSkeleton,
} from '@/modules/videos/ui/components/video-grid-card';
import VideoRowCard, {
  VideoRowCardSkeleton,
} from '@/modules/videos/ui/components/video-row-card';
import { useTRPC } from '@/trpc/client';
import { useClerk } from '@clerk/nextjs';
import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import { toast } from 'sonner';

const VideosSection = ({ playlistId }: { playlistId: string }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const clerk = useClerk();
  const {
    data: videos,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.playlists.getVideosFromPlaylist.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        playlistId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );

  const removeVideoFromPlaylist = useMutation(
    trpc.playlists.removeVideo.mutationOptions({
      onSuccess: async (data) => {
        toast.success('Video removed from playlist');
        await queryClient.invalidateQueries(
          trpc.playlists.getMany.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          }),
        );
        await queryClient.invalidateQueries(
          trpc.playlists.getManyForVideos.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
            videoId: data.videoId,
          }),
        );
        await queryClient.invalidateQueries(
          trpc.playlists.getOne.queryOptions({ id: data.playlistId }),
        );
        await queryClient.invalidateQueries(
          trpc.playlists.getVideosFromPlaylist.infiniteQueryOptions({
            playlistId: data.playlistId,
            limit: DEFAULT_LIMIT,
          }),
        );
      },
      onError: (error) => {
        if (error.data?.code === 'UNAUTHORIZED') {
          toast.error(
            'You need to be signed in to remove videos from playlists.',
          );
          clerk.openSignIn();
        } else {
          console.error('Error removing video from playlist:', error);
          toast.error(
            'Failed to remove video from playlist. Please try again later.',
          );
        }
      },
    }),
  );

  return (
    <div>
      <div className='flex flex-col gap-4 gap-y-10 md:hidden'>
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard
              key={video.id}
              data={video}
              onRemove={() =>
                removeVideoFromPlaylist.mutate({
                  videoId: video.id,
                  playlistId,
                })
              }
            />
          ))}
      </div>
      <div className='hidden flex-col gap-4 md:flex'>
        {videos.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard
              key={video.id}
              data={video}
              size='compact'
              onRemove={() =>
                removeVideoFromPlaylist.mutate({
                  videoId: video.id,
                  playlistId,
                })
              }
            />
          ))}
      </div>

      <InfiniteScroll
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};

export default VideosSection;

export const VideosSectionSkeleton = () => {
  return (
    <div>
      <div className='flex flex-col gap-4 gap-y-10 md:hidden'>
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
      <div className='hidden flex-col gap-4 md:flex'>
        {Array.from({ length: 18 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
