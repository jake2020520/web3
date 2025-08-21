'use client';
import { useTRPC } from '@/trpc/client';
import React from 'react';
import { useSuspenseQuery } from '@tanstack/react-query';
import UserPageBanner, {
  UserPageBannerSkeleton,
} from '@/modules/users/ui/components/user-page-banner';
import UserPageInfo, {
  UserPageInfoSkeleton,
} from '@/modules/users/ui/components/user-page-info';
import { Separator } from '@/components/ui/separator';

interface UserSectionProps {
  userId: string;
}

const UserSection = ({ userId }: UserSectionProps) => {
  const trpc = useTRPC();
  const { data: user } = useSuspenseQuery(
    trpc.users.getOne.queryOptions({ id: userId }),
  );
  return (
    <div className='flex flex-col'>
      <UserPageBanner user={user} />
      <UserPageInfo user={user} />
      <Separator />
    </div>
  );
};

export default UserSection;

export const UserSectionSkeleton = () => {
  return (
    <div className='flex flex-col'>
      <UserPageBannerSkeleton />
      <UserPageInfoSkeleton />
    </div>
  );
};
