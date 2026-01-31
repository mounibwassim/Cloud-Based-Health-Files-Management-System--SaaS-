import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyCZeuLUEKoiYsaBhz_g4som-P1n7kBthuk",
    authDomain: "health-files-management-system.firebaseapp.com",
    projectId: "health-files-management-system",
    storageBucket: "health-files-management-system.firebasestorage.app",
    messagingSenderId: "988895529759",
    appId: "1:988895529759:web:f812e41e420d2a62fc7e2a",
    measurementId: "G-21KL7THNMP"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
