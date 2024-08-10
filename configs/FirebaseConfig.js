// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCDnuRiOzgLTi6TQE7VJ5AKu1ZklybXtZY",
  authDomain: "projetoaplicativo-e5dc8.firebaseapp.com",
  projectId: "projetoaplicativo-e5dc8",
  storageBucket: "projetoaplicativo-e5dc8.appspot.com",
  messagingSenderId: "476276981454",
  appId: "1:476276981454:web:19a7636f7e2d7ebc899a9f",
  measurementId: "G-2EQBDGNCZ4"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const storage = getStorage(app);
// const analytics = getAnalytics(app);