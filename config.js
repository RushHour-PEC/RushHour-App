// // Import the functions you need from the SDKs you need
// import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";

import * as firebase from 'firebase'
import 'firebase/auth'
import 'firebase/firestore'

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
let app;
if(firebase.apps.length === 0){
 app = firebase.initializeApp(firebaseConfig);
}else{
 app = firebase.app()
}

const db = app.firestore()
const auth = firebase.auth()
export {db,auth}
// const analytics = getAnalytics(app);