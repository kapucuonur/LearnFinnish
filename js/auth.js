// js/auth.js - Firebase Auth (2025 güncel modular SDK)
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.7.0/firebase-app.js";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut, 
  onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/12.7.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyABTl3pLxVHJKa3RCOz1ZgheKbNs-NbjfM",
  authDomain: "learnfinnish-2e11e.firebaseapp.com",
  projectId: "learnfinnish-2e11e",
  storageBucket: "learnfinnish-2e11e.firebasestorage.app",
  messagingSenderId: "810288081740",
  appId: "1:810288081740:web:332c685fb4c4512224bde9",
  measurementId: "G-RXBL077KET"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Hata yakalama için
auth.onAuthStateChanged(() => {}, (error) => {
  console.error('Firebase Auth Error:', error);
});

export { auth, provider, signInWithPopup, signOut, onAuthStateChanged };