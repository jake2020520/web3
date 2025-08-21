import CategoriesSection from '@/modules/home/ui/sections/categories-section';
import { ErrorBoundary } from 'react-error-boundary';
import { Suspense } from 'react';
import { FilterCarouselLoading } from '@/components/filter-carousel';
import HomeVideosSection, {
  HomeVideosSectionSkeleton,
} from '../sections/home-videos-section';

const HomeView = ({ categoryId }: { categoryId?: string }) => {
  return (
    <div className='max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6'>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<FilterCarouselLoading />}>
          <CategoriesSection categoryId={categoryId} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense
          fallback={<HomeVideosSectionSkeleton />}
          key={`${categoryId}`}
        >
          <HomeVideosSection categoryId={categoryId} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default HomeView;
