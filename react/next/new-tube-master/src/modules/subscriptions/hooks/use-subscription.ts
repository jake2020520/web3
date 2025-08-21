import { useClerk } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useTRPC } from '@/trpc/client';
import { toast } from 'sonner';
import { DEFAULT_LIMIT } from '@/constants';

interface UseSubscriptionProps {
  userId: string;
  isSubscribed: boolean;
  fromVideoId?: string;
}

export const useSubscription = ({
  userId,
  isSubscribed,
  fromVideoId,
}: UseSubscriptionProps) => {
  const clerk = useClerk();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const subscribe = useMutation(
    trpc.subscriptions.create.mutationOptions({
      onSuccess: async () => {
        toast.success('Subscribed');
        await queryClient.invalidateQueries(
          trpc.videos.getSubscribed.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          }),
        );
        await queryClient.invalidateQueries(
          trpc.users.getOne.queryOptions({ id: userId }),
        );
        await queryClient.invalidateQueries(
          trpc.subscriptions.getMany.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          }),
        );

        if (fromVideoId) {
          await queryClient.invalidateQueries(
            trpc.videos.getOne.queryOptions({ id: fromVideoId }),
          );
        }
      },
      onError: (error) => {
        console.error(error);
        toast.error('Something went wrong. Please try again later.');
        if (error.data?.code === 'UNAUTHORIZED') {
          clerk.openSignIn();
        }
      },
    }),
  );

  const unsubscribe = useMutation(
    trpc.subscriptions.remove.mutationOptions({
      onSuccess: async () => {
        toast.success('Unsubscribed');
        await queryClient.invalidateQueries(
          trpc.videos.getSubscribed.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          }),
        );
        await queryClient.invalidateQueries(
          trpc.users.getOne.queryOptions({ id: userId }),
        );
        await queryClient.invalidateQueries(
          trpc.subscriptions.getMany.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          }),
        );

        if (fromVideoId) {
          await queryClient.invalidateQueries(
            trpc.videos.getOne.queryOptions({ id: fromVideoId }),
          );
        }
      },
      onError: (error) => {
        console.error(error);
        toast.error('Something went wrong. Please try again later.');
        if (error.data?.code === 'UNAUTHORIZED') {
          clerk.openSignIn();
        }
      },
    }),
  );

  const isPending = subscribe.isPending || unsubscribe.isPending;

  const onClick = () => {
    if (isSubscribed) {
      unsubscribe.mutate({ userId });
    } else {
      subscribe.mutate({ userId });
    }
  };

  return {
    isPending,
    onClick,
  };
};
