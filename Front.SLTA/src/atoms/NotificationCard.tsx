import { IonCard, IonCardContent, IonCardHeader, IonCardSubtitle, IonCardTitle, IonImg } from "@ionic/react";
import React from "react";

interface NotificationCardProps {
  user: string;
  notification: string;
  hora: string;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ user, notification, hora }) => {
  return (
    <IonCard color="light" style={{ display: "flex" }}>
      <IonImg
        src="https://picsum.photos/200"
        style={{ width: "5rem", marginLeft: "12px", marginRight: "12px", borderRadius: "50" }}
      />
      <div>
        <IonCardHeader>
          <IonCardTitle color="dark" style={{ fontSize: "24px", fontWeight: "400" }}>
            {user}
          </IonCardTitle>
          <IonCardSubtitle color="dark" style={{ fontSize: "16px", fontWeight: "400" }}>
            {notification}
          </IonCardSubtitle>
        </IonCardHeader>

        <IonCardContent color="dark" style={{ fontSize: "12px", fontWeight: "200" }}>
          {hora}
        </IonCardContent>
      </div>
    </IonCard>
  );
};

export default NotificationCard;
