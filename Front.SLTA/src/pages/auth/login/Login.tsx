import React, { useState, useEffect } from "react";
import { IonPage, IonContent, IonInput, IonButton } from "@ionic/react";
import { useIonRouter } from "@ionic/react";
import { useLocation } from "react-router-dom";
import { Header } from "../../../components/Header";
import { doSignInWithEmailAndPassword } from "../../../firebase/auth";
import { useAuth } from "../../../context/authContext";

const Login: React.FC = () => {
  const { userLoggedIn } = useAuth();
  const router = useIonRouter();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // Redirigir si ya está logueado - SOLO si estamos en la página de login
  useEffect(() => {
    if (userLoggedIn && location.pathname === "/login") {
      router.push("/articulos", "forward");
    }
  }, [userLoggedIn, router, location.pathname]);

  // 🔹 Manejar inicio de sesión con correo y contraseña
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSigningIn) return;

    setIsSigningIn(true);
    try {
      await doSignInWithEmailAndPassword(email, password);
      router.push("/articulos", "forward");
    } catch (error: unknown) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("Error desconocido al iniciar sesión");
      }
      setIsSigningIn(false);
    }
  };

  // 🔹 Ir al registro
  const goToRegister = () => {
    router.push("/register", "forward");
  };

  return (
    <IonPage>
      <Header page="Iniciar Sesión" color="secondary" logoutButton={false} />
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

        <form onSubmit={onSubmit}>
          <IonInput
            placeholder="Correo electrónico"
            value={email}
            onIonChange={(e) => setEmail(e.detail.value ?? "")}
          />
          <IonInput
            placeholder="Contraseña"
            type="password"
            value={password}
            onIonChange={(e) => setPassword(e.detail.value ?? "")}
          />

          <IonButton
            expand="block"
            color="tertiary"
            type="submit"
            disabled={isSigningIn}
          >
            Entrar
          </IonButton>

          <IonButton
            expand="block"
            color="tertiary"
            fill="clear"
            onClick={goToRegister}
          >
            Crear cuenta nueva
          </IonButton>

          {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
        </form>
      </IonContent>
    </IonPage>
  );
};

export default Login;
