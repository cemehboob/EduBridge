import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig(({ command }) => {
  const isBuild = command === 'build';

  return {
    base: './',
    plugins: [
      react(),
      tailwindcss(),
      // Attach local API server middleware ONLY for dev and preview servers, never during static build
      ...(!isBuild
        ? [
            {
              name: 'edubridge-api-server',
              async configureServer(server: any) {
                const { serverApp } = await import('./server/app');
                server.middlewares.use(serverApp);
              },
              async configurePreviewServer(server: any) {
                const { serverApp } = await import('./server/app');
                server.middlewares.use(serverApp);
              }
            }
          ]
        : [])
    ],
    resolve: {
      alias: {
        '@': path.resolve('.'),
      },
    },
    server: {
      allowedHosts: true as const,
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
    preview: {
      allowedHosts: true as const,
    },
  };
});

