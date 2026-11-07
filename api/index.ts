import { serverApp, ensureDbInitialized } from '../server/app';

export default async function handler(req: any, res: any) {
  // Ensure database schemas and baseline tables are ready on serverless cold starts
  if (process.env.DATABASE_URL) {
    try {
      await ensureDbInitialized();
    } catch (e: any) {
      console.warn('[Vercel Serverless DB Note]', e.message);
    }
  }

  // Normalize route url if /api was stripped by Vercel rewrite
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }

  return serverApp(req, res);
}


