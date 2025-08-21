'use client';

import ResponsiveDialog from '@/components/responsive-dialog';
import { useTRPC } from '@/trpc/client';
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';
import { toast } from 'sonner';
import { DEFAULT_LIMIT } from '@/constants';
import { Loader2Icon, SquareCheckIcon, SquareIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import InfiniteScroll from '@/components/infinite-scroll';
import { useClerk } from '@clerk/nextjs';

interface PlaylistAddModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  videoId: string;
}

const PlaylistAddModal = ({
  open,
  onOpenChange,
  videoId,
}: PlaylistAddModalProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const clerk = useClerk();

  const {
    data: playlists,
    isLoading,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    trpc.playlists.getManyForVideos.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
        videoId,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        enabled: !!videoId && open,
      },
    ),
  );

  const addVideoToPlaylist = useMutation(
    trpc.playlists.addVideo.mutationOptions({
      onSuccess: async (data) => {
        toast.success('Video added to playlist');
        await queryClient.invalidateQueries(
          trpc.playlists.getMany.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          }),
        );
        await queryClient.invalidateQueries(
          trpc.playlists.getManyForVideos.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
            videoId,
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
          toast.error('You need to be signed in to add videos to playlists.');
          clerk.openSignIn();
        } else {
          console.error('Error adding video to playlist:', error);
          toast.error(
            'Failed to add video to playlist. Please try again later.',
          );
        }
      },
    }),
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
            videoId,
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
    <ResponsiveDialog
      title='Add to playlist'
      open={open}
      onOpenChange={onOpenChange}
    >
      <div className='flex flex-col gap-2'>
        {isLoading && (
          <div className='flex justify-center p-4'>
            <Loader2Icon className='size-5 text-muted-foreground animate-spin' />
          </div>
        )}
        {!isLoading &&
          playlists?.pages
            .flatMap((page) => page.items)
            .map((playlist) => (
              <Button
                key={playlist.id}
                variant='ghost'
                className='w-full justify-start px-2 [&_svg]:size-5'
                size='lg'
                onClick={() => {
                  if (playlist.containsVideo) {
                    removeVideoFromPlaylist.mutate({
                      playlistId: playlist.id,
                      videoId,
                    });
                  } else {
                    addVideoToPlaylist.mutate({
                      playlistId: playlist.id,
                      videoId,
                    });
                  }
                }}
                disabled={
                  addVideoToPlaylist.isPending ||
                  removeVideoFromPlaylist.isPending
                }
              >
                {playlist.containsVideo ? (
                  <SquareCheckIcon className='mr-2' />
                ) : (
                  <SquareIcon className='mr-2' />
                )}
                {playlist.name}
              </Button>
            ))}

        {!isLoading && (
          <InfiniteScroll
            isManual
            hasNextPage={hasNextPage}
            isFetchingNextPage={isFetchingNextPage}
            fetchNextPage={fetchNextPage}
          />
        )}
      </div>
    </ResponsiveDialog>
  );
};

export default PlaylistAddModal;
