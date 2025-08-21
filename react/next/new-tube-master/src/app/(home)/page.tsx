import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import HomeView from '@/modules/home/ui/views/home-view';
import { DEFAULT_LIMIT } from '@/constants';

interface PageProps {
  searchParams: Promise<{
    categoryId?: string;
  }>;
}

export const dynamic = 'force-dynamic';

export default async function Page({ searchParams }: PageProps) {
  const { categoryId } = await searchParams;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
  void queryClient.prefetchInfiniteQuery(
    trpc.videos.getMany.infiniteQueryOptions(
      { categoryId, limit: DEFAULT_LIMIT },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeView categoryId={categoryId} />
    </HydrationBoundary>
  );
}
