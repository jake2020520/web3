import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import SubscribedVideosSection, {
  SubscribedVideosSectionSkeleton,
} from '../sections/subscribed-videos-section';

const SubscribedView = () => {
  return (
    <div className='max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Subscribed</h1>
        <p className='text-xs text-muted-foreground'>
          Videos from channels you are subscribed to
        </p>
      </div>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<SubscribedVideosSectionSkeleton />}>
          <SubscribedVideosSection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default SubscribedView;
