import { OpenAI } from 'openai';

export const openai = new OpenAI({
  // baseURL: 'https://api.deepseek.com',
  // apiKey: process.env.DEEPSEEK_API_KEY,
  apiKey: process.env.QWEN_API_KEY,
  baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
});

export const generateThumbnail = async (prompt: string) => {
  try {
    const res = await fetch(
      'https://dashscope.aliyuncs.com/api/v1/services/aigc/text2image/image-synthesis',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
          'X-DashScope-Async': 'enable',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'wanx2.1-t2i-plus',
          input: {
            prompt,
          },
          parameters: {
            n: 1,
            size: '1440*810',
            prompt_extend: false,
          },
        }),
      },
    );
    if (!res.ok) {
      throw new Error(`Failed to generate thumbnail: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error generating thumbnail:', error);
    throw error;
  }
};

export const fetchThumbnail = async (taskId: string) => {
  try {
    const res = await fetch(
      `https://dashscope.aliyuncs.com/api/v1/tasks/${taskId}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.QWEN_API_KEY}`,
        },
      },
    );
    if (!res.ok) {
      throw new Error(`Failed to fetch thumbnail: ${res.statusText}`);
    }
    const data = await res.json();
    return data;
  } catch (error) {
    console.error('Error fetching thumbnail:', error);
    throw error;
  }
};
