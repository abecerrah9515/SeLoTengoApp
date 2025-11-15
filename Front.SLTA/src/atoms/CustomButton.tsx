import React from "react";
import { IonButton, IonIcon } from "@ionic/react";
import "./CustomButton.scss";

interface CustomButtonProps {
  onClick?: () => void;
  color?: string; // primary, secondary, danger, etc.
  expand?: "full" | "block";
  icon?: string; // opcional, un icono de ionicons
  action: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({ onClick, color = "tertiary", expand = "block", icon, action }) => {
  return (
    <div className="btn-container">
      <IonButton className="button-styles" color={color} expand={expand} onClick={onClick}>
        {icon && <IonIcon slot="start" icon={icon} />} {/* opcional */}
        {action}
      </IonButton>
    </div>
  );
};

export default CustomButton;
