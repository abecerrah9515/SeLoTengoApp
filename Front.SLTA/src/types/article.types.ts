import { Timestamp } from "firebase/firestore";

/**
 * Interfaz completa de un artículo/publicación
 */
export interface Article {
  id: string;
  title: string;
  description: string;
  price: string;
  image: string;
  type: "articulo" | "servicio" | "solicitud";

  // Datos del autor
  userId: string;
  userName: string;
  profileImage: string;

  // Estado de la publicación
  isActive: boolean; // Estado (activa/desactivada por admin)
  disabledBy?: string; // UID del admin que desactivó
  disabledAt?: Timestamp; // Fecha de desactivación
  disabledReason?: string; // Razón de desactivación

  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Interfaz para crear un nuevo artículo
 */
export interface CreateArticle {
  title: string;
  description: string;
  price: string;
  image: string;
  type: "articulo" | "servicio" | "solicitud";
  userId: string;
  userName: string;
  profileImage: string;
}
