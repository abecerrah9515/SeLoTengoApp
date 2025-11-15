import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import { updateProfile } from "firebase/auth";
import { db, auth } from "./firebase";
import { UserProfile, CreateUserProfile, UpdateUserProfile } from "../types/user.types";

/**
 * Crea un nuevo perfil de usuario en Firestore
 */
export const createUserProfile = async (userData: CreateUserProfile): Promise<void> => {
  try {
    const userRef = doc(db, "users", userData.uid);

    await setDoc(userRef, {
      ...userData,
      photoURL: userData.photoURL || "",
      career: userData.career || "",
      userType: userData.userType || "",
      bio: userData.bio || "",
      phone: userData.phone || "",
      rating: 0,
      isActive: true, // Usuario activo por defecto
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log("Perfil de usuario creado exitosamente");
  } catch (error) {
    console.error("Error al crear perfil de usuario:", error);
    throw error;
  }
};

/**
 * Obtiene el perfil de un usuario por su UID
 */
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, "users", uid);
    const userSnap = await getDoc(userRef);

    if (userSnap.exists()) {
      return { ...userSnap.data(), uid: userSnap.id } as UserProfile;
    } else {
      console.error("No existe el usuario con ese UID");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener perfil de usuario:", error);
    return null;
  }
};

/**
 * Actualiza el perfil de un usuario en Firestore y Firebase Auth
 */
export const updateUserProfile = async (
  uid: string,
  updates: UpdateUserProfile
): Promise<void> => {
  try {
    const userRef = doc(db, "users", uid);

    // Actualizar en Firestore
    await updateDoc(userRef, {
      ...updates,
      updatedAt: serverTimestamp(),
    });

    // Actualizar displayName y photoURL en Firebase Auth si existen
    const currentUser = auth.currentUser;
    if (currentUser && currentUser.uid === uid) {
      const authUpdates: { displayName?: string; photoURL?: string } = {};

      if (updates.displayName !== undefined) {
        authUpdates.displayName = updates.displayName;
      }

      if (updates.photoURL !== undefined) {
        authUpdates.photoURL = updates.photoURL;
      }

      if (Object.keys(authUpdates).length > 0) {
        await updateProfile(currentUser, authUpdates);
      }
    }

    console.log("Perfil actualizado exitosamente");
  } catch (error) {
    console.error("Error al actualizar perfil de usuario:", error);
    throw error;
  }
};

/**
 * Obtiene todas las publicaciones de un usuario específico
 */
export const getUserArticles = async (userId: string) => {
  try {
    const articlesRef = collection(db, "articles");
    const q = query(articlesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const articles = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return articles;
  } catch (error) {
    console.error("Error al obtener artículos del usuario:", error);
    return [];
  }
};

/**
 * Actualiza el nombre y foto de perfil en todas las publicaciones del usuario
 * (Para mantener consistencia de datos desnormalizados)
 */
export const updateUserDataInArticles = async (
  userId: string,
  userName: string,
  profileImage: string
): Promise<void> => {
  try {
    const articlesRef = collection(db, "articles");
    const q = query(articlesRef, where("userId", "==", userId));
    const querySnapshot = await getDocs(q);

    const updatePromises = querySnapshot.docs.map(async (docSnapshot) => {
      const articleRef = doc(db, "articles", docSnapshot.id);
      await updateDoc(articleRef, {
        userName,
        profileImage,
      });
    });

    await Promise.all(updatePromises);
    console.log("Datos de usuario actualizados en todas las publicaciones");
  } catch (error) {
    console.error("Error al actualizar datos en publicaciones:", error);
    throw error;
  }
};

/**
 * Verifica si un usuario tiene un perfil completo
 */
export const hasCompleteProfile = async (uid: string): Promise<boolean> => {
  try {
    const profile = await getUserProfile(uid);

    if (!profile) return false;

    // Verificar que tenga al menos nombre y email
    return !!(profile.displayName && profile.email);
  } catch (error) {
    console.error("Error al verificar perfil completo:", error);
    return false;
  }
};
