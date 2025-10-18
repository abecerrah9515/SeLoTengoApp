import React from "react";
import { IonButton } from "@ionic/react";
import "./CustomButton.scss";

interface CustomButtonProps {
  onClick?: () => void;
  color?: string; // primary, secondary, danger, etc.
  expand?: "full" | "block";
  icon?: string; // opcional, un icono de ionicons
  action: string;
}

const CustomButton = ({ action }: CustomButtonProps) => {
  return (
    <div className="btn-container">
      <IonButton className="button-styles">{action}</IonButton>
    </div>
  );
};

export default CustomButton;
