'use client';

import { useTRPC } from '@/trpc/client';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { DEFAULT_LIMIT } from '@/constants';
import VideoGridCard, {
  VideoGridCardSkeleton,
} from '@/modules/videos/ui/components/video-grid-card';
import VideoRowCard, {
  VideoRowCardSkeleton,
} from '@/modules/videos/ui/components/video-row-card';
import InfiniteScroll from '@/components/infinite-scroll';

interface ResultsSectionProps {
  query: string | undefined;
  categoryId: string | undefined;
}

const ResultsSection = ({ query, categoryId }: ResultsSectionProps) => {
  const trpc = useTRPC();
  const {
    data: results,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
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
    <>
      <div className='flex flex-col gap-4 gap-y-10 md:hidden'>
        {results.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard data={video} key={video.id} />
          ))}
      </div>
      <div className='hidden flex-col gap-4 md:flex'>
        {results.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard data={video} key={video.id} />
          ))}
      </div>
      <InfiniteScroll
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
};

export default ResultsSection;

export const ResultsSectionSkeleton = () => {
  return (
    <div>
      <div className='hidden flex-col gap-4 md:flex'>
        {Array.from({ length: 5 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} />
        ))}
      </div>
      <div className='flex flex-col gap-4 p-4 gap-y-10 pt-6 md:hidden'>
        {Array.from({ length: 5 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </div>
  );
};
