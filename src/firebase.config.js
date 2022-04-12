import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDY9amjnZHtMqBo7RxPfXeWx_keRkIRfdQ",
  authDomain: "house-marketplace-ca770.firebaseapp.com",
  projectId: "house-marketplace-ca770",
  storageBucket: "house-marketplace-ca770.appspot.com",
  messagingSenderId: "87497450386",
  appId: "1:87497450386:web:9eec05bd874eac6f2e574b"
};

// Initialize Firebase
 const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)

