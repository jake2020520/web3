// import { drizzle } from 'drizzle-orm/neon-http';
// console.log('DATABASE_URL--db-', process.env.DATABASE_URL);
// export const db = drizzle(process.env.DATABASE_URL!);
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle({ client: sql });
