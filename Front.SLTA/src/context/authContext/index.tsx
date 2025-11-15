import React, { useContext, useState, useEffect, ReactNode } from "react";
import { auth, db } from "../../firebase/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

//Definimos el tipo del contexto
interface AuthContextType {
  currentUser: User | null;
  userLoggedIn: boolean;
  loading: boolean;
  userRole: "user" | "admin" | null; // 👈 Nuevo campo para el rol
  isAdmin: boolean; // 👈 Helper para verificar si es admin
}

//Creamos el contexto con tipo genérico
const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

//Definimos las props del proveedor
interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<"user" | "admin" | null>(null); // 👈 Estado para el rol

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, handleUserChange);
    return unsubscribe;
  }, []);

  async function handleUserChange(user: User | null) {
    if (user) {
      setCurrentUser(user);
      setUserLoggedIn(true);

      // 👇 Obtener el rol del usuario desde Firestore
      try {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setUserRole(userData.role || "user"); // Por defecto "user" si no tiene rol
        } else {
          setUserRole("user"); // Si no existe el documento, es usuario normal
        }
      } catch (error) {
        console.error("Error al obtener el rol del usuario:", error);
        setUserRole("user"); // En caso de error, asumir usuario normal
      }
    } else {
      setCurrentUser(null);
      setUserLoggedIn(false);
      setUserRole(null);
    }
    setLoading(false);
  }

  const value: AuthContextType = {
    currentUser,
    userLoggedIn,
    loading,
    userRole,
    isAdmin: userRole === "admin", // 👈 Helper para verificar fácilmente si es admin
  };

  // ✅ Renderizamos children siempre, el loading se maneja en PrivateRoute
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
