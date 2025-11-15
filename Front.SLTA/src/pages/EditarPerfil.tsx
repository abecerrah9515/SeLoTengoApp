import React, { useState, useEffect } from "react";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonInput,
  IonTextarea,
  IonItem,
  IonLabel,
  IonButton,
  IonAvatar,
  IonImg,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonLoading,
  IonToast,
} from "@ionic/react";
import { cameraOutline } from "ionicons/icons";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import { useAuth } from "../context/authContext";
import { getUserProfile, updateUserProfile, updateUserDataInArticles } from "../firebase/userService";
import { UserProfile } from "../types/user.types";
import { useHistory } from "react-router-dom";

import "./EditarPerfil.scss";

const EditarPerfil: React.FC = () => {
  const { currentUser } = useAuth();
  const history = useHistory();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [displayName, setDisplayName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [career, setCareer] = useState("");
  const [userType, setUserType] = useState("");
  const [bio, setBio] = useState("");
  const [phone, setPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastColor, setToastColor] = useState<"success" | "danger">("success");

  useEffect(() => {
    if (currentUser) {
      loadUserProfile();
    }
  }, [currentUser?.uid]); // Depender solo del UID para evitar renders innecesarios

  const loadUserProfile = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      const userProfile = await getUserProfile(currentUser.uid);

      if (userProfile) {
        setProfile(userProfile);
        setDisplayName(userProfile.displayName || "");
        setPhotoURL(userProfile.photoURL || "");
        setCareer(userProfile.career || "");
        setUserType(userProfile.userType || "");
        setBio(userProfile.bio || "");
        setPhone(userProfile.phone || "");
      }
    } catch (error) {
      console.error("Error al cargar perfil:", error);
      showMessage("Error al cargar el perfil", "danger");
    } finally {
      setLoading(false);
    }
  };

  const takePicture = async () => {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        allowEditing: true,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Prompt,
      });

      if (photo.dataUrl) {
        setPhotoURL(photo.dataUrl);
      }
    } catch (error) {
      console.error("Error al tomar foto:", error);
    }
  };

  const handleSave = async () => {
    if (!currentUser) return;

    if (!displayName.trim()) {
      showMessage("El nombre es requerido", "danger");
      return;
    }

    setLoading(true);
    try {
      const updates = {
        displayName: displayName.trim(),
        photoURL,
        career,
        userType,
        bio,
        phone,
      };

      // Actualizar perfil en Firestore y Firebase Auth
      await updateUserProfile(currentUser.uid, updates);

      // Actualizar datos en todas las publicaciones del usuario
      await updateUserDataInArticles(currentUser.uid, displayName.trim(), photoURL);

      showMessage("Perfil actualizado exitosamente", "success");

      // Redirigir al perfil después de 1.5 segundos
      setTimeout(() => {
        history.goBack();
      }, 1500);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      showMessage("Error al actualizar el perfil", "danger");
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (message: string, color: "success" | "danger") => {
    setToastMessage(message);
    setToastColor(color);
    setShowToast(true);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonButtons slot="start">
            <IonBackButton defaultHref="/perfil" />
          </IonButtons>
          <IonTitle>Editar Perfil</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding editar-perfil-page" color="light">
        <IonLoading isOpen={loading} message="Cargando..." />

        {/* Foto de perfil */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            <IonAvatar style={{ width: "120px", height: "120px" }}>
              <IonImg
                src={photoURL || "https://ionicframework.com/docs/img/demos/avatar.svg"}
                alt="Foto de perfil"
                style={{ objectFit: "cover" }}
              />
            </IonAvatar>

            {/* Botón para cambiar foto */}
            <div
              onClick={takePicture}
              style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                backgroundColor: "#FE8826",
                borderRadius: "50%",
                width: "36px",
                height: "36px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
              }}
            >
              <IonIcon icon={cameraOutline} style={{ color: "white", fontSize: "20px" }} />
            </div>
          </div>
        </div>

        {/* Formulario */}
        <div style={{ marginTop: "2rem" }}>
          <IonItem color="medium">
            <IonLabel position="stacked">Nombre completo *</IonLabel>
            <IonInput
              value={displayName}
              onIonChange={(e) => setDisplayName(e.detail.value ?? "")}
              placeholder="Tu nombre"
            />
          </IonItem>

          <IonItem color="medium">
            <IonLabel position="stacked">Carrera / Profesión</IonLabel>
            <IonInput
              value={career}
              onIonChange={(e) => setCareer(e.detail.value ?? "")}
              placeholder="Ej: Ingeniería Industrial"
            />
          </IonItem>

          <IonItem color="medium">
            <IonLabel position="stacked">Tipo de usuario</IonLabel>
            <IonInput
              value={userType}
              onIonChange={(e) => setUserType(e.detail.value ?? "")}
              placeholder="Ej: Estudiante, Profesor, etc."
            />
          </IonItem>

          <IonItem color="medium">
            <IonLabel position="stacked">Biografía</IonLabel>
            <IonTextarea
              value={bio}
              onIonChange={(e) => setBio(e.detail.value ?? "")}
              placeholder="Cuéntanos sobre ti..."
              rows={3}
            />
          </IonItem>

          <IonItem color="medium">
            <IonLabel position="stacked">Teléfono</IonLabel>
            <IonInput
              value={phone}
              onIonChange={(e) => setPhone(e.detail.value ?? "")}
              placeholder="Ej: +57 300 123 4567"
              type="tel"
            />
          </IonItem>

          <IonItem color="medium" lines="none">
            <IonLabel position="stacked">Correo electrónico</IonLabel>
            <IonInput value={profile?.email || ""} disabled />
          </IonItem>
        </div>

        {/* Botón Guardar */}
        <IonButton
          expand="block"
          color="tertiary"
          onClick={handleSave}
          style={{ marginTop: "2rem" }}
          disabled={loading}
        >
          Guardar cambios
        </IonButton>

        {/* Toast para mensajes */}
        <IonToast
          isOpen={showToast}
          onDidDismiss={() => setShowToast(false)}
          message={toastMessage}
          duration={2000}
          color={toastColor}
        />
      </IonContent>
    </IonPage>
  );
};

export default EditarPerfil;
