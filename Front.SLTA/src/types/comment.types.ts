import { Timestamp } from "firebase/firestore";

/**
 * Interfaz completa de un comentario
 */
export interface Comment {
  id: string;
  articleId: string; // ID del artículo comentado
  userId: string; // ID del usuario que comentó
  userName: string; // Nombre del usuario
  userPhoto: string; // Foto del usuario
  content: string; // Contenido del comentario
  isDeleted: boolean; // Si fue eliminado (soft delete)
  deletedBy?: string; // UID del admin/usuario que eliminó
  deletedAt?: Timestamp; // Fecha de eliminación
  deletionReason?: string; // Razón de eliminación (ej: "Contenido ofensivo")
  createdAt: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Interfaz para crear un nuevo comentario
 */
export interface CreateComment {
  articleId: string;
  userId: string;
  userName: string;
  userPhoto: string;
  content: string;
}

/**
 * Interfaz para eliminar un comentario
 */
export interface DeleteComment {
  commentId: string;
  deletedBy: string;
  deletionReason: string;
}
