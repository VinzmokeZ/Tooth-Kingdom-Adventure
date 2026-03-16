// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCX16H6LtmsOE6qs0-i9eLZmV5G2_KwRFU",
    authDomain: "tooth-kingdom-adventure.firebaseapp.com",
    projectId: "tooth-kingdom-adventure",
    storageBucket: "tooth-kingdom-adventure.firebasestorage.app",
    messagingSenderId: "678156466470",
    appId: "1:678156466470:web:5edb67b5389fc975c1e9e7",
    measurementId: "G-HKPL0R9TN1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

// Backend Toggle Configuration
const metaEnv = (import.meta as any).env || {};
// Force mockup mode by default for LIVE_DEV (easy login, no CAPTCHA)
export const USE_LOCAL_BACKEND = metaEnv.VITE_USE_LOCAL_BACKEND !== 'false'; 

// Dynamic API Discovery:
// In dev, use the env var or localhost:8000
// In production, if USE_LOCAL_BACKEND is true, assume the API is at our current origin
const getBackendUrl = () => {
    const envUrl = metaEnv.VITE_LOCAL_BACKEND_URL;
    if (envUrl) return envUrl;

    // Check if we are in a production browser environment
    if (typeof window !== 'undefined' && (import.meta as any).env?.PROD) {
        // In "Hybrid Zero-Install" mode, we serve api.php from the root of the build
        return `${window.location.origin}/api.php`;
    }

    // Fallback to dynamic hostname for LAN dev (handles localhost, 127.0.0.1, and IPs)
    if (typeof window !== 'undefined') {
        const hostname = window.location.hostname;
        const isNative = (window as any).Capacitor?.isNative;
        
        // On physical Android, 'localhost' is the phone. 10.0.2.2 is the Emulator's bridge to PC.
        // We default to the known backend port 8010.
        if (hostname === 'localhost' || hostname === '127.0.0.1') {
            if (isNative) return 'http://10.0.2.2:8010'; // Standard Android Emulator-to-PC bridge
            return 'http://127.0.0.1:8010'; 
        }
        return `http://${hostname}:8010`;
    }
    return 'http://127.0.0.1:8010';
};

export const LOCAL_BACKEND_URL = getBackendUrl();

if (typeof window !== 'undefined') {
    console.log('[BACKEND] Discovered API URL:', LOCAL_BACKEND_URL);
}

// Live Mirror / Shadow Backend Configuration (For syncing while using Firebase)
export const SHADOW_BACKEND_SYNC = (import.meta as any).env?.VITE_SHADOW_BACKEND_SYNC === 'true';
export const SHADOW_BACKEND_URL = (import.meta as any).env?.VITE_SHADOW_BACKEND_URL || LOCAL_BACKEND_URL;

export default app;
