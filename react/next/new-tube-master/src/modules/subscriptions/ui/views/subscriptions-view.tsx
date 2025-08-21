import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import SubscriptionsSection, {
  SubscriptionsSectionSkeleton,
} from '../sections/subscriptions-section';

const SubscriptionsView = () => {
  return (
    <div className='max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6'>
      <div>
        <h1 className='text-2xl font-bold'>All Subscriptions</h1>
        <p className='text-xs text-muted-foreground'>
          View and manage your subscriptions.
        </p>
      </div>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<SubscriptionsSectionSkeleton />}>
          <SubscriptionsSection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default SubscriptionsView;
