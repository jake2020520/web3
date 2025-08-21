import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import HistoryVideosSection, {
  HistoryVideosSectionSkeleton,
} from '../sections/history-videos-section';

const HistoryView = () => {
  return (
    <div className='max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>History</h1>
        <p className='text-xs text-muted-foreground'>
          Videos you have watched recently
        </p>
      </div>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<HistoryVideosSectionSkeleton />}>
          <HistoryVideosSection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default HistoryView;
