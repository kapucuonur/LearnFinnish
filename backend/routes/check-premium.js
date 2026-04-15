import { Router } from 'express';
import { auth, db } from '../config/firebase.js';

const router = Router();

router.get('/', async (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const userDoc = await db.collection('users').doc(decodedToken.uid).get();

    return res.status(200).json({
      isPremium: userDoc.exists && userDoc.data().isPremium === true,
    });
  } catch (error) {
    console.error('Error checking premium status:', error);
    return res.status(401).json({ error: 'Unauthorized or failed to check premium status' });
  }
});

export default router;
