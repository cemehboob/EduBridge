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

  // Restore the original user-requested path if Vercel rewrote it to /api/index
  const matchedPath = (req.headers && (req.headers['x-matched-path'] as string || req.headers['x-invoke-path'] as string));
  if (matchedPath && matchedPath !== '/api/index' && matchedPath !== '/api') {
    const queryIndex = (req.url || '').indexOf('?');
    const queryString = queryIndex !== -1 ? req.url.slice(queryIndex) : '';
    req.url = matchedPath + (matchedPath.includes('?') ? '' : queryString);
  }

  // Normalize route url if /api was stripped by Vercel rewrite
  if (req.url && !req.url.startsWith('/api')) {
    req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
  }

  return serverApp(req, res);
}
