import { IonIcon, IonLabel } from "@ionic/react";
import { addCircleOutline, heartOutline, homeOutline, peopleOutline, personOutline } from "ionicons/icons";
import { useHistory, useLocation } from "react-router-dom";
import "./TabBar.scss";

const TabBar: React.FC = () => {
  const history = useHistory();
  const location = useLocation();

  const navigate = (path: string) => {
    history.push(path);
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="custom-tab-bar">
      <div
        className={`tab-item ${isActive("/articulos") ? "active" : ""}`}
        onClick={() => navigate("/articulos")}
      >
        <IonIcon icon={homeOutline} />
        <IonLabel>Artículos</IonLabel>
      </div>

      <div
        className={`tab-item ${isActive("/dealers") ? "active" : ""}`}
        onClick={() => navigate("/dealers")}
      >
        <IonIcon icon={peopleOutline} />
        <IonLabel>Dealers</IonLabel>
      </div>

      <div
        className={`tab-item ${isActive("/publicar") ? "active" : ""}`}
        onClick={() => navigate("/publicar")}
      >
        <IonIcon icon={addCircleOutline} />
        <IonLabel>Publicar</IonLabel>
      </div>

      <div
        className={`tab-item ${isActive("/guardado") ? "active" : ""}`}
        onClick={() => navigate("/guardado")}
      >
        <IonIcon icon={heartOutline} />
        <IonLabel>Guardado</IonLabel>
      </div>

      <div
        className={`tab-item ${isActive("/perfil") ? "active" : ""}`}
        onClick={() => navigate("/perfil")}
      >
        <IonIcon icon={personOutline} />
        <IonLabel>Perfil</IonLabel>
      </div>
    </div>
  );
};

export default TabBar;
