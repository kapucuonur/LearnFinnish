
import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

let dbInstance = null;
let authInstance = null;
let initPromise = null;

export async function getFirebase() {
    if (dbInstance && authInstance) return { db: dbInstance, auth: authInstance };

    if (!initPromise) {
        initPromise = (async () => {
            try {
                // Fetch secure config from Backend Proxy
                const res = await fetch('/api/get-firebase-config');
                if (!res.ok) throw new Error('Failed to fetch firebase config');
                const firebaseConfig = await res.json();

                const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
                dbInstance = getFirestore(app);
                authInstance = getAuth(app);

                console.log("🔥 Firebase initialized securely via Backend Proxy");
                return { db: dbInstance, auth: authInstance };
            } catch (error) {
                console.error("Firebase Init Error:", error);
                throw error;
            }
        })();
    }

    return initPromise;
}

// Fallback for legacy imports (will be null initially, use getFirebase() instead)
export const db = dbInstance;
export const auth = authInstance;
