import path from 'path';
import { createServer as createViteServer } from 'vite';
import app from './server/app';
import { connectDB } from './server/db';

async function startServer() {
  const PORT = 3000;

  // Initialize MongoDB connection
  await connectDB();

  // Vite static/middleware rendering configuration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    console.log('Vite middleware mounted successfully on Express app.');
  } else {
    // Serve production build files
    const distPath = path.join(process.cwd(), 'dist');
    app.use(expressStaticMiddleware(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
    console.log('Serving production bundles from /dist.');
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Italia Restaurant Backend listening at http://0.0.0.0:${PORT}`);
  });
}

// Helper to avoid circular dependencies or TypeScript namespace issues
function expressStaticMiddleware(distPath: string) {
  const express = require('express');
  return express.static(distPath);
}

startServer().catch((err) => {
  console.error('Failed to launch full-stack application server:', err);
});
