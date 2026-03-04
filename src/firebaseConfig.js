import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBf-gyN_IW3oWMttgiM3ITroQQ0_uRz1WQ",
  authDomain: "suzyhikes.firebaseapp.com",
  projectId: "suzyhikes",
  appId: "1:829419318280:web:831d9bc6ac4856d791f5bd",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };