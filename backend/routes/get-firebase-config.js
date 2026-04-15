import { Router } from 'express';

const router = Router();

// Returns Firebase client config securely from env vars
router.get('/', (_req, res) => {
  res.status(200).json({
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: 'learnfinnish-2e11e.firebaseapp.com',
    projectId: 'learnfinnish-2e11e',
    storageBucket: 'learnfinnish-2e11e.firebasestorage.app',
    messagingSenderId: '810288081740',
    appId: '1:810288081740:web:332c685fb4c4512224bde9',
    measurementId: 'G-RXBL077KET',
  });
});

export default router;
