import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import TrendingVideosSection, {
  TrendingVideosSectionSkeleton,
} from '../sections/trending-videos-section';

const TrendingView = () => {
  return (
    <div className='max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>Trending</h1>
        <p className='text-xs text-muted-foreground'>
          Most popular videos at the moment
        </p>
      </div>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<TrendingVideosSectionSkeleton />}>
          <TrendingVideosSection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default TrendingView;
