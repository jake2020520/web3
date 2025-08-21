import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import SearchView from '@/modules/search/ui/views/search-view';
import { DEFAULT_LIMIT } from '@/constants';

interface PageProps {
  searchParams: Promise<{
    query: string | undefined;
    categoryId: string | undefined;
  }>;
}

export const dynamic = 'force-dynamic';

const Page = async ({ searchParams }: PageProps) => {
  const { query, categoryId } = await searchParams;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
  void queryClient.prefetchInfiniteQuery(
    trpc.search.getMany.infiniteQueryOptions(
      {
        query,
        categoryId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <SearchView query={query} categoryId={categoryId} />
    </HydrationBoundary>
  );
};

export default Page;
