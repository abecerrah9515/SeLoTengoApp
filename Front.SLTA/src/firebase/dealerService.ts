import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

/**
 * Obtiene los detalles de un dealer (usuario) por su ID
 * @param id ID del documento en Firestore
 */
export const getDealerById = async (id: string) => {
  try {
    const docRef = doc(db, "dealers", id);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      console.error("No existe el dealer con ese ID");
      return null;
    }
  } catch (error) {
    console.error("Error al obtener el dealer:", error);
    return null;
  }
};
