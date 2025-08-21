'use client';
interface PlaylistHeaderSectionProps {
  playlistId: string;
}

import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { DEFAULT_LIMIT } from '@/constants';
import { useTRPC } from '@/trpc/client';
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from '@tanstack/react-query';
import { Trash2Icon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const PlaylistHeaderSection = ({ playlistId }: PlaylistHeaderSectionProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: playlist } = useSuspenseQuery(
    trpc.playlists.getOne.queryOptions({ id: playlistId }),
  );

  const removePlaylist = useMutation(
    trpc.playlists.remove.mutationOptions({
      onSuccess: async () => {
        toast.success('Playlist removed successfully');
        await queryClient.invalidateQueries(
          trpc.playlists.getMany.infiniteQueryOptions({
            limit: DEFAULT_LIMIT,
          }),
        );
        router.push('/playlists');
      },
      onError: (error) => {
        console.error('Error removing playlist:', error);
        toast.error('Failed to remove playlist. Please try again later.');
      },
    }),
  );

  return (
    <div className='flex justify-between items-center'>
      <div>
        <h1 className='text-2xl font-bold'>{playlist.name}</h1>
        <p className='text-xs text-muted-foreground'>
          Videos from the playlist
        </p>
      </div>
      <Button
        variant='outline'
        size='icon'
        className='rounded-full'
        onClick={() => removePlaylist.mutate({ id: playlistId })}
        disabled={removePlaylist.isPending}
      >
        <Trash2Icon />
      </Button>
    </div>
  );
};

export default PlaylistHeaderSection;

export const PlaylistHeaderSectionSkeleton = () => {
  return (
    <div className='flex flex-col gap-y-2'>
      <Skeleton className='h-6 w-24' />
      <Skeleton className='h-6 w-32' />
    </div>
  );
};
