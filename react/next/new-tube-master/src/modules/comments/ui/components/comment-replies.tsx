import { useTRPC } from '@/trpc/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { DEFAULT_LIMIT } from '@/constants';
import CommentItem from '@/modules/comments/ui/components/comment-item';
import { CornerDownRightIcon, Loader2Icon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CommentRepliesProps {
  videoId: string;
  parentId: string;
}

const CommentReplies = ({ videoId, parentId }: CommentRepliesProps) => {
  const trpc = useTRPC();
  const {
    isLoading,
    data: replies,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useInfiniteQuery(
    trpc.comments.getMany.infiniteQueryOptions(
      {
        videoId,
        parentId,
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );

  return (
    <div className='pl-14 flex flex-col gap-4'>
      <div className='flex flex-col gap-4 mt-2'>
        {isLoading && (
          <div className='flex items-center justify-center'>
            <Loader2Icon className='size-6 animate-spin text-muted-foreground' />
          </div>
        )}
        {!isLoading &&
          replies?.pages
            .flatMap((page) => page.items)
            .map((reply) => (
              <CommentItem comment={reply} key={reply.id} variant='reply' />
            ))}
      </div>
      {hasNextPage && (
        <Button
          variant='tertiary'
          size='sm'
          className='justify-start w-fit rounded-full'
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
        >
          <CornerDownRightIcon />
          Show more replies
        </Button>
      )}
    </div>
  );
};

export default CommentReplies;
