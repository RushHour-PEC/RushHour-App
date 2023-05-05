import { initializeApp } from "firebase/app";
import { getDatabase, ref, get } from 'firebase/database';


const firebaseConfig = {
  apiKey: "AIzaSyATu9b_FirpzKPzr8GQ3o_5EEZqlyPUwls",
  authDomain: "rushhour-71742.firebaseapp.com",
  databaseURL: "https://rushhour-71742-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "rushhour-71742",
  storageBucket: "rushhour-71742.appspot.com",
  messagingSenderId: "228513646943",
  appId: "1:228513646943:web:269632eb4c98b55335ceea",
  measurementId: "G-B4NEQ60SCT"
};



const app = initializeApp(firebaseConfig);
const database = getDatabase(app);



export{database}