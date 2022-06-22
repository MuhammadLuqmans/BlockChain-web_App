import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDQ3QziX1A1E2I17HIx31gNNGfbI79Z_qI",
  authDomain: "web3project-2c6e1.firebaseapp.com",
  projectId: "web3project-2c6e1",
  storageBucket: "web3project-2c6e1.appspot.com",
  messagingSenderId: "971644992898",
  appId: "1:971644992898:web:4ec021d3d6b0a59834e39b",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export { db };

// npm install -g firebase-tools
