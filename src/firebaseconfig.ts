// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth , GoogleAuthProvider} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBctlGjVBPDHhr34jLPiHuQtNvY0Thx-k0",
  authDomain: "metroll-c924c.firebaseapp.com",
  projectId: "metroll-c924c",
  storageBucket: "metroll-c924c.appspot.com",
  messagingSenderId: "1012554613311",
  appId: "1:1012554613311:web:5b9deb9281b46d2edc6e8a",
  measurementId: "G-Q6DHKKY7V5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);