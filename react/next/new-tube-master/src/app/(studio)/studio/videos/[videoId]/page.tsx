import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import VideoView from '@/modules/studio/ui/views/video-view';

interface Props {
  params: Promise<{
    videoId: string;
  }>;
}

export const dynamic = 'force-dynamic';

const Page = async ({ params }: Props) => {
  const { videoId } = await params;
  console.log('videoId', videoId);
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.studio.getOne.queryOptions({ id: videoId }),
  );
  void queryClient.prefetchQuery(trpc.categories.getMany.queryOptions());
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <VideoView videoId={videoId} />
    </HydrationBoundary>
  );
};

export default Page;
