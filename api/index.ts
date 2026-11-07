import { serverApp, ensureDbInitialized } from './_app.js';
import handler from './index.js';

// Vercel Serverless Function entry point: delegates to serverApp(req, res)
export default handler;
