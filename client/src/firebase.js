// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "viviendajovencarm.firebaseapp.com",
  projectId: "viviendajovencarm",
  storageBucket: "viviendajovencarm.appspot.com",
  messagingSenderId: "912799084732",
  appId: "1:912799084732:web:f9ab77707a50c40540a0b9"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);