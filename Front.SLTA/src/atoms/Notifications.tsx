import React, { useState } from "react";
import { IonButtons, IonButton, IonModal, IonHeader, IonToolbar, IonIcon, IonContent } from "@ionic/react";
import { notifications } from "ionicons/icons";
import NotificationCard from "./NotificationCard";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <IonButtons slot="end">
        <IonButton onClick={() => setIsOpen(true)}>
          <IonIcon slot="icon-only" color="light" icon={notifications} />
        </IonButton>
      </IonButtons>
      <IonModal isOpen={isOpen} onDidDismiss={() => setIsOpen(false)} onClick={() => setIsOpen(!isOpen)}>
        <IonHeader>
          <IonToolbar>
            <IonButtons slot="end">
              <IonButton onClick={() => setIsOpen(!isOpen)}>Close</IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="ion-padding" color="primary">
          <NotificationCard user="Diego" notification="compro bisio" hora="Hace 3 segundos" />
          <NotificationCard user="Maria" notification="vendió perico" hora="Hace 5 segundos" />
          <NotificationCard user="Carlos" notification="te envió mensaje" hora="Hace 10 segundos" />
        </IonContent>
      </IonModal>
    </>
  );
};

export default Header;
