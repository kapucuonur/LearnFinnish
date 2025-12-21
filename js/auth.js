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

// Helper function for user-friendly error messages
function getErrorMessage(error, lang = 'tr') {
  const errorMessages = {
    'auth/popup-closed-by-user': {
      tr: 'Giriş penceresi kapatıldı. Lütfen tekrar deneyin.',
      en: 'Login popup was closed. Please try again.'
    },
    'auth/popup-blocked': {
      tr: 'Popup engellendi. Lütfen tarayıcınızın popup ayarlarını kontrol edin.',
      en: 'Popup blocked. Please check your browser popup settings.'
    },
    'auth/cancelled-popup-request': {
      tr: 'Giriş işlemi iptal edildi.',
      en: 'Login cancelled.'
    },
    'auth/network-request-failed': {
      tr: 'Ağ hatası. İnternet bağlantınızı kontrol edin.',
      en: 'Network error. Please check your internet connection.'
    },
    'auth/unauthorized-domain': {
      tr: 'Bu domain Firebase\'de yetkilendirilmemiş. Lütfen Firebase Console\'da localhost ekleyin.',
      en: 'This domain is not authorized in Firebase. Please add localhost in Firebase Console.'
    },
    'default': {
      tr: 'Giriş sırasında bir hata oluştu. Lütfen tekrar deneyin.',
      en: 'An error occurred during login. Please try again.'
    }
  };

  const message = errorMessages[error.code] || errorMessages['default'];
  return message[lang] || message['tr'];
}

// Enhanced sign in with error handling
async function signInWithGoogle(lang = 'tr') {
  try {
    const result = await signInWithPopup(auth, provider);
    console.log('Login successful:', result.user.displayName);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Firebase Auth Error:', error);
    const errorMessage = getErrorMessage(error, lang);
    return { success: false, error: errorMessage };
  }
}

// Enhanced sign out with error handling
async function signOutUser(lang = 'tr') {
  try {
    await signOut(auth);
    console.log('Logout successful');
    return { success: true };
  } catch (error) {
    console.error('Logout Error:', error);
    const errorMessage = lang === 'tr' 
      ? 'Çıkış yaparken bir hata oluştu.' 
      : 'An error occurred during logout.';
    return { success: false, error: errorMessage };
  }
}

// Hata yakalama için
auth.onAuthStateChanged(() => {}, (error) => {
  console.error('Firebase Auth Error:', error);
});

export { auth, provider, signInWithGoogle, signOutUser, onAuthStateChanged };