import { serve } from '@upstash/workflow/nextjs';
import { db } from '@/db';
import { videos } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { openai } from '@/lib/openAI';

interface WorkflowInput {
  userId: string;
  videoId: string;
}

const DESCRIPTION_SYSTEM_PROMPT = `Your task is to summarize the transcript of a video. Please follow these guidelines:

- Be brief. Condense the content into a summary that captures the key points and main ideas without losing important details.
- Avoid jargon or overly complex language unless necessary for the context.
- Focus on the most critical information, ignoring filler, repetitive statements, or irrelevant tangents.
- ONLY return the summary, no other text, annotations, or comments.
- Aim for a summary that is 3-5 sentences long and no more than 200 characters.`;

export const { POST } = serve(async (context) => {
  const input = context.requestPayload as WorkflowInput;
  const { videoId, userId } = input;

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

  // get the transcript from the video
  const transcript = await context.run('get-transcript', async () => {
    const trackUrl = `https://stream.mux.com/${video.muxPlaybackId}/text/${video.muxTrackId}.txt`;
    const response = await fetch(trackUrl);
    const text = response.text();
    if (!text) {
      throw new Error('Transcript not found');
    }

    return text;
  });

  const response = await context.run('generate-description', async () => {
    return openai.chat.completions.create({
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content: DESCRIPTION_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: transcript,
        },
      ],
    });
  });

  const description = response.choices[0].message.content;
  if (!description) {
    throw new Error('Description generation failed');
  }

  await context.run('update-video', async () => {
    await db
      .update(videos)
      .set({ description: description || video.description })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
