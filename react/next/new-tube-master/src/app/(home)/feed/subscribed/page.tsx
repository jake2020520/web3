import { DEFAULT_LIMIT } from '@/constants';
import SubscribedView from '@/modules/home/ui/views/subscribed-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

export default async function Page() {
  const queryClient = getQueryClient();
  void queryClient.prefetchInfiniteQuery(
    trpc.videos.getSubscribed.infiniteQueryOptions(
      { limit: DEFAULT_LIMIT },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SubscribedView />
    </HydrationBoundary>
  );
}
