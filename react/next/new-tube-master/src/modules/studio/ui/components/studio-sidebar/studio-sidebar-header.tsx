import React from 'react';
import { useUser } from '@clerk/nextjs';
import {
  SidebarHeader,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import UserAvatar from '@/components/user-avatar';
import { Skeleton } from '@/components/ui/skeleton';

const StudioSidebarHeader = () => {
  const { user } = useUser();
  const { state } = useSidebar();

  if (!user) {
    return (
      <SidebarHeader className='flex items-center justify-center pb-4'>
        <Skeleton className='size-[112px] rounded-full' />
        <div className='flex flex-col items-center mt-2 gap-2'>
          <Skeleton className='h-4 w-[80px]' />
          <Skeleton className='h-4 w-[100px]' />
        </div>
      </SidebarHeader>
    );
  }

  if (state === 'collapsed') {
    return (
      <SidebarMenuItem>
        <SidebarMenuButton tooltip='Your profile' asChild>
          <Link prefetch href='/users/current'>
            <UserAvatar
              name={user?.fullName ?? 'User'}
              imageUrl={user?.imageUrl}
              size='xs'
            />
            <span className='text-sm'>Your profile</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  }

  return (
    <SidebarHeader className='flex items-center justify-center pb-4'>
      <Link prefetch href='/users/current'>
        <UserAvatar
          name={user?.fullName ?? 'User'}
          imageUrl={user?.imageUrl}
          className='size-[112px] hover:opacity-80 transition-opacity'
        />
      </Link>

      <div className='flex flex-col items-center mt-2 gap-1'>
        <p className='text-sm font-medium'>Your profile</p>
        <p className='text-xs text-muted-foreground'>{user.fullName}</p>
      </div>
    </SidebarHeader>
  );
};

export default StudioSidebarHeader;
