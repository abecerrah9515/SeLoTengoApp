import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  orderBy,
  doc,
  updateDoc,
  serverTimestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";
import { Comment, CreateComment, DeleteComment } from "../types/comment.types";

/**
 * Crea un nuevo comentario en un artículo
 */
export const createComment = async (commentData: CreateComment): Promise<void> => {
  try {
    const commentsRef = collection(db, "comments");

    await addDoc(commentsRef, {
      ...commentData,
      isDeleted: false,
      createdAt: serverTimestamp(),
    });

    console.log("Comentario creado exitosamente");
  } catch (error) {
    console.error("Error al crear comentario:", error);
    throw error;
  }
};

/**
 * Obtiene todos los comentarios de un artículo (solo los no eliminados)
 */
export const getArticleComments = async (articleId: string): Promise<Comment[]> => {
  try {
    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("articleId", "==", articleId),
      where("isDeleted", "==", false),
      orderBy("createdAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    const comments: Comment[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Comment[];

    return comments;
  } catch (error) {
    console.error("Error al obtener comentarios:", error);
    return [];
  }
};

/**
 * Elimina un comentario (soft delete)
 */
export const deleteComment = async (deleteData: DeleteComment): Promise<void> => {
  try {
    const commentRef = doc(db, "comments", deleteData.commentId);

    await updateDoc(commentRef, {
      isDeleted: true,
      deletedBy: deleteData.deletedBy,
      deletedAt: serverTimestamp(),
      deletionReason: deleteData.deletionReason,
      updatedAt: serverTimestamp(),
    });

    console.log("Comentario eliminado exitosamente");
  } catch (error) {
    console.error("Error al eliminar comentario:", error);
    throw error;
  }
};

/**
 * Obtiene comentarios eliminados de un artículo (solo admin)
 */
export const getDeletedComments = async (articleId: string): Promise<Comment[]> => {
  try {
    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("articleId", "==", articleId),
      where("isDeleted", "==", true),
      orderBy("deletedAt", "desc")
    );

    const querySnapshot = await getDocs(q);

    const comments: Comment[] = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Comment[];

    return comments;
  } catch (error) {
    console.error("Error al obtener comentarios eliminados:", error);
    return [];
  }
};

/**
 * Restaura un comentario eliminado (solo admin)
 */
export const restoreComment = async (commentId: string): Promise<void> => {
  try {
    const commentRef = doc(db, "comments", commentId);

    await updateDoc(commentRef, {
      isDeleted: false,
      deletedBy: null,
      deletedAt: null,
      deletionReason: null,
      updatedAt: serverTimestamp(),
    });

    console.log("Comentario restaurado exitosamente");
  } catch (error) {
    console.error("Error al restaurar comentario:", error);
    throw error;
  }
};

/**
 * Elimina permanentemente un comentario (solo admin)
 */
export const permanentlyDeleteComment = async (commentId: string): Promise<void> => {
  try {
    const commentRef = doc(db, "comments", commentId);
    await deleteDoc(commentRef);

    console.log("Comentario eliminado permanentemente");
  } catch (error) {
    console.error("Error al eliminar comentario permanentemente:", error);
    throw error;
  }
};

/**
 * Cuenta el número de comentarios de un artículo
 */
export const getCommentsCount = async (articleId: string): Promise<number> => {
  try {
    const commentsRef = collection(db, "comments");
    const q = query(
      commentsRef,
      where("articleId", "==", articleId),
      where("isDeleted", "==", false)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.size;
  } catch (error) {
    console.error("Error al contar comentarios:", error);
    return 0;
  }
};
