// Import the functions you need from the SDKs you need
// import * as firebase from "firebase";
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import  "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyATu9b_FirpzKPzr8GQ3o_5EEZqlyPUwls",
  authDomain: "rushhour-71742.firebaseapp.com",
  projectId: "rushhour-71742",
  storageBucket: "rushhour-71742.appspot.com",
  messagingSenderId: "228513646943",
  appId: "1:228513646943:web:269632eb4c98b55335ceea",
  measurementId: "G-B4NEQ60SCT"
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);

const app = initializeApp(firebaseConfig)
// if(firebase.apps.length == 0) app = initializeApp(firebaseConfig); else app = firebase.app()
// const analytics = getAnalytics(app);
const auth = getAuth(app)
const db = app.firestore()
export default {auth,db}