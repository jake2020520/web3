import { db } from '@/db';
import { users } from '@/db/schema';
import { ratelimit } from '@/lib/ratelimit';
import { auth } from '@clerk/nextjs/server';
import { initTRPC, TRPCError } from '@trpc/server';
import { eq } from 'drizzle-orm';
import { cache } from 'react';
import superjson from 'superjson';

export const createTRPCContext = cache(async () => {
  const { userId } = await auth();
  /**
   * @see: https://trpc.io/docs/server/context
   */
  return { clerkUserId: userId };
});
export type Context = Awaited<ReturnType<typeof createTRPCContext>>;
// Avoid exporting the entire t-object
// since it's not very descriptive.
// For instance, the use of a t variable
// is common in i18n libraries.
const t = initTRPC.context<Context>().create({
  /**
   * @see https://trpc.io/docs/server/data-transformers
   */
  transformer: superjson,
});
// Base router and procedure helpers
export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;

const timingMiddleware = t.middleware(async ({ next, path }) => {
  const start = Date.now();

  if (t._config.isDev) {
    // artificial delay in dev
    const waitMs = Math.floor(Math.random() * 400) + 100;
    await new Promise((resolve) => setTimeout(resolve, waitMs));
  }

  const result = await next();

  const end = Date.now();
  console.log(`[TRPC] ${path} took ${end - start}ms to execute`);

  return result;
});

const rateLimitMiddleware = t.middleware(async ({ next, ctx, path }) => {
  const clerkId = ctx.clerkUserId;
  if (!clerkId) {
    throw new TRPCError({
      code: 'UNAUTHORIZED',
      message: 'No user ID found for rate limiting',
    });
  }
  const { success, limit, remaining, reset } = await ratelimit.limit(clerkId);

  if (!success) {
    console.warn(
      `[RateLimit][${clerkId}] ${path} - BLOCKED | limit=${limit}, remaining=${remaining}, reset=${reset}`,
    );
    throw new TRPCError({
      code: 'TOO_MANY_REQUESTS',
      message: 'Rate limit exceeded',
    });
  }

  console.log(
    `[RateLimit][${clerkId}] ${path} - ALLOWED | remaining=${remaining}, reset=${reset}`,
  );

  return next();
});

export const baseProcedure = t.procedure.use(timingMiddleware);

export const protectedProcedure = t.procedure
  .use(timingMiddleware)
  .use(rateLimitMiddleware)
  .use(async ({ ctx, next }) => {
    if (!ctx.clerkUserId) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Not authenticated',
      });
    }

    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.clerkId, ctx.clerkUserId));

    if (!user) {
      throw new TRPCError({ code: 'UNAUTHORIZED', message: 'User  not found' });
    }

    const { success } = await ratelimit.limit(user.clerkId);

    if (!success) {
      throw new TRPCError({
        code: 'TOO_MANY_REQUESTS',
        message: 'Rate limit exceeded',
      });
    }

    return next({ ctx: { ...ctx, user } });
  });
