import React from 'react';
import { getQueryClient, trpc } from '@/trpc/server';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import UserView from '@/modules/users/ui/views/user-view';
import { DEFAULT_LIMIT } from '@/constants';

interface PageProps {
  params: Promise<{
    userId: string;
  }>;
}

export const dynamic = 'force-dynamic';

const Page = async ({ params }: PageProps) => {
  const { userId } = await params;
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(
    trpc.users.getOne.queryOptions({
      id: userId,
    }),
  );
  void queryClient.prefetchInfiniteQuery(
    trpc.videos.getMany.infiniteQueryOptions({
      userId,
      limit: DEFAULT_LIMIT,
    }),
  );
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserView userId={userId} />
    </HydrationBoundary>
  );
};

export default Page;
