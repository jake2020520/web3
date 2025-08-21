import ResponsiveDialog from '@/components/responsive-dialog';
import { DEFAULT_LIMIT } from '@/constants';
import { UploadDropzone } from '@/lib/uploadthing';
import { useTRPC } from '@/trpc/client';
import { useQueryClient } from '@tanstack/react-query';
import React from 'react';

interface ThumbnailUploadModalProps {
  videoId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ThumbnailUploadModal = ({
  videoId,
  open,
  onOpenChange,
}: ThumbnailUploadModalProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const onUploadComplete = async () => {
    onOpenChange(false);
    await queryClient.invalidateQueries(
      trpc.studio.getMany.infiniteQueryOptions({
        limit: DEFAULT_LIMIT,
      }),
    );
    await queryClient.invalidateQueries(
      trpc.studio.getOne.queryOptions({ id: videoId }),
    );
  };

  return (
    <ResponsiveDialog
      title='Upload Thumbnail'
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint='thumbnailUploader'
        input={{ videoId }}
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveDialog>
  );
};

export default ThumbnailUploadModal;
