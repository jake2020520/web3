import VideosSection, {
  VideosSectionSkeleton,
} from '@/modules/studio/ui/sections/videos-section';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';

const StudioView = () => {
  return (
    <div className='flex flex-col gap-6 pt-2.5'>
      <div className='px-4'>
        <h1 className='text-2xl font-bold'>Channel Content</h1>
        <p className='text-xs text-muted-foreground'>
          Manage your channel content and videos
        </p>
      </div>

      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<VideosSectionSkeleton />}>
          <VideosSection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default StudioView;
