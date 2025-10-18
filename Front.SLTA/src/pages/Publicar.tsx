import {
  IonPage,
  IonButton,
  IonIcon,
  IonContent,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { calendarOutline, imageOutline } from "ionicons/icons";

import "./Publicar.scss";
import CustomButton from "../atoms/CustomButton";
import { Header } from "../components/Header";

const Publicar: React.FC = () => {
  return (
    <IonPage className="publicar-page">
      {/* Header */}
      <Header page={"Publicar"} color={"primary"} />

      {/* Contenido */}
      <IonContent className="ion-padding publicar-page" color="light">
        {/* Ruta */}
        <p className="ruta">Artículos &gt; Publicar</p>

        {/* Campo título */}
        <IonItem color="medium">
          <IonLabel position="stacked">Titulo</IonLabel>
          <IonTextarea placeholder="Nombra tu publicación"></IonTextarea>
        </IonItem>

        {/* Tipo de publicación */}

        <IonSelect className="custom-select" label="Tipo de publicación" labelPlacement="floating" fill="outline">
          <IonSelectOption value="apple">Artículo</IonSelectOption>
          <IonSelectOption value="banana">Servicio</IonSelectOption>
          <IonSelectOption value="orange">Solicitud</IonSelectOption>
        </IonSelect>

        {/* Descripción */}
        <IonItem color="medium">
          <IonLabel position="stacked">Descripción</IonLabel>
          <IonTextarea placeholder="Escribe una descripción"></IonTextarea>
          <IonButton slot="end" fill="clear">
            <IonIcon icon={calendarOutline} />
          </IonButton>
        </IonItem>

        {/* Imagen */}
        <div className="image-center">
          <div style={{ backgroundColor: "white" }} className="image-upload">
            <IonIcon icon={imageOutline} className="image-upload-icon" />
          </div>
        </div>

        {/* Precio */}
        <IonItem color="medium" className="precio-content">
          <IonLabel position="stacked">Precio</IonLabel>
          <IonInput type="number" placeholder="Ej: 50.000"></IonInput>
        </IonItem>

        {/* Botón publicar */}
        <CustomButton action="Publicar" />
      </IonContent>
    </IonPage>
  );
};

export default Publicar;
