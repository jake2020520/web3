import { db } from '@/db';
import { users } from '@/db/schema';
import { verifyWebhook } from '@clerk/nextjs/webhooks';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    console.info('Received webhook--', req);
    const evt = await verifyWebhook(req);

    // Do something with payload
    // For this guide, log payload to console
    const eventType = evt.type;
    // console.log(`Received webhook with ID ${id} and event type of ${eventType}`);
    console.info('Webhook eventType:-', eventType);
    if (eventType === 'user.created') {
      const { data } = evt;
      console.info('Webhook created:--', data);
      await db.insert(users).values({
        clerkId: data.id,
        name: `${data.first_name} ${data.last_name}`,
        imageUrl: data.image_url,
      });
    }

    if (eventType === 'user.deleted') {
      const { data } = evt;

      if (!data.id) {
        return new Response('Missing user id', { status: 400 });
      }

      await db.delete(users).where(eq(users.clerkId, data.id));
    }

    if (eventType === 'user.updated') {
      const { data } = evt;
      console.info('Webhook updated:-00--', data);
      console.info('Webhook updated:--11-', users);
      await db
        .update(users)
        .set({
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        })
        .where(eq(users.clerkId, data.id));
      console.info('User updated in database successfully');
      const data11 = await db.select().from(users);
      console.log('--User updated-getMany-', data11);
    }

    return new Response('Webhook received', { status: 200 });
  } catch (err) {
    console.error('Error verifying webhook:', err);
    return new Response('Error verifying webhook', { status: 400 });
  }
}
