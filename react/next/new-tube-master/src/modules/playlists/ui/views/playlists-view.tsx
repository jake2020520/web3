'use client';

import { Suspense, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusIcon } from 'lucide-react';
import PlaylistCreateModal from '@/modules/playlists/ui/components/playlist-create-modal';
import PlaylistsSection, {
  PlaylistsVideosSectionSkeleton,
} from '@/modules/playlists/ui/sections/playlists-section';
import { ErrorBoundary } from 'react-error-boundary';

const PlaylistsView = () => {
  const [playlistCreateModalOpen, setPlaylistCreateModalOpen] = useState(false);
  return (
    <div className='max-w-[2400px] mx-auto mb-10 px-4 pt-2.5 flex flex-col gap-y-6'>
      <PlaylistCreateModal
        open={playlistCreateModalOpen}
        onOpenChange={setPlaylistCreateModalOpen}
      />
      <div className='flex justify-between items-center'>
        <div>
          <h1 className='text-2xl font-bold'>Playlists</h1>
          <p className='text-xs text-muted-foreground'>
            Collections you have created
          </p>
        </div>
        <Button
          variant='outline'
          size='icon'
          className='rounded-full'
          onClick={() => {
            setPlaylistCreateModalOpen(true);
          }}
        >
          <PlusIcon />
        </Button>
      </div>
      <ErrorBoundary fallback={<p>Error...</p>}>
        <Suspense fallback={<PlaylistsVideosSectionSkeleton />}>
          <PlaylistsSection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
};

export default PlaylistsView;
