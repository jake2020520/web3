import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import UserAvatar from '@/components/user-avatar';
import { DEFAULT_LIMIT } from '@/constants';
import { commentInsertSchema } from '@/db/schema';
import { useTRPC } from '@/trpc/client';
import { useClerk, useUser } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

interface CommentFormProps {
  videoId: string;
  parentId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  variant?: 'reply' | 'comment';
}

const commentFormSchema = commentInsertSchema.omit({ userId: true });

const CommentForm = ({
  videoId,
  parentId,
  onSuccess,
  onCancel,
  variant = 'comment',
}: CommentFormProps) => {
  const { user } = useUser();
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const clerk = useClerk();

  const createCommentMutation = useMutation(
    trpc.comments.create.mutationOptions({
      onSuccess: async (newComment) => {
        await queryClient.invalidateQueries(
          trpc.comments.getMany.infiniteQueryOptions({
            videoId,
            limit: DEFAULT_LIMIT,
          }),
        );
        console.log('New comment created:', newComment);
        form.reset();
        toast.success('Comment created successfully');
        onSuccess?.();
      },
      onError: (error) => {
        if (error.data?.code === 'UNAUTHORIZED') {
          clerk.openSignIn();
        } else {
          console.error('Error creating comment:', error);
          toast.error('Failed to create comment. Please try again later.');
        }
      },
    }),
  );

  const form = useForm<z.infer<typeof commentFormSchema>>({
    resolver: zodResolver(commentFormSchema),
    defaultValues: {
      parentId,
      videoId,
      value: '',
    },
  });

  const onSubmit = (values: z.infer<typeof commentFormSchema>) => {
    console.log('onSubmit', values);
    createCommentMutation.mutate(values);
  };

  const handleCancel = () => {
    form.reset();
    onCancel?.();
  };

  return (
    <Form {...form}>
      <form className='flex gap-4 group' onSubmit={form.handleSubmit(onSubmit)}>
        <UserAvatar
          size={variant === 'reply' ? 'sm' : 'default'}
          imageUrl={user?.imageUrl || '/user-placeholder.svg'}
          name={user?.fullName || 'User'}
        />

        <div className='flex-1'>
          <FormField
            name='value'
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Textarea
                    {...field}
                    placeholder={
                      variant === 'reply'
                        ? 'Reply to this comment...'
                        : 'Write a comment...'
                    }
                    className='resize-none bg-transparent overflow-hidden min-h-0'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className='justify-end gap-2 mt-2 flex'>
            {onCancel && (
              <Button
                variant='ghost'
                type='button'
                size='sm'
                onClick={handleCancel}
              >
                Cancel
              </Button>
            )}
            <Button
              type='submit'
              size='sm'
              disabled={createCommentMutation.isPending}
            >
              {variant === 'reply' ? 'Reply' : 'Comment'}
            </Button>
          </div>
        </div>
      </form>
    </Form>
  );
};

export default CommentForm;
