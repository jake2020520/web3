import UserSection, {
  UserSectionSkeleton,
} from '@/modules/users/ui/sections/user-section';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import VideosSection, {
  VideosSectionSkeleton,
} from '@/modules/users/ui/sections/videos-section';

interface UserViewProps {
  userId: string;
}

const UserView = ({ userId }: UserViewProps) => {
  return (
    <div className='flex flex-col max-w-[1300px] px-4 pt-2.5 mx-auto mb-10 gap-y-6'>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<UserSectionSkeleton />}>
          <UserSection userId={userId} />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<VideosSectionSkeleton />}>
          <VideosSection userId={userId} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default UserView;
