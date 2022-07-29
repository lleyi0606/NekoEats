// Import the functions you need from the SDKs you need
// import * as firebase from "firebase";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import firebase from 'firebase/compat/app' 
import 'firebase/compat/auth' 
import 'firebase/compat/firestore'
import { getDatabase } from "firebase/database"
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB2f77JCuavTRJ9Rvfifu0W6xcaFYPPqj0",
  authDomain: "nekoeats-bb581.firebaseapp.com",
  projectId: "nekoeats-bb581",
  storageBucket: "nekoeats-bb581.appspot.com",
  messagingSenderId: "77214233350",
  appId: "1:77214233350:web:8027eed5f9e5ddb9682487",
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);

// const db = firebaseApp.firestore();
const db = getDatabase(firebaseApp)
const fs = getFirestore(firebaseApp)
const auth = firebase.auth();

export { db, fs, auth };