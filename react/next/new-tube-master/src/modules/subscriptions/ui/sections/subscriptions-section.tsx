'use client';
import InfiniteScroll from '@/components/infinite-scroll';
import { DEFAULT_LIMIT } from '@/constants';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseInfiniteQuery,
} from '@tanstack/react-query';
import Link from 'next/link';
import { toast } from 'sonner';
import SubscriptionItem, {
  SubscriptionItemSkeleton,
} from '../components/subscription-item';

const SubscriptionsSection = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const unsubscribe = useMutation(
    trpc.subscriptions.remove.mutationOptions({
      onSuccess: async (data) => {
        toast.success('Unsubscribed');
        await queryClient.invalidateQueries(
          trpc.videos.getSubscribed.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          }),
        );
        await queryClient.invalidateQueries(
          trpc.users.getOne.queryOptions({ id: data.creatorId }),
        );
        await queryClient.invalidateQueries(
          trpc.subscriptions.getMany.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          }),
        );
      },
      onError: (error) => {
        console.error(error);
        toast.error('Something went wrong. Please try again later.');
      },
    }),
  );

  const {
    data: subscriptions,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSuspenseInfiniteQuery(
    trpc.subscriptions.getMany.infiniteQueryOptions(
      {
        limit: DEFAULT_LIMIT,
      },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    ),
  );
  return (
    <div>
      <div className='flex flex-col gap-4 '>
        {subscriptions.pages
          .flatMap((page) => page.items)
          .map((subscription) => (
            <Link
              key={subscription.creatorId}
              href={`/users/${subscription.user.id}`}
            >
              <SubscriptionItem
                name={subscription.user.name}
                imageUrl={subscription.user.imageUrl}
                subscriberCount={subscription.user.subscriberCount}
                onUnsubscribed={() =>
                  unsubscribe.mutate({
                    userId: subscription.creatorId,
                  })
                }
                disabled={unsubscribe.isPending}
              />
            </Link>
          ))}
      </div>

      <InfiniteScroll
        hasNextPage={hasNextPage}
        isFetchingNextPage={isFetchingNextPage}
        fetchNextPage={fetchNextPage}
      />
    </div>
  );
};

export default SubscriptionsSection;

export const SubscriptionsSectionSkeleton = () => {
  return (
    <div className='flex flex-col gap-4 '>
      {Array.from({ length: 8 }).map((_, index) => (
        <SubscriptionItemSkeleton key={index} />
      ))}
    </div>
  );
};
