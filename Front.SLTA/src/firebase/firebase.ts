// Importa las funciones necesarias del SDK
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Configuración de tu proyecto Firebase
const firebaseConfig = {
  apiKey: "AIzaSyChMR9_yLAi48Ts0J-o0SGnDjfKDOGYs3M",
  authDomain: "sltdatabase-aa1ce.firebaseapp.com",
  projectId: "sltdatabase-aa1ce",
  storageBucket: "sltdatabase-aa1ce.firebasestorage.app",
  messagingSenderId: "969231347173",
  appId: "1:969231347173:web:254ea0ffb905bc5782130c",
  measurementId: "G-GKCD0F0378",
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa y exporta la autenticación
export const auth = getAuth(app);

// Inicializa y exporta Firestore
export const db = getFirestore(app);
