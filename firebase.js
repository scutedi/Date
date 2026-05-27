import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

// CONFIGURAȚIA TA FIREBASE
const firebaseConfig = {
    apiKey: "AIzaSyA3hqWpgefpdRtZB8KHkp5tn7Rzfkd_Rs0",
    authDomain: "web-app-9bf25.firebaseapp.com",
    projectId: "web-app-9bf25",
    storageBucket: "web-app-9bf25.firebasestorage.app",
    messagingSenderId: "540799336022",
    appId: "1:540799336022:web:8f5040417a82d1009245f7",
    measurementId: "G-KR8WWTLGG7"
};

// INITIALIZARE FIREBASE
const app = initializeApp(firebaseConfig);

// INITIALIZARE ȘI EXPORT FIRESTORE
export const db = getFirestore(app);