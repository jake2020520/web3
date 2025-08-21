import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import LikedVideosSection, {
  LikedVideosSectionSkeleton,
} from '@/modules/playlists/ui/sections/liked-videos-section';

const LikedView = () => {
  return (
    <div className='max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Liked videos</h1>
        <p className='text-xs text-muted-foreground'>Videos you liked</p>
      </div>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<LikedVideosSectionSkeleton />}>
          <LikedVideosSection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default LikedView;
