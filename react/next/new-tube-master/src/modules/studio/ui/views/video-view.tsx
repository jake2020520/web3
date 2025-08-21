import FormSection, {
  FormSectionSkeleton,
} from '@/modules/studio/ui/sections/form-section';
import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

const VideoView = ({ videoId }: { videoId: string }) => {
  return (
    <div className='px-4 pt-2.5 max-w-screen-lg'>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<FormSectionSkeleton />}>
          <FormSection videoId={videoId} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default VideoView;
