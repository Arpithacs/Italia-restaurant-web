import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth';
import menuRoutes from './routes/menu';
import orderRoutes from './routes/orders';
import contactRoutes from './routes/contact';
import feedbackRoutes from './routes/feedback';

const expressFn = typeof express === 'function'
  ? express
  : (express && (express as any).default) || require('express');

const corsFn = typeof cors === 'function'
  ? cors
  : (cors && (cors as any).default) || require('cors');

const app = expressFn();

// Standard middleware
app.use(corsFn());
app.use(expressFn.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/menu', menuRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/feedback', feedbackRoutes);

export default app;
