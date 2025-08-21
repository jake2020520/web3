'use client';

import { DEFAULT_LIMIT } from '@/constants';
import CommentForm from '@/modules/comments/ui/components/comment-form';
import CommentItem from '@/modules/comments/ui/components/comment-item';
import { useTRPC } from '@/trpc/client';
import { useSuspenseInfiniteQuery } from '@tanstack/react-query';
import InfiniteScroll from '@/components/infinite-scroll';
import { Loader2Icon } from 'lucide-react';

const CommentsSection = ({ videoId }: { videoId: string }) => {
  const trpc = useTRPC();
  const {
    data: comments,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.comments.getMany.infiniteQueryOptions(
      { videoId, limit: DEFAULT_LIMIT },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );
  return (
    <div className='mt-6'>
      <div className='flex flex-col gap-6'>
        <h1 className='font-semibold text-xl'>
          {comments.pages[0].totalCount} Comments
        </h1>
        <CommentForm videoId={videoId} onSuccess={() => {}} />
      </div>
      <div className='flex flex-col gap-4 mt-2'>
        {comments.pages
          .flatMap((page) => page.items)
          .map((comment) => (
            <CommentItem key={comment.id} comment={comment} />
          ))}

        <InfiniteScroll
          hasNextPage={hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </div>
    </div>
  );
};

export default CommentsSection;

export const CommentsSectionSkeleton = () => {
  return (
    <div className='mt-6 flex justify-center items-center'>
      <Loader2Icon className='text-muted-foreground size-7 animate-spin' />
    </div>
  );
};
