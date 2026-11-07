import { serverApp, ensureDbInitialized } from '../server/app';

let dbInitPromise: Promise<void> | null = null;

function sendJson(res: any, status: number, data: any) {
  if (typeof res.status === 'function') {
    return res.status(status).json(data);
  }
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(data));
}

export default async function handler(req: any, res: any) {
  try {
    // 1. One-time cold start DB initialization
    if (!dbInitPromise && process.env.DATABASE_URL) {
      dbInitPromise = ensureDbInitialized().catch((e: any) => {
        console.warn('[Vercel Serverless DB Note]', e.message);
      });
    }
    if (dbInitPromise) {
      await dbInitPromise;
    }

    // 2. Restore user's real requested route URL
    const originalPath =
      (req.headers && (req.headers['x-matched-path'] as string || req.headers['x-forwarded-uri'] as string || req.headers['x-invoke-path'] as string)) ||
      req.url;

    if (originalPath && originalPath !== '/api/index' && originalPath !== '/api') {
      const queryIndex = (req.url || '').indexOf('?');
      const queryString = queryIndex !== -1 ? req.url.slice(queryIndex) : '';
      req.url = originalPath.split('?')[0] + (originalPath.includes('?') ? '' : queryString);
    }

    // Ensure route begins with /api
    if (req.url && !req.url.startsWith('/api')) {
      req.url = `/api${req.url.startsWith('/') ? '' : '/'}${req.url}`;
    }

    // 3. Delegate to Express and await completion so Vercel Serverless function does not terminate prematurely
    return new Promise<void>((resolve, reject) => {
      res.on('finish', resolve);
      res.on('close', resolve);
      res.on('error', reject);
      serverApp(req, res);
    });
  } catch (err: any) {
    console.error('[Vercel Handler Exception]:', err);
    if (!res.headersSent) {
      sendJson(res, 500, {
        success: false,
        error: err.message || 'Internal Serverless Handler Error',
        timestamp: new Date().toISOString()
      });
    }
  }
}
