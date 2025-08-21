import CommentsSection, {
  CommentsSectionSkeleton,
} from '@/modules/videos/ui/sections/comments-section';
import SuggestionsSection, {
  SuggestionsSectionSkeleton,
} from '@/modules/videos/ui/sections/suggestions-section';
import VideoSection, {
  VideoSectionSkeleton,
} from '@/modules/videos/ui/sections/video-section';
import React, { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';

interface VideoViewProps {
  videoId: string;
}

const VideoView = ({ videoId }: VideoViewProps) => {
  return (
    <div className='flex flex-col max-w-[1700px] mx-auto pt-2.5 px-4 mb-10'>
      <div className='flex flex-col xl:flex-row gap-6'>
        <div className='flex-1 min-w-0'>
          <ErrorBoundary fallback={<p>Error...</p>}>
            <Suspense fallback={<VideoSectionSkeleton />}>
              <VideoSection videoId={videoId} />
            </Suspense>
          </ErrorBoundary>
          <div className='xl:hidden block mt-4'>
            <ErrorBoundary fallback={<p>Error...</p>}>
              <Suspense fallback={<SuggestionsSectionSkeleton />}>
                <SuggestionsSection videoId={videoId} isManual />
              </Suspense>
            </ErrorBoundary>
          </div>
          <ErrorBoundary fallback={<p>Error...</p>}>
            <Suspense fallback={<CommentsSectionSkeleton />}>
              <CommentsSection videoId={videoId} />
            </Suspense>
          </ErrorBoundary>
        </div>
        <div className='hidden xl:block w-full xl:w-[380px] 2xl:w-[460px] shrink-1'>
          <ErrorBoundary fallback={<p>Error...</p>}>
            <Suspense fallback={<SuggestionsSectionSkeleton />}>
              <SuggestionsSection videoId={videoId} />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
};

export default VideoView;
