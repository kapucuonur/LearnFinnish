// Firebase Authentication Service (using CDN for compatibility)
import { getFirebase } from '../firebase.js';
import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import {
  doc,
  setDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

// Enhanced sign in with error handling and DB Sync
async function signInWithGoogle() {
  try {
    const { auth, db } = await getFirebase();
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // SAVE USER TO DATABASE (Firestore)
    try {
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        lastLogin: serverTimestamp(),
      }, { merge: true });
      console.log('User synced to Firestore:', user.uid);
    } catch (dbError) {
      console.error('Error saving user to Firestore:', dbError);
    }

    console.log('Login successful:', user.displayName);
    return { success: true, user: user };
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    const errorMessage = getErrorMessage(error);
    return { success: false, error: errorMessage };
  }
}

// Enhanced sign out with error handling
async function signOutUser() {
  try {
    const { auth } = await getFirebase();
    await signOut(auth);
    console.log('Logout successful');
    return { success: true };
  } catch (error) {
    console.error('Logout Error:', error);
    return { success: false, error: 'An error occurred during logout.' };
  }
}

// Async Auth State Observer Wrapper
async function observeAuthState(callback) {
  const { auth } = await getFirebase();
  return onAuthStateChanged(auth, callback);
}

export { signInWithGoogle, signOutUser, observeAuthState };