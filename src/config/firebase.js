// Firebase Configuration
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDvJIqtxNEAKWOkEJGGaGlKPWJQcJkXzgc",
    authDomain: "learnfinnish-6f7b9.firebaseapp.com",
    projectId: "learnfinnish-6f7b9",
    storageBucket: "learnfinnish-6f7b9.firebasestorage.app",
    messagingSenderId: "1090896695829",
    appId: "1:1090896695829:web:6e3f7c4c8f5e4d3c2b1a0f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
