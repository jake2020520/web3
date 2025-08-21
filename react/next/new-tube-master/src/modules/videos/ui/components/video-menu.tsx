import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  ListPlusIcon,
  MoreVerticalIcon,
  ShareIcon,
  Trash2Icon,
} from 'lucide-react';
import { toast } from 'sonner';
import { APP_URL } from '@/constants';
import PlaylistAddModal from '@/modules/playlists/ui/components/playlist-add-modal';

interface VideoMenuProps {
  videoId: string;
  variant?: 'ghost' | 'secondary';
  onRemove?: () => void;
}

const VideoMenu = ({
  videoId,
  variant = 'ghost',
  onRemove,
}: VideoMenuProps) => {
  const [playlistAddModalOpen, setPlaylistAddModalOpen] = useState(false);

  const onShare = () => {
    // todo change if deploying outside vercel
    const fullUrl = `${APP_URL}/videos/${videoId}`;
    navigator.clipboard.writeText(fullUrl);
    toast.success('Link copied to clipboard');
  };
  return (
    <>
      <PlaylistAddModal
        videoId={videoId}
        open={playlistAddModalOpen}
        onOpenChange={setPlaylistAddModalOpen}
      />
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild={true}>
          <Button variant={variant} size='icon' className='rounded-full'>
            <MoreVerticalIcon />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align='end' onClick={(e) => e.stopPropagation()}>
          <DropdownMenuItem onClick={onShare}>
            <ShareIcon className='size-4 mr-2' />
            Share
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setPlaylistAddModalOpen(true);
            }}
          >
            <ListPlusIcon className='size-4 mr-2' />
            Add to playlist
          </DropdownMenuItem>
          {onRemove && (
            <DropdownMenuItem onClick={onRemove}>
              <Trash2Icon className='size-4 mr-2' />
              Remove
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default VideoMenu;
