'use client';

import ResponsiveDialog from '@/components/responsive-dialog';
import { Button } from '@/components/ui/button';
import { DEFAULT_LIMIT } from '@/constants';
import StudioUploader from '@/modules/studio/ui/components/studio-uploader';
import { useTRPC } from '@/trpc/client';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2Icon, PlusIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const StudioUploadModal = () => {
  const router = useRouter();
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const queryKey = trpc.studio.getMany.infiniteQueryKey({
    limit: DEFAULT_LIMIT,
  });

  const create = useMutation(
    trpc.videos.create.mutationOptions({
      onSuccess: async () => {
        toast.success('Video created');
        await queryClient.invalidateQueries({ queryKey });
      },
      onError: (error) => {
        console.error('Something went wrong while creating video', error);
        toast.error(error.message);
      },
    }),
  );

  const onSuccess = () => {
    if (!create.data?.video.id) return;

    create.reset();
    router.push(`/studio/videos/${create.data.video.id}`);
  };

  return (
    <>
      <ResponsiveDialog
        title='Upload a Video'
        open={!!create.data?.url}
        onOpenChange={() => create.reset()}
      >
        {create.data?.url ? (
          <StudioUploader onSuccess={onSuccess} endpoint={create.data.url} />
        ) : (
          <Loader2Icon className='animate-spin' />
        )}
      </ResponsiveDialog>
      <Button
        variant='secondary'
        disabled={create.isPending}
        onClick={() => create.mutate()}
      >
        {create.isPending ? (
          <Loader2Icon className='animate-spin' />
        ) : (
          <PlusIcon />
        )}
        Create
      </Button>
    </>
  );
};

export default StudioUploadModal;
