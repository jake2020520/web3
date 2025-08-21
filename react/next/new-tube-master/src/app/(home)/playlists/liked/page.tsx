import { DEFAULT_LIMIT } from '@/constants';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import React from 'react';
import LikedView from '@/modules/playlists/ui/views/liked-view';

export const dynamic = 'force-dynamic';

const Page = () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.playlists.getLiked.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    }),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <LikedView />
    </HydrationBoundary>
  );
};

export default Page;
