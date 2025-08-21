'use client';

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import UserAvatar from '@/components/user-avatar';
import { DEFAULT_LIMIT } from '@/constants';
import { useTRPC } from '@/trpc/client';
import { useInfiniteQuery } from '@tanstack/react-query';
import { ListIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const SubscriptionsSection = () => {
  const pathname = usePathname();
  const trpc = useTRPC();

  const { data: subscriptions, isLoading } = useInfiniteQuery(
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
    <SidebarGroup>
      <SidebarGroupLabel>Subscriptions</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {isLoading && <LoadingSkeleton />}
          {!isLoading &&
            subscriptions?.pages
              .flatMap((page) => page.items)
              .map((subscription) => (
                <SidebarMenuItem
                  key={`${subscription.creatorId}-${subscription.viewerId}`}
                >
                  <SidebarMenuButton
                    tooltip={subscription.user.name}
                    asChild
                    isActive={pathname === `/users/${subscription.user.id}`}
                  >
                    <Link
                      href={`/users/${subscription.user.id}`}
                      className='flex items-center gap-4'
                    >
                      <UserAvatar
                        size='xs'
                        imageUrl={subscription.user.imageUrl}
                        name={subscription.user.name}
                      />
                      <span className='text-sm'>{subscription.user.name}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
          {!isLoading && (
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                isActive={pathname === '/subscriptions'}
              >
                <Link
                  prefetch
                  href='/subscriptions'
                  className='flex items-center gap-4'
                >
                  <ListIcon className='size-4' />
                  <span className='text-sm'>All Subscriptions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};

export default SubscriptionsSection;

export const LoadingSkeleton = () => (
  <>
    {[1, 2, 3, 4].map((i) => (
      <SidebarMenuItem key={i}>
        <SidebarMenuButton disabled>
          <Skeleton className='size-6 rounded-full shrink-0' />
          <Skeleton className='h-4 w-full' />
        </SidebarMenuButton>
      </SidebarMenuItem>
    ))}
  </>
);
