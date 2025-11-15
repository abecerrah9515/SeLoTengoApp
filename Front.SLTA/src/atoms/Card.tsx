import { IonAvatar, IonCard, IonCardContent, IonIcon, IonImg } from "@ionic/react";
import "./Card.scss";
import { heart, heartOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useFavorites } from "../context/SavedContext";
import { useHistory } from "react-router-dom";

export interface CardProps {
  id: string;
  image?: string;
  profileImage?: string;
  title?: string;
  description?: string;
  price?: string;
  variant?: string;
  userName?: string;
  major?: string;
  postType?: "product" | "service" | "request";
  contact?: string;
  carreer?: string;
  userType?: string;
  active?: boolean;
}

const Card: React.FC<CardProps> = ({
  id,
  image,
  title,
  userName,
  profileImage,
  description,
  price,
  variant,
  active,
  contact,
  carreer,
  userType,
}) => {
  const { addFavorite, removeFavorite, favorites } = useFavorites();
  const [activeHeart, setActiveHeart] = useState(active || favorites.includes(id));
  const history = useHistory();

  useEffect(() => {
    setActiveHeart(favorites.includes(id));
  }, [favorites]);

  // Navegación según tipo de card
  const navigateToDetails = () => {
    if (variant === "contact") {
      history.push(`/dealer/${id}`);
    } else {
      history.push(`/articulo/${id}`);
    }
  };

  const onClick = () => {
    if (!activeHeart) addFavorite(id);
    else removeFavorite(id);
    setActiveHeart(!activeHeart);
  };

  return (
    <IonCard className={`card-custom ${variant}`} onClick={navigateToDetails}>
      <IonCardContent className="card-content">
        {/* Imagen */}
        <IonAvatar className="card-image">
          <IonImg
            src={
              image ? image : profileImage ? profileImage : "https://ionicframework.com/docs/img/demos/avatar.svg" // fallback
            }
            alt={title || userName}
            className={`card-image ${variant}`}
          />
        </IonAvatar>

        <div className="card-info">
          {/* Título o nombre */}
          <h2 className={`card-name ${variant}`}>{title || userName}</h2>
          <i className={`${variant}`}>{variant}</i>
          {/* Descripción o carrera */}
          <p className={`card-description ${variant}`}>
            {variant === "article" ? description : carreer || description}
          </p>

          {/* Precio o contacto */}
          <div className="price-container">
            {variant === "article" ? (
              <p className={`card-price ${variant}`}>{price}</p>
            ) : (
              <p className={`card-price ${variant}`}>{contact || userType}</p>
            )}

            {/* Solo los artículos tienen corazón */}
            {variant === "article" && (
              <IonIcon
                icon={activeHeart ? heart : heartOutline}
                aria-hidden="true"
                style={{ fontSize: "28px", color: "#e0355aff" }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClick();
                }}
              />
            )}
          </div>
        </div>
      </IonCardContent>
    </IonCard>
  );
};

export default Card;
