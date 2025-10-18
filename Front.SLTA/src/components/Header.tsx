import { IonBackButton, IonButtons, IonHeader, IonSearchbar, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import Notifications from "../atoms/Notifications";
import { arrowBack } from "ionicons/icons";

import "./Header.scss";

interface HeaderProps {
  page: string;
  color: string;
  searchBar?: boolean;
  smallTitle?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ page, color, searchBar = false, smallTitle = false }) => {
  return (
    <IonHeader>
      <IonToolbar color={color} className="articulos-toolbar">
        <div style={{ paddingLeft: "1rem" }}>
          <IonButtons slot="start">
            <IonBackButton defaultHref="/home" color="light" icon={arrowBack} text="" />
          </IonButtons>
        </div>
        <IonTitle color="light" className={`title-style ${smallTitle ? "small" : ""}`}>
          {page}
        </IonTitle>
        <Notifications />
      </IonToolbar>
      {searchBar && (
        <IonToolbar color={color} className="articulos-searchbar-toolbar">
          {searchBar && <IonSearchbar animated={true} color="light" placeholder="Buscar" />}
        </IonToolbar>
      )}
    </IonHeader>
  );
};
