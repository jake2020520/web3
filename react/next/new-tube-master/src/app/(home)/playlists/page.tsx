import PlaylistsView from '@/modules/playlists/ui/views/playlists-view';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { getQueryClient, trpc } from '@/trpc/server';
import { DEFAULT_LIMIT } from '@/constants';

export const dynamic = 'force-dynamic';

const Page = async () => {
  const queryClient = getQueryClient();

  void queryClient.prefetchInfiniteQuery(
    trpc.playlists.getMany.infiniteQueryOptions({
      limit: DEFAULT_LIMIT,
    }),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <PlaylistsView />
    </HydrationBoundary>
  );
};

export default Page;
