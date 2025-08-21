import React from 'react';
import MuxPlayer from '@mux/mux-player-react';
import { THUMBNAIL_PLACEHOLDER } from '@/modules/videos/constants';

interface VideoPlayerProps {
  playbackId?: string | null | undefined;
  thumbnailUrl?: string | null | undefined;
  autoPlay?: boolean;
  onPlay?: () => void;
}

const VideoPlayer = ({
  playbackId,
  thumbnailUrl,
  autoPlay,
  onPlay,
}: VideoPlayerProps) => {
  return (
    <MuxPlayer
      playbackId={playbackId || ''}
      poster={thumbnailUrl || THUMBNAIL_PLACEHOLDER}
      playerInitTime={0}
      autoPlay={autoPlay}
      thumbnailTime={0}
      className='size-full object-contain'
      accentColor='#ff2056'
      onPlay={onPlay}
    />
  );
};

export default VideoPlayer;

export const VideoPlayerSkeleton = () => {
  return <div className='aspect-video bg-black rounded-xl' />;
};
