// Secure configuration endpoint for Firebase
export default function handler(req, res) {
    // Return sanitized config for Client-Side use
    // Using Vercel Environment Variables
    res.status(200).json({
        apiKey: process.env.VITE_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
        authDomain: "learnfinnish-2e11e.firebaseapp.com",
        projectId: "learnfinnish-2e11e",
        storageBucket: "learnfinnish-2e11e.firebasestorage.app",
        messagingSenderId: "810288081740",
        appId: "1:810288081740:web:332c685fb4c4512224bde9",
        measurementId: "G-RXBL077KET"
    });
}
