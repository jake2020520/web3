import ResponsiveDialog from '@/components/responsive-dialog';
import { UploadDropzone } from '@/lib/uploadthing';
import { useTRPC } from '@/trpc/client';
import { useQueryClient } from '@tanstack/react-query';

interface BannerUploadModalProps {
  userId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const BannerUploadModal = ({
  userId,
  open,
  onOpenChange,
}: BannerUploadModalProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const onUploadComplete = async () => {
    await queryClient.invalidateQueries(
      trpc.users.getOne.queryOptions({
        id: userId,
      }),
    );
    onOpenChange(false);
  };

  return (
    <ResponsiveDialog
      title='Upload a Banner'
      open={open}
      onOpenChange={onOpenChange}
    >
      <UploadDropzone
        endpoint='bannerUploader'
        onClientUploadComplete={onUploadComplete}
      />
    </ResponsiveDialog>
  );
};

export default BannerUploadModal;
