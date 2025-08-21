import { Button } from '@/components/ui/button';
import UserAvatar from '@/components/user-avatar';
import SubscriptionButton from '@/modules/subscriptions/ui/components/subscription-button';
import UserInfo from '@/modules/users/ui/components/user-info';
import { VideoGetOneOutput } from '@/modules/videos/types';
import { useAuth } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react';
import { useSubscription } from '@/modules/subscriptions/hooks/use-subscription';

interface VideoOwenerProps {
  user: VideoGetOneOutput['user'];
  videoId: string;
}

const VideoOwner = ({ user, videoId }: VideoOwenerProps) => {
  const { userId: clerkUserId, isLoaded } = useAuth();
  const { isPending, onClick } = useSubscription({
    userId: user.id,
    isSubscribed: user.viewerSubscribed,
    fromVideoId: videoId,
  });

  return (
    <div className='flex items-center sm:items-start justify-between sm:justify-start gap-3 min-w-0'>
      <Link prefetch href={`/users/${user.id}`}>
        <div className='flex items-center gap-3 min-w-0'>
          <UserAvatar imageUrl={user.imageUrl} name={user.name} size='lg' />
          <div className='flex flex-col gap-1 min-w-0'>
            <UserInfo size='lg' name={user.name} />
            <span className='text-sm text-muted-foreground line-clamp-1'>
              {user.subscriberCount} subscribers
            </span>
          </div>
        </div>
      </Link>

      {clerkUserId === user.clerkId ? (
        <Button asChild className='rounded-full' variant='secondary'>
          <Link prefetch href={`/studio/videos/${videoId}`}>
            Edit Video
          </Link>
        </Button>
      ) : (
        <SubscriptionButton
          onClick={onClick}
          disabled={isPending || !isLoaded}
          isSubscribed={user.viewerSubscribed}
          className='flex-none'
        />
      )}
    </div>
  );
};

export default VideoOwner;
