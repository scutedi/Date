// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyA3hqWpgefpdRtZB8KHkp5tn7Rzfkd_Rs0",
    authDomain: "web-app-9bf25.firebaseapp.com",
    projectId: "web-app-9bf25",
    storageBucket: "web-app-9bf25.firebasestorage.app",
    messagingSenderId: "540799336022",
    appId: "1:540799336022:web:8f5040417a82d1009245f7",
    measurementId: "G-KR8WWTLGG7"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);