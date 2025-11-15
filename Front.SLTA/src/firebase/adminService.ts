import {
  doc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
  getDoc,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * Desactiva un usuario (solo admin)
 */
export const deactivateUser = async (
  userId: string,
  adminId: string,
  reason: string
): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      isActive: false,
      deactivatedBy: adminId,
      deactivatedAt: serverTimestamp(),
      deactivationReason: reason,
      updatedAt: serverTimestamp(),
    });

    console.log(`Usuario ${userId} desactivado exitosamente`);
  } catch (error) {
    console.error("Error al desactivar usuario:", error);
    throw error;
  }
};

/**
 * Reactiva un usuario (solo admin)
 */
export const reactivateUser = async (userId: string): Promise<void> => {
  try {
    const userRef = doc(db, "users", userId);

    await updateDoc(userRef, {
      isActive: true,
      deactivatedBy: null,
      deactivatedAt: null,
      deactivationReason: null,
      updatedAt: serverTimestamp(),
    });

    console.log(`Usuario ${userId} reactivado exitosamente`);
  } catch (error) {
    console.error("Error al reactivar usuario:", error);
    throw error;
  }
};

/**
 * Deshabilita una publicación (solo admin)
 */
export const disableArticle = async (
  articleId: string,
  adminId: string,
  reason: string
): Promise<void> => {
  try {
    const articleRef = doc(db, "articles", articleId);

    await updateDoc(articleRef, {
      isActive: false,
      disabledBy: adminId,
      disabledAt: serverTimestamp(),
      disabledReason: reason,
      updatedAt: serverTimestamp(),
    });

    console.log(`Artículo ${articleId} deshabilitado exitosamente`);
  } catch (error) {
    console.error("Error al deshabilitar artículo:", error);
    throw error;
  }
};

/**
 * Rehabilita una publicación (solo admin)
 */
export const enableArticle = async (articleId: string): Promise<void> => {
  try {
    const articleRef = doc(db, "articles", articleId);

    await updateDoc(articleRef, {
      isActive: true,
      disabledBy: null,
      disabledAt: null,
      disabledReason: null,
      updatedAt: serverTimestamp(),
    });

    console.log(`Artículo ${articleId} habilitado exitosamente`);
  } catch (error) {
    console.error("Error al habilitar artículo:", error);
    throw error;
  }
};

/**
 * Obtiene todos los usuarios (solo admin)
 */
export const getAllUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const querySnapshot = await getDocs(usersRef);

    const users = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      uid: doc.id,
    }));

    return users;
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    return [];
  }
};

/**
 * Obtiene todas las publicaciones (solo admin)
 */
export const getAllArticles = async () => {
  try {
    const articlesRef = collection(db, "articles");
    const querySnapshot = await getDocs(articlesRef);

    const articles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return articles;
  } catch (error) {
    console.error("Error al obtener artículos:", error);
    return [];
  }
};

/**
 * Obtiene usuarios desactivados (solo admin)
 */
export const getDeactivatedUsers = async () => {
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("isActive", "==", false));
    const querySnapshot = await getDocs(q);

    const users = querySnapshot.docs.map((doc) => ({
      ...doc.data(),
      uid: doc.id,
    }));

    return users;
  } catch (error) {
    console.error("Error al obtener usuarios desactivados:", error);
    return [];
  }
};

/**
 * Obtiene publicaciones deshabilitadas (solo admin)
 */
export const getDisabledArticles = async () => {
  try {
    const articlesRef = collection(db, "articles");
    const q = query(articlesRef, where("isActive", "==", false));
    const querySnapshot = await getDocs(q);

    const articles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return articles;
  } catch (error) {
    console.error("Error al obtener artículos deshabilitados:", error);
    return [];
  }
};
