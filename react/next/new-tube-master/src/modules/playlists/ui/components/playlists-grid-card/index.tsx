import { PlaylistsGetManyOutput } from '@/modules/playlists/types';
import Link from 'next/link';
import { THUMBNAIL_PLACEHOLDER } from '@/modules/videos/constants';
import PlaylistThumbnail, {
  PlaylistThumbnailSkeleton,
} from '@/modules/playlists/ui/components/playlists-grid-card/playlist-thumbnail';
import PlaylistInfo, {
  PlaylistInfoSkeleton,
} from '@/modules/playlists/ui/components/playlists-grid-card/playlist-info';

interface PlaylistsGridCardProps {
  data: PlaylistsGetManyOutput['items'][number];
}

const PlaylistGridCard = ({ data }: PlaylistsGridCardProps) => {
  return (
    <Link prefetch href={`/playlists/${data.id}`}>
      <div className='flex flex-col gap-2 w-full group'>
        <PlaylistThumbnail
          imageUrl={data.thumbnailUrl || THUMBNAIL_PLACEHOLDER}
          title={data.name}
          videoCount={data.videoCount}
        />
        <PlaylistInfo data={data} />
      </div>
    </Link>
  );
};

export default PlaylistGridCard;

export const PlaylistGridCardSkeleton = () => {
  return (
    <div className='flex flex-col gap-2 w-full '>
      <PlaylistThumbnailSkeleton />
      <PlaylistInfoSkeleton />
    </div>
  );
};
