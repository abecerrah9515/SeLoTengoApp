import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Obtiene los detalles de un artículo por su ID
 * @param id ID del documento en Firestore
 */
export const getArticleById = async (id: string) => {
  try {
    const docRef = doc(db, "articles", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.error("No existe el artículo con ese ID");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el artículo:", error);
    return null;
  }
};
