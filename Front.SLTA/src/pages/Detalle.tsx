import { IonPage, IonContent, IonImg, IonAvatar, IonSpinner, IonButton, useIonRouter } from "@ionic/react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import "./Detalle.scss";
import PayPalButton from "../atoms/PaypalButtonComponent";
import { useEffect, useState } from "react";
import { useAuth } from "../context/authContext"; // 👈 Importar el hook de autenticación
import Comments from "../components/Comments";

import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const DetalleArticulo: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [articulo, setArticulo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useIonRouter(); // 👈 se usa para redirigir en Ionic
  const { isAdmin } = useAuth(); // 👈 Obtener si el usuario es admin

  // --- Cargar artículo ---
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const docRef = doc(db, "articles", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setArticulo({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No se encontró el artículo con ese ID");
        }
      } catch (error) {
        console.error("Error al obtener el artículo:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id]);

  // --- Eliminar artículo ---
  const handleDelete = async () => {
    const confirmDelete = window.confirm("¿Seguro que quieres eliminar este artículo?");
    if (!confirmDelete || !articulo?.id) return;

    try {
      await deleteDoc(doc(db, "articles", articulo.id));
      alert("Artículo eliminado con éxito");
      router.push("/articulos", "forward", "replace"); //redirige directamente a la lista
    } catch (error) {
      console.error("Error al eliminar el artículo:", error);
      alert("Error al eliminar el artículo");
    }
  };

  // --- Cargando ---
  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <IonSpinner name="crescent" />
          <p>Cargando artículo...</p>
        </IonContent>
      </IonPage>
    );
  }

  // --- No encontrado ---
  if (!articulo) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <p>No se encontró el artículo.</p>
        </IonContent>
      </IonPage>
    );
  }

  // --- Vista de detalle ---
  return (
    <IonPage>
      <Header page={articulo.userName || "Detalle"} color="tertiary" smallTitle arrowBackIcon />

      <IonContent className="detalle-content" color="light">
        {articulo.profileImage && (
          <IonAvatar className="detalle-avatar">
            <IonImg src={articulo.profileImage} alt={articulo.userName} />
          </IonAvatar>
        )}

        <h2 className="detalle-titulo" style={{ padding: "0 1rem" }}>
          {articulo.title}
        </h2>

        {articulo.image && <IonImg className="detalle-imagen" src={articulo.image} alt={articulo.title} />}

        {articulo.price && <p className="detalle-precio">${articulo.price}</p>}

        <p className="detalle-descripcion">{articulo.description}</p>

        {/* Sección de comentarios */}
        <Comments articleId={id} />

        {articulo.price && <PayPalButton />}

        {/* 👇 Solo mostrar el botón de eliminar si el usuario es administrador */}
        {isAdmin && (
          <IonButton
            color="danger"
            expand="block"
            style={{
              width: "60%",
              margin: "0 auto 2rem auto",
              color: "white",
            }}
            onClick={handleDelete}
          >
            Eliminar artículo
          </IonButton>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DetalleArticulo;
