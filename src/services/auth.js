// Firebase Authentication Service (using CDN for compatibility)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

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
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();


// Helper function for user-friendly error messages
function getErrorMessage(error) {
  const errorMessages = {
    'auth/popup-closed-by-user': 'Login popup was closed. Please try again.',
    'auth/popup-blocked': 'Popup blocked. Please check your browser popup settings.',
    'auth/cancelled-popup-request': 'Login cancelled.',
    'auth/network-request-failed': 'Network error. Please check your internet connection.',
    'auth/unauthorized-domain': 'This domain is not authorized in Firebase. Please add localhost in Firebase Console.',
    'default': 'An error occurred during login. Please try again.'
  };

  return errorMessages[error.code] || errorMessages['default'];
}

// Enhanced sign in with error handling
async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('Login successful:', result.user.displayName);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    const errorMessage = getErrorMessage(error);
    return { success: false, error: errorMessage };
  }
}

// Enhanced sign out with error handling
async function signOutUser() {
  try {
    await signOut(auth);
    console.log('Logout successful');
    return { success: true };
  } catch (error) {
    console.error('Logout Error:', error);
    return { success: false, error: 'An error occurred during logout.' };
  }
}

// Hata yakalama için
onAuthStateChanged(auth, (user) => { }, (error) => {
  console.error('Firebase Auth Error:', error);
});

export { signInWithGoogle, signOutUser, onAuthStateChanged };