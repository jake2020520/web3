import React from 'react';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import StudioView from '@/modules/studio/ui/views/studio-view';
import { DEFAULT_LIMIT } from '@/constants';

export const dynamic = 'force-dynamic';

const Page = async () => {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.studio.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <StudioView />
    </HydrationBoundary>
  );
};

export default Page;
