import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig, Plugin } from 'vite';
import { generateStylingAdvice, explainColorAesthetics, generateOutfitImage } from './server/geminiApi.ts';

function apiPlugin(): Plugin {
  return {
    name: 'vietphuc-api-plugin',
    configureServer(server) {
      server.middlewares.use('/api/ai-suggest', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const advice = await generateStylingAdvice(data);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, advice }));
            } catch (err: unknown) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: (err as Error).message }));
            }
          });
          return;
        }
        res.statusCode = 404;
        res.end();
      });

      server.middlewares.use('/api/color-harmony', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const explanation = await explainColorAesthetics(data);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: true, explanation }));
            } catch (err: unknown) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: (err as Error).message }));
            }
          });
          return;
        }
        res.statusCode = 404;
        res.end();
      });

      server.middlewares.use('/api/generate-outfit-image', (req, res) => {
        if (req.method === 'POST') {
          let body = '';
          req.on('data', (chunk) => {
            body += chunk;
          });
          req.on('end', async () => {
            try {
              const data = JSON.parse(body || '{}');
              const result = await generateOutfitImage(data);
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify(result));
            } catch (err: unknown) {
              res.statusCode = 500;
              res.setHeader('Content-Type', 'application/json');
              res.end(JSON.stringify({ success: false, error: (err as Error).message }));
            }
          });
          return;
        }
        res.statusCode = 404;
        res.end();
      });
    },
  };
}

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss(), apiPlugin()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      port: 3000,
      host: '0.0.0.0',
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      hmr: process.env.DISABLE_HMR !== 'true',
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});

