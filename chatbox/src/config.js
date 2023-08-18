import {initializeApp} from "firebase/app";
import { getAuth,} from "firebase/auth";
import {getFirestore} from 'firebase/firestore'


const firebaseConfig = {
  apiKey: "AIzaSyCj27Xu0Qk_xUkGq_7qyZZj5hm-x8x1Zg4",
  authDomain: "newchatbox-7e3e5.firebaseapp.com",
  projectId: "newchatbox-7e3e5",
  storageBucket: "newchatbox-7e3e5.appspot.com",
  messagingSenderId: "82348991797",
  appId: "1:82348991797:web:02a6219a5ce473be88187c"
};


const app = initializeApp(firebaseConfig);
export const auth =getAuth(app)
export const db = getFirestore(app)
export default app