import { serve } from '@upstash/workflow/nextjs';
import { db } from '@/db';
import { videos } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import { openai } from '@/lib/openAI';

interface WorkflowInput {
  userId: string;
  videoId: string;
}

const TITLE_SYSTEM_PROMPT = `Your task is to generate an SEO-focused title for a YouTube video based on its transcript. Please follow these guidelines:

- Be concise but descriptive, using relevant keywords to improve discoverability.
- Highlight the most compelling or unique aspect of the video content.
- Avoid jargon or overly complex language unless it directly supports searchability.
- Use action-oriented phrasing or clear value propositions where applicable.
- Ensure the title is 3-8 words long and no more than 100 characters.
- ONLY return the title as plain text. Do not add quotes or any additional formatting.`;

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

  // const { body } = await context.api.openai.call('Call AI', {
  //   // baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
  //   // token: process.env.QWEN_API_KEY!,
  //   baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
  //   token: process.env.GOOGLE_GENAI_API_KEY!,
  //   operation: 'chat.completions.create',
  //   body: {
  //     // model: 'qwen-plus',
  //     model: 'gemini-2.0-flash',
  //     messages: [
  //       {
  //         role: 'system',
  //         content: TITLE_SYSTEM_PROMPT,
  //       },
  //       {
  //         role: 'user',
  //         content: 'Hi everyone, in this tutorial, we will learn how to build a youtube clone using Next.js and Drizzle ORM. We will cover everything from setting up the project to deploying it on Vercel.',
  //       },
  //     ],
  //   },
  // });

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

  const response = await context.run('generate-title', async () => {
    return openai.chat.completions.create({
      model: 'qwen-plus',
      messages: [
        {
          role: 'system',
          content: TITLE_SYSTEM_PROMPT,
        },
        {
          role: 'user',
          content: transcript,
        },
      ],
    });
  });

  const title = response.choices[0].message.content;
  if (!title) {
    throw new Error('Title generation failed');
  }

  await context.run('update-video', async () => {
    await db
      .update(videos)
      .set({ title: title || video.title })
      .where(and(eq(videos.id, video.id), eq(videos.userId, video.userId)));
  });
});
