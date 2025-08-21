import { db } from '@/db';
import { videos } from '@/db/schema';
import { fetchThumbnail, generateThumbnail } from '@/lib/openAI';
import { serve } from '@upstash/workflow/nextjs';
import { and, eq } from 'drizzle-orm';
import { UTApi } from 'uploadthing/server';

interface WorkflowInput {
  userId: string;
  videoId: string;
  prompt: string;
}

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as WorkflowInput;
  const { videoId, userId, prompt } = input;
  const utapi = new UTApi();

  const video = await context.run('get-video', async () => {
    const existingVideo = await db
      .select()
      .from(videos)
      .where(and(eq(videos.id, videoId), eq(videos.userId, userId)));

    if (!existingVideo[0]) {
      throw new Error('Video not found');
    }
    return existingVideo[0];
  });

  const tempThumbnail = await context.run('generate-thumbnail', async () => {
    const { output } = await generateThumbnail(prompt);
    if (!output || !output.task_id) {
      throw new Error('Thumbnail generation failed');
    }

    let attempt = 0;
    const maxAttempts = 10;

    while (attempt < maxAttempts) {
      const data = await fetchThumbnail(output.task_id);
      console.log('🚀 ~ awaitcontext.run ~ fetchThumbnail ~ data:', data);

      if (
        data.output.task_status === 'PENDING' ||
        data.output.task_status === 'RUNNING'
      ) {
        console.log('Thumbnail generation in progress, waiting...');
        attempt++;
        await new Promise((resolve) => setTimeout(resolve, 5000)); // Wait for 5 seconds before retrying
      } else if (
        data.output.task_status === 'FAILED' ||
        data.output.task_status === 'CANCELED' ||
        data.output.task_status === 'UNKNOWN'
      ) {
        throw new Error('Thumbnail generation failed');
      } else if (data.output.task_status === 'SUCCEEDED') {
        console.log('Thumbnail generation succeeded:', data.output.results[0]);
        return data.output.results[0].url as string;
      }
    }
  });

  if (!tempThumbnail) {
    throw new Error('Thumbnail generation failed');
  }

  await context.run('thumbnail-cleanup', async () => {
    if (video.thumbnailKey) {
      await utapi.deleteFiles(video.thumbnailKey);
      await db
        .update(videos)
        .set({
          thumbnailUrl: null,
        })
        .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
    }
  });

  const uploadedThumbnail = await context.run('update-thumbnail', async () => {
    const { data } = await utapi.uploadFilesFromUrl(tempThumbnail);

    if (!data) {
      throw new Error('Thumbnail upload failed');
    }

    return data;
  });

  await context.run('update-video', async () => {
    await db
      .update(videos)
      .set({
        thumbnailUrl: uploadedThumbnail.ufsUrl,
        thumbnailKey: uploadedThumbnail.key,
      })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
