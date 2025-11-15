import { IonPage, IonContent, IonImg, IonAvatar, IonSpinner } from "@ionic/react";
import { useParams } from "react-router-dom";
import { Header } from "../components/Header";
import "./Detalle.scss";
import { useEffect, useState } from "react";

import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const DetalleDealer: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [dealer, setDealer] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDealer = async () => {
      try {
        const docRef = doc(db, "dealers", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setDealer({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.error("No se encontró el usuario con ese ID");
        }
      } catch (error) {
        console.error("Error al obtener el usuario:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDealer();
  }, [id]);

  if (loading) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <IonSpinner name="crescent" />
          <p>Cargando usuario...</p>
        </IonContent>
      </IonPage>
    );
  }

  if (!dealer) {
    return (
      <IonPage>
        <IonContent className="ion-padding ion-text-center">
          <p>No se encontró el usuario.</p>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <Header page={dealer.userName || "Detalle"} color="tertiary" smallTitle arrowBackIcon />

      <IonContent className="detalle-content" color="light">
        {/* Imagen de perfil */}
        {dealer.image && (
          <IonAvatar className="detalle-avatar">
            <IonImg src={dealer.image} alt={dealer.userName} />
          </IonAvatar>
        )}

        {/* Nombre */}
        <h2 className="detalle-titulo" style={{ padding: "0 1rem" }}>
          {dealer.userName}
        </h2>

        {/* Carrera o profesión */}
        {dealer.carreer && (
          <p className="detalle-descripcion">
            <strong>Carrera:</strong> {dealer.carreer}
          </p>
        )}

        {/* Tipo de usuario */}
        {dealer.userType && (
          <p className="detalle-descripcion">
            <strong>Tipo de usuario:</strong> {dealer.userType}
          </p>
        )}

        {/* Información de contacto */}
        {dealer.contact && (
          <p className="detalle-descripcion">
            <strong>Contacto:</strong> {dealer.contact}
          </p>
        )}
      </IonContent>
    </IonPage>
  );
};

export default DetalleDealer;
