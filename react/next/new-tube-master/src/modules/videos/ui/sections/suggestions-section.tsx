'use client';
import React from 'react';
import { useTRPC } from '@/trpc/client';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import { DEFAULT_LIMIT } from '@/constants';
import VideoRowCard, {
  VideoRowCardSkeleton,
} from '@/modules/videos/ui/components/video-row-card';
import VideoGridCard, {
  VideoGridCardSkeleton,
} from '@/modules/videos/ui/components/video-grid-card';
import InfiniteScroll from '@/components/infinite-scroll';

const SuggestionsSection = ({
  videoId,
  isManual,
}: {
  videoId: string;
  isManual?: boolean;
}) => {
  const trpc = useTRPC();
  const {
    data: suggestions,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.suggestions.getSuggestions.infiniteQueryOptions(
      {
        videoId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );

  return (
    <>
      <div className='hidden md:block space-y-3'>
        {suggestions.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoRowCard key={video.id} data={video} size='compact' />
          ))}
      </div>
      <div className='block md:hidden space-y-10'>
        {suggestions.pages
          .flatMap((page) => page.items)
          .map((video) => (
            <VideoGridCard key={video.id} data={video} />
          ))}
      </div>
      <InfiniteScroll
        isManual={isManual}
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </>
  );
};

export default SuggestionsSection;

export const SuggestionsSectionSkeleton = () => {
  return (
    <>
      <div className='hidden md:block space-y-3'>
        {Array.from({ length: 8 }).map((_, index) => (
          <VideoRowCardSkeleton key={index} size='compact' />
        ))}
      </div>
      <div className='block md:hidden space-y-10'>
        {Array.from({ length: 8 }).map((_, index) => (
          <VideoGridCardSkeleton key={index} />
        ))}
      </div>
    </>
  );
};
