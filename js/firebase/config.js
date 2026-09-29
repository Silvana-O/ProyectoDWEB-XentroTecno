import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyDg4XFahNYSdFHBPNCh56Dhl_r3s3vN3S4",
    authDomain: "xentrotecno-e95f2.firebaseapp.com",
    projectId: "xentrotecno-e95f2",
    storageBucket: "xentrotecno-e95f2.firebasestorage.app",
    messagingSenderId: "83163665080",
    appId: "1:83163665080:web:d653a9886dce9cee1f9a4d"
};

export const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

export const db = getFirestore(app);