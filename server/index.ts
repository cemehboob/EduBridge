import path from 'path';
import express from 'express';
import { serverApp } from './app';

const PORT = parseInt(process.env.PORT || '3000', 10);
const HOST = process.env.HOST || '0.0.0.0';

// In production, serve built static assets from dist/
const distPath = path.resolve(process.cwd(), 'dist');
serverApp.use(express.static(distPath));

// For SPA client routing, fall back to index.html for non-API routes
serverApp.get('*', (req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return next();
  }
  const indexPath = path.join(distPath, 'index.html');
  res.sendFile(indexPath, (err) => {
    if (err) {
      res.status(404).send('EduBridge production bundle not found. Please run "npm run build" first.');
    }
  });
});

serverApp.listen(PORT, HOST, () => {
  console.log(`[EduBridge Central Server] Listening on http://${HOST}:${PORT}`);
  console.log(`[EduBridge Central Server] Centralized user & activity vault active.`);
});

