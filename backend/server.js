import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

import webhookRouter from './routes/webhook.js';
import storyRouter from './routes/story.js';
import translateRouter from './routes/translate.js';
import ttsRouter from './routes/tts.js';
import generateExampleRouter from './routes/generate-example.js';
import generateLevelRouter from './routes/generate-level.js';
import checkPremiumRouter from './routes/check-premium.js';
import checkoutRouter from './routes/create-checkout-session.js';
import portalRouter from './routes/create-portal-session.js';
import firebaseConfigRouter from './routes/get-firebase-config.js';

dotenv.config();

const app = express();

// ⚠️ Webhook MUST use raw body — register BEFORE express.json()
app.use('/api/webhook', express.raw({ type: 'application/json' }), webhookRouter);

// CORS — allow your frontend domain(s)
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['https://learn-finnish.com', 'http://localhost:5173'];

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

// Health check
app.get('/health', (_req, res) => res.json({ status: 'ok', service: 'LearnFinnish API' }));

// Routes — mirrors the original Vercel API path structure
app.use('/api/story', storyRouter);
app.use('/api/translate', translateRouter);
app.use('/api/tts', ttsRouter);
app.use('/api/generate-example', generateExampleRouter);
app.use('/api/generate-level', generateLevelRouter);
app.use('/api/check-premium', checkPremiumRouter);
app.use('/api/create-checkout-session', checkoutRouter);
app.use('/api/create-portal-session', portalRouter);
app.use('/api/firebase-config', firebaseConfigRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`✅ LearnFinnish API running on http://localhost:${PORT}`);
});
