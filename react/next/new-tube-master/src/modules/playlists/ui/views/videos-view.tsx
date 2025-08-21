import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import VideosSection, {
  VideosSectionSkeleton,
} from '../sections/videos-section';
import PlaylistHeaderSection, {
  PlaylistHeaderSectionSkeleton,
} from '../sections/playlist-header-section';

const VideosView = ({ playlistId }: { playlistId: string }) => {
  return (
    <div className='max-w-screen-md mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6'>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<PlaylistHeaderSectionSkeleton />}>
          <PlaylistHeaderSection playlistId={playlistId} />
        </Suspense>
      </ErrorBoundary>

      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<VideosSectionSkeleton />}>
          <VideosSection playlistId={playlistId} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default VideosView;
