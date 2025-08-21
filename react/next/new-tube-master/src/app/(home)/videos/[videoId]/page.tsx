import { DEFAULT_LIMIT } from '@/constants';
import VideoView from '@/modules/videos/ui/views/video-view';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';

export const dynamic = 'force-dynamic';

interface Props {
  params: Promise<{ videoId: string }>;
}
const Page = async ({ params }: Props) => {
  const { videoId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.videos.getOne.queryOptions({ id: videoId }),
  );

  void queryClient.prefetchInfiniteQuery(
    trpc.comments.getMany.infiniteQueryOptions({
      videoId,
      limit: DEFAULT_LIMIT,
    }),
  );

  void queryClient.prefetchInfiniteQuery(
    trpc.suggestions.getSuggestions.infiniteQueryOptions({
      videoId,
      limit: DEFAULT_LIMIT,
    }),
  );

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VideoView videoId={videoId} />
    </HydrationBoundary>
  );
};

export default Page;
