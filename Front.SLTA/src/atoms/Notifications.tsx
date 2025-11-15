import React, { useState } from "react";
import { IonButtons, IonButton, IonModal, IonHeader, IonToolbar, IonIcon, IonContent, IonTitle } from "@ionic/react";
import { notifications } from "ionicons/icons";
import NotificationCard from "./NotificationCard";
import WeatherCard from "./WeatherCard";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IonButtons slot="end">
        <IonButton onClick={() => setIsOpen(true)}>
          <IonIcon slot="icon-only" color="light" icon={notifications} />
        </IonButton>
      </IonButtons>
      <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)}>
        <IonHeader>
          <IonToolbar color="secondary">
            <IonTitle>Notificaciones</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsOpen(false)}>Cerrar</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" color="light">
          <WeatherCard />

          <h3 style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}>Actividad reciente</h3>
          <NotificationCard user="Diego" notification="Busco calculadora" hora="Hace 3 segundos" />
          <NotificationCard user="Maria" notification="vendió libro" hora="Hace 5 segundos" />
          <NotificationCard user="Carlos" notification="te envió mensaje" hora="Hace 10 segundos" />
        </IonContent>
      </IonModal>
    </>
  );
};

export default Header;
