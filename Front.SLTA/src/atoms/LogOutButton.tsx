import React from "react";
import { IonButton, IonIcon } from "@ionic/react";
import { doSignOut } from "../firebase/auth"; // ajusta el path según tu estructura
import { useHistory } from "react-router-dom";
import { logOutOutline } from "ionicons/icons";

const LogoutButton: React.FC = () => {
  const history = useHistory();

  const handleLogout = async () => {
    try {
      await doSignOut();
      history.push("/login"); // redirige al login después de cerrar sesión
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <IonButton color="danger" onClick={handleLogout} expand="block" shape="round">
      <IonIcon slot="icon-only" color="light" icon={logOutOutline} />{" "}
    </IonButton>
  );
};

export default LogoutButton;
