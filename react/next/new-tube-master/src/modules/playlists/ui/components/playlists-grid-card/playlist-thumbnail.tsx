import { cn } from '@/lib/utils';
import Image from 'next/image';
import { THUMBNAIL_PLACEHOLDER } from '@/modules/videos/constants';
import { ListVideoIcon, PlayIcon } from 'lucide-react';
import { useMemo } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

interface PlaylistThumbnailProps {
  imageUrl?: string | null;
  title: string;
  videoCount: number;
  className?: string;
}

const PlaylistThumbnail = ({
  imageUrl,
  title,
  videoCount,
  className,
}: PlaylistThumbnailProps) => {
  const compactViews = useMemo(() => {
    return Intl.NumberFormat('en', {
      notation: 'compact',
    }).format(videoCount);
  }, [videoCount]);

  return (
    <div className={cn(className, 'relative pt-3')}>
      {/*stack effect layers*/}
      <div className='relative'>
        {/*background layers*/}
        <div className='absolute -top-3 left-1/2 -translate-x-1/2 w-[97%] rounded-xl bg-black/20 aspect-video' />
        <div className='absolute -top-1.5 left-1/2 -translate-x-1/2 w-[98.5%] rounded-xl bg-black/25 aspect-video' />
        {/*main image*/}
        <div className='relative w-full rounded-xl aspect-video overflow-hidden'>
          <Image
            src={imageUrl || THUMBNAIL_PLACEHOLDER}
            alt={title}
            className='size-full object-cover'
            fill
          />

          {/*hover overlay*/}
          <div className='absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center'>
            <div className='flex items-center gap-x-2'>
              <PlayIcon className='size-4 text-white fill-white' />
              <span className='text-white font-medium'>Play all</span>
            </div>
          </div>
        </div>
      </div>

      {/*video count indicator*/}
      <div className='absolute bottom-2 right-2 px-1 py-0.5 rounded bg-black/80 text-white text-xs font-medium  flex items-center gap-x-1'>
        <ListVideoIcon className='size-4' />
        {compactViews} videos
      </div>
    </div>
  );
};

export default PlaylistThumbnail;

export const PlaylistThumbnailSkeleton = () => (
  <div className='relative w-full overflow-hidden rounded-xl aspect-video'>
    <Skeleton className='size-full' />
  </div>
);
