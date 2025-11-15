import { IonBackButton, IonButtons, IonHeader, IonSearchbar, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import Notifications from "../atoms/Notifications";
import { arrowBack } from "ionicons/icons";

import "./Header.scss";
import LogoutButton from "../atoms/LogOutButton";

interface HeaderProps {
  page: string | undefined;
  color: string;
  searchBar?: boolean;
  smallTitle?: boolean;
  arrowBackIcon?: boolean;
  bellIcon?: boolean;
  logoutButton?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  page,
  color,
  searchBar = false,
  arrowBackIcon = false,
  smallTitle = false,
  bellIcon = false,
  logoutButton = true,
}) => {
  return (
    <IonHeader>
      <IonToolbar color={color} className="articulos-toolbar">
        {/* Flecha de regreso */}
        {arrowBackIcon && (
          <IonButtons slot="start">
            <IonBackButton defaultHref="/tabs/Articulos" color="light" icon={arrowBack} text="" />
          </IonButtons>
        )}

        {/* Título */}
        <IonTitle color="light" className={`title-style ${smallTitle ? "small" : ""}`}>
          {page}
        </IonTitle>

        {/* Campana de notificaciones y botón de logout alineados al final */}
        <IonButtons slot="end">
          {bellIcon && <Notifications />}
          {logoutButton && <LogoutButton />}
        </IonButtons>
      </IonToolbar>

      {/* {searchBar && (
        <IonToolbar color={color} className="articulos-searchbar-toolbar">
          {searchBar && <IonSearchbar animated={true} color="light" placeholder="Buscar" />}
        </IonToolbar>
      )} */}
    </IonHeader>
  );
};
