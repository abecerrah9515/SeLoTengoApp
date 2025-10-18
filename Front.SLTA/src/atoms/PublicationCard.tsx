import React from "react";
import { IonCard, IonCardContent, IonImg } from "@ionic/react";
import "./PublicationCard.scss";

interface PublicationCardProps {
  title: string;
  description: string;
  price: string;
  image: string;
  type: "ofrecida" | "tomada"; // "ofrecida" = azul, "tomada" = amarilla
}

const PublicationCard: React.FC<PublicationCardProps> = ({ title, description, price, image, type }) => {
  return (
    <div className="publication-card-content">
      <div className={`card-header-title ${type}`}>
        <p className="card-title">
          {type === "ofrecida" ? "Publicaciones creadas activas" : "Publicaciones solicitadas activas"}
        </p>
      </div>
      <IonCard className={`publication-card ${type}`}>
        <IonCardContent className="card-content">
          <IonImg src={image} className="card-img" />
          <div className="card-text">
            <h2 className="card-title">{title}</h2>
            <p className="card-description">{description}</p>
            <h3 className="card-price">{price}</h3>
            <hr className="card-divider" />
          </div>
        </IonCardContent>
      </IonCard>
    </div>
  );
};

export default PublicationCard;
