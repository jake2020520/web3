import { DEFAULT_LIMIT } from '@/constants';
import TrendingView from '@/modules/home/ui/views/trending-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.videos.getTrending.infiniteQueryOptions(
      { limit: DEFAULT_LIMIT },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <TrendingView />
    </HydrationBoundary>
  );
}
