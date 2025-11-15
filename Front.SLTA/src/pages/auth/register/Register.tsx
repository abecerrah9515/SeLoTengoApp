import React, { useState } from "react";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../../../firebase/firebase";
import { createUserProfile } from "../../../firebase/userService";
import {
  IonPage,
  IonContent,
  IonInput,
  IonButton,
  IonText,
  IonHeader,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import { useIonRouter } from "@ionic/react";

const Register: React.FC = () => {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useIonRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación básica
    if (!displayName.trim()) {
      setErrorMessage("Por favor ingresa tu nombre completo");
      return;
    }

    if (!email.trim()) {
      setErrorMessage("Por favor ingresa tu correo electrónico");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    try {
      // 1️⃣ Crear usuario en Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // 2️⃣ Actualizar displayName en Firebase Auth
      await updateProfile(user, {
        displayName: displayName.trim(),
        photoURL: "",
      });

      // 3️⃣ Crear perfil completo en Firestore
      await createUserProfile({
        uid: user.uid,
        email: user.email || email,
        role: "user",
        displayName: displayName.trim(),
        photoURL: "",
      });

      // 4️⃣ Redirigir a la app
      router.push("/articulos", "forward");
    } catch (error: any) {
      console.error("Error al registrar usuario:", error);

      // Mensajes de error más específicos
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Este correo ya está registrado");
      } else if (error.code === "auth/invalid-email") {
        setErrorMessage("Correo electrónico inválido");
      } else if (error.code === "auth/weak-password") {
        setErrorMessage("La contraseña es muy débil");
      } else {
        setErrorMessage(
          "Error al registrar. Intenta con otro correo o verifica tu conexión."
        );
      }
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="secondary">
          <IonTitle>Crear cuenta</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent className="ion-padding">
        {/* Espacio para el logo */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            marginTop: "2rem",
            marginBottom: "2rem",
          }}
        >
          <div
            style={{
              width: "250px",
              height: "250px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              textAlign: "center",
              padding: "1px",
            }}
          >
            <img
              src="/logo/logo.png"
              alt="Logo"
              style={{ width: "250px", height: "250px", objectFit: "contain" }}
            />
          </div>
        </div>

        <form onSubmit={handleRegister}>
          <IonInput
            label="Nombre completo"
            type="text"
            value={displayName}
            onIonChange={(e) => setDisplayName(e.detail.value ?? "")}
            required
          />
          <IonInput
            label="Correo electrónico"
            type="email"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value ?? "")}
            required
          />
          <IonInput
            label="Contraseña"
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value ?? "")}
            required
          />

          <IonButton
            expand="block"
            color="tertiary"
            type="submit"
            className="ion-margin-top"
          >
            Registrarse
          </IonButton>

          <IonButton
            expand="block"
            color="tertiary"
            fill="clear"
            onClick={() => router.push("/login")}
            className="ion-margin-top"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </IonButton>

          {errorMessage && (
            <IonText color="danger" className="ion-text-center">
              <p>{errorMessage}</p>
            </IonText>
          )}
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Register;
