import { Suspense } from 'react';
import CategoriesSection from '../sections/categories-section';
import ResultsSection, {
  ResultsSectionSkeleton,
} from '@/modules/search/ui/sections/results-section';
import { ErrorBoundary } from 'react-error-boundary';
import { FilterCarouselLoading } from '@/components/filter-carousel';

interface SearchViewProps {
  query: string | undefined;
  categoryId: string | undefined;
}

const SearchView = ({ query, categoryId }: SearchViewProps) => {
  return (
    <div className='max-w-[1300px] mx-auto mb-10 flex flex-col gap-y-6 px-4 pt-2.5'>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<FilterCarouselLoading />}>
          <CategoriesSection categoryId={categoryId} />
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary
        fallback={
          <div className='text-red-500'>
            Something went wrong while loading results.
          </div>
        }
      >
        <Suspense
          fallback={<ResultsSectionSkeleton />}
          key={`${query}-${categoryId}`}
        >
          <ResultsSection query={query} categoryId={categoryId} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default SearchView;
