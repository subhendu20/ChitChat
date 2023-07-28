import {initializeApp} from "firebase/app";
import { getAuth,} from "firebase/auth";
import {getFirestore} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyDY0ZP_lCNd-pwAZLLBuWd-fh0WzIr7mjo",
  authDomain: "chatbox2-32838.firebaseapp.com",
  projectId: "chatbox2-32838",
  storageBucket: "chatbox2-32838.appspot.com",
  messagingSenderId: "215153446381",
  appId: "1:215153446381:web:627c7581488a1715cd6be4"
};


const app = initializeApp(firebaseConfig);
export const auth =getAuth(app)
export const db = getFirestore(app)
export default app