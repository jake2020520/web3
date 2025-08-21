import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import UserAvatar from '@/components/user-avatar';
import { DEFAULT_LIMIT } from '@/constants';
import { cn } from '@/lib/utils';
import { CommentsGetManyOutput } from '@/modules/comments/types';
import { useTRPC } from '@/trpc/client';
import { useAuth, useClerk } from '@clerk/nextjs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDistanceToNow } from 'date-fns';
import {
  ChevronDownIcon,
  ChevronUpIcon,
  MessageSquareIcon,
  MoreVerticalIcon,
  ThumbsDownIcon,
  ThumbsUpIcon,
  Trash2Icon,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import CommentForm from './comment-form';
import CommentReplies from '@/modules/comments/ui/components/comment-replies';

interface CommentItemProps {
  comment: CommentsGetManyOutput['items'][number];
  variant?: 'reply' | 'comment';
}

const CommentItem = ({ comment, variant = 'comment' }: CommentItemProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { userId } = useAuth();
  const clerk = useClerk();
  const [isReplyOpen, setIsReplyOpen] = useState(false);
  const [isRepliesOpen, setIsRepliesOpen] = useState(false);

  const removeComment = useMutation(
    trpc.comments.remove.mutationOptions({
      onSuccess: async () => {
        toast.success('Comment removed successfully');
        await queryClient.invalidateQueries(
          trpc.comments.getMany.infiniteQueryOptions({
            videoId: comment.videoId,
            limit: DEFAULT_LIMIT,
          }),
        );
      },
      onError: (error) => {
        console.error(error);
        if (error.data?.code === 'UNAUTHORIZED') {
          clerk.openSignIn();
        } else {
          toast.error('Failed to remove comment. Please try again later.');
        }
      },
    }),
  );

  const likeMutation = useMutation(
    trpc.commentReactions.like.mutationOptions({
      onSuccess: async () => {
        toast.success('Liked the comment');
        await queryClient.invalidateQueries(
          trpc.comments.getMany.infiniteQueryOptions({
            videoId: comment.videoId,
            limit: DEFAULT_LIMIT,
          }),
        );
      },
      onError: (error) => {
        console.error(error);
        if (error.data?.code === 'UNAUTHORIZED') {
          clerk.openSignIn();
        } else {
          toast.error('Failed to like the comment. Please try again later.');
        }
      },
    }),
  );

  const dislikeMutation = useMutation(
    trpc.commentReactions.dislike.mutationOptions({
      onSuccess: async () => {
        toast.success('Disliked the comment');
        await queryClient.invalidateQueries(
          trpc.comments.getMany.infiniteQueryOptions({
            videoId: comment.videoId,
            limit: DEFAULT_LIMIT,
          }),
        );
      },
      onError: (error) => {
        console.error(error);
        if (error.data?.code === 'UNAUTHORIZED') {
          clerk.openSignIn();
        } else {
          toast.error('Failed to dislike the comment. Please try again later.');
        }
      },
    }),
  );

  return (
    <div className=''>
      <div className='flex gap-4'>
        <Link prefetch href={`/users/${comment.userId}`}>
          <UserAvatar
            size={variant === 'reply' ? 'sm' : 'lg'}
            imageUrl={comment.user.imageUrl}
            name={comment.user.name}
          />
        </Link>
        <div className='flex-1 min-w-0'>
          <Link prefetch href={`/users/${comment.userId}`}>
            <div className='flex items-center gap-2 mb-0.5'>
              <span className='font-medium text-sm pb-0.5'>
                {comment.user.name}
              </span>
              <span className='text-xs text-muted-foreground'>
                {formatDistanceToNow(comment.createdAt, { addSuffix: true })}
              </span>
            </div>
          </Link>

          <p className='text-sm'>{comment.value}</p>

          <div className='flex items-center gap-2 mt-1'>
            <div className='flex items-center'>
              <Button
                size='icon'
                variant='ghost'
                disabled={likeMutation.isPending || dislikeMutation.isPending}
                className='size-8'
                onClick={() => {
                  likeMutation.mutate({ commentId: comment.id });
                }}
              >
                <ThumbsUpIcon
                  className={cn(
                    comment.viewerReaction === 'like' && 'fill-black',
                  )}
                />
              </Button>
              <span className='text-xs text-muted-foreground'>
                {comment.likeCount}
              </span>
              <Button
                size='icon'
                variant='ghost'
                disabled={dislikeMutation.isPending || likeMutation.isPending}
                className='size-8'
                onClick={() => {
                  dislikeMutation.mutate({ commentId: comment.id });
                }}
              >
                <ThumbsDownIcon
                  className={cn(
                    comment.viewerReaction === 'dislike' && 'fill-black',
                  )}
                />
              </Button>
              <span className='text-xs text-muted-foreground'>
                {comment.dislikeCount}
              </span>
            </div>
            {variant === 'comment' && (
              <Button
                variant='ghost'
                size='sm'
                className='h-8'
                onClick={() => {
                  setIsReplyOpen(true);
                }}
              >
                Reply
              </Button>
            )}
          </div>
        </div>
        {(comment.user.clerkId === userId || variant === 'comment') && (
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild={true}>
              <Button variant='ghost' size='icon' className='size-8'>
                <MoreVerticalIcon />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuItem
                onClick={() => {
                  setIsReplyOpen(true);
                }}
              >
                <MessageSquareIcon />
                Reply
              </DropdownMenuItem>
              {userId === comment.user.clerkId && (
                <DropdownMenuItem
                  onClick={() => {
                    removeComment.mutate({ id: comment.id });
                  }}
                >
                  <Trash2Icon />
                  Delete
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {isReplyOpen && variant === 'comment' && (
        <div className='mt-4 pl-14'>
          <CommentForm
            variant='reply'
            parentId={comment.id}
            videoId={comment.videoId}
            onSuccess={() => {
              setIsReplyOpen(false);
              setIsRepliesOpen(true);
            }}
            onCancel={() => setIsReplyOpen(false)}
          />
        </div>
      )}
      {comment.replyCount > 0 && variant === 'comment' && (
        <div className='pl-14'>
          <Button
            variant='tertiary'
            size='sm'
            onClick={() => setIsRepliesOpen((current) => !current)}
          >
            {isRepliesOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
            {comment.replyCount} replies
          </Button>
        </div>
      )}

      {comment.replyCount > 0 && variant === 'comment' && isRepliesOpen && (
        <CommentReplies parentId={comment.id} videoId={comment.videoId} />
      )}
    </div>
  );
};

export default CommentItem;
