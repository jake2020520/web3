import Image from 'next/image';
import { formatDuration } from '@/lib/utils';
import { THUMBNAIL_PLACEHOLDER } from '@/modules/videos/constants';
import { Skeleton } from '@/components/ui/skeleton';

interface VideoThumbnailProps {
  imageUrl?: string | null;
  title: string;
  previewUrl?: string | null;
  duration: number;
}

const VideoThumbnail = ({
  title,
  previewUrl,
  imageUrl,
  duration,
}: VideoThumbnailProps) => {
  return (
    <div className='relative group'>
      {/*Thumbnail wrapper*/}
      <div className='relative w-full overflow-hidden rounded-xl aspect-video'>
        <Image
          src={imageUrl || THUMBNAIL_PLACEHOLDER}
          alt={title}
          fill
          className='size-full object-cover group-hover:opacity-0'
        />
        <Image
          src={previewUrl || THUMBNAIL_PLACEHOLDER}
          alt={title}
          unoptimized={!!previewUrl}
          fill
          className='size-full object-cover opacity-0 group-hover:opacity-100'
        />
      </div>

      {/*video duration box*/}
      <div className='absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium'>
        {formatDuration(duration)}
      </div>
    </div>
  );
};

export default VideoThumbnail;

export const VideoThumbnailSkeleton = () => (
  <div className='relative w-full overflow-hidden rounded-xl aspect-video'>
    <Skeleton className='size-full' />
  </div>
);
