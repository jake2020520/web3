import { VideoGetManyOutput } from '@/modules/videos/types';
import VideoInfo, {
  VideoInfoSkeleton,
} from '@/modules/videos/ui/components/video-info';
import VideoThumbnail, {
  VideoThumbnailSkeleton,
} from '@/modules/videos/ui/components/video-thumbnail';
import Link from 'next/link';

interface VideoGridCardProps {
  data: VideoGetManyOutput['items'][number];
  onRemove?: () => void;
}

const VideoGridCard = ({ data, onRemove }: VideoGridCardProps) => {
  return (
    <div className='flex flex-col gap-2 w-full group'>
      <Link prefetch href={`/videos/${data.id}`}>
        <VideoThumbnail
          title={data.title}
          duration={data.duration}
          imageUrl={data.thumbnailUrl}
          previewUrl={data.previewUrl}
        />
      </Link>

      <VideoInfo data={data} onRemove={onRemove} />
    </div>
  );
};

export default VideoGridCard;

export const VideoGridCardSkeleton = () => {
  return (
    <div className='flex flex-col gap-2 w-full'>
      <VideoThumbnailSkeleton />
      <VideoInfoSkeleton />
    </div>
  );
};
