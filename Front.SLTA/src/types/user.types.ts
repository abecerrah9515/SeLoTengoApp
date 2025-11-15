import { Timestamp } from "firebase/firestore";

/**
 * Interfaz completa del perfil de usuario almacenado en Firestore
 */
export interface UserProfile {
  uid: string;
  email: string;
  role: "user" | "admin";
  displayName: string;
  photoURL: string;
  career?: string;
  userType?: string;
  bio?: string;
  phone?: string;
  rating?: number;
  isActive: boolean; // Estado del usuario (activo/desactivado por admin)
  deactivatedBy?: string; // UID del admin que desactivó
  deactivatedAt?: Timestamp; // Fecha de desactivación
  deactivationReason?: string; // Razón de desactivación
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

/**
 * Interfaz para crear un nuevo perfil de usuario
 */
export interface CreateUserProfile {
  uid: string;
  email: string;
  role: "user" | "admin";
  displayName: string;
  photoURL?: string;
  career?: string;
  userType?: string;
  bio?: string;
  phone?: string;
}

/**
 * Interfaz para actualizar un perfil de usuario existente
 */
export interface UpdateUserProfile {
  displayName?: string;
  photoURL?: string;
  career?: string;
  userType?: string;
  bio?: string;
  phone?: string;
}

/**
 * Interfaz para los datos de usuario en artículos (desnormalizado)
 */
export interface ArticleAuthor {
  userId: string;
  userName: string;
  profileImage: string;
}
