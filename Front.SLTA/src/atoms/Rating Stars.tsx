import React from "react";
import { IonIcon } from "@ionic/react";
import { star, starHalf, starOutline } from "ionicons/icons";

interface RatingStarsProps {
  rating: number; // Promedio del usuario, ejemplo: 4.3
  size?: string; // Tamaño opcional, ejemplo: '24px', '32px'
  color?: string; // Color opcional, ejemplo: '#FF8C00'
}

const RatingStars: React.FC<RatingStarsProps> = ({ rating, size = "28px", color = "#FF8C00" }) => {
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: "5px" }}>
      {[1, 2, 3, 4, 5].map((num) => {
        if (rating >= num) {
          return <IonIcon key={num} icon={star} style={{ color, fontSize: size }} />;
        } else if (rating >= num - 0.5) {
          return <IonIcon key={num} icon={starHalf} style={{ color, fontSize: size }} />;
        } else {
          return <IonIcon key={num} icon={starOutline} style={{ color, fontSize: size }} />;
        }
      })}
    </div>
  );
};

export default RatingStars;
