import { DEFAULT_LIMIT } from '@/constants';
import VideosView from '@/modules/playlists/ui/views/videos-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';
interface PageProps {
  params: Promise<{
    playlistId: string;
  }>;
}

export const dynamic = 'force-dynamic';

const Page = async ({ params }: PageProps) => {
  const { playlistId } = await params;
  const queryClient = getQueryClient();

  void queryClient.prefetchInfiniteQuery(
    trpc.playlists.getVideosFromPlaylist.infiniteQueryOptions({
      playlistId,
      limit: DEFAULT_LIMIT,
    }),
  );
  void queryClient.prefetchQuery(
    trpc.playlists.getOne.queryOptions({ id: playlistId }),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VideosView playlistId={playlistId} />
    </HydrationBoundary>
  );
};

export default Page;
