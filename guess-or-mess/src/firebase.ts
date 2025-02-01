// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAFdyHuvPSUKOye0HpBlOgKLExG1P0uyAI",
  authDomain: "guessormess.firebaseapp.com",
  projectId: "guessormess",
  storageBucket: "guessormess.firebasestorage.app",
  messagingSenderId: "658851279817",
  appId: "1:658851279817:web:65e5d87bbb2debc3c26e18",
  measurementId: "G-DFXFXDNF81"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { app, analytics };