import { useState, useEffect } from "react";
import {
  IonAvatar,
  IonContent,
  IonIcon,
  IonImg,
  IonPage,
  IonSpinner,
  IonText,
  IonButton,
} from "@ionic/react";
import "./Perfil.scss";
import { Header } from "../components/Header";
import RatingStars from "../atoms/Rating Stars";
import { createOutline, shieldCheckmarkOutline } from "ionicons/icons";
import PublicationCard from "../atoms/PublicationCard";
import TabBar from "../components/TabBar";
import { useAuth } from "../context/authContext";
import { getUserProfile, getUserArticles } from "../firebase/userService";
import { UserProfile } from "../types/user.types";
import { useHistory } from "react-router-dom";

const Perfil: React.FC = () => {
  const { currentUser, isAdmin } = useAuth();
  const history = useHistory();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      loadUserData();
    }
  }, [currentUser?.uid]); // Depender solo del UID para evitar renders innecesarios

  const loadUserData = async () => {
    if (!currentUser) return;

    setLoading(true);
    try {
      // Cargar perfil del usuario
      const userProfile = await getUserProfile(currentUser.uid);
      setProfile(userProfile);

      // Cargar artículos del usuario
      const userArticles = await getUserArticles(currentUser.uid);
      setArticles(userArticles);
    } catch (error) {
      console.error("Error al cargar datos del usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEditProfile = () => {
    history.push("/editar-perfil");
  };

  if (loading) {
    return (
      <IonPage>
        <Header color={"secondary"} page={"Perfil"} bellIcon />
        <IonContent color="light" style={{ paddingBottom: "76px" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            <IonSpinner name="crescent" />
          </div>
        </IonContent>
        <TabBar />
      </IonPage>
    );
  }

  return (
    <IonPage>
      <Header color={"primary"} page={"Perfil"} bellIcon />
      <IonContent color="light" style={{ paddingBottom: "76px" }}>
        <div style={{ display: "flex", justifyContent: "center", marginTop: "2rem" }}>
          <div style={{ position: "relative", display: "inline-block" }}>
            {/* Imagen de perfil */}
            <IonAvatar style={{ width: "120px", height: "120px" }}>
              <IonImg
                src={
                  profile?.photoURL ||
                  "https://ionicframework.com/docs/img/demos/avatar.svg"
                }
                alt="Foto de perfil"
                style={{ objectFit: "cover" }}
              />
            </IonAvatar>

            {/* Botón de edición */}
            <IonIcon
              icon={createOutline}
              className="edit-icon"
              onClick={handleEditProfile}
              style={{ cursor: "pointer" }}
            />
          </div>
        </div>
        <div style={{ marginTop: "1rem" }}>
          <RatingStars rating={profile?.rating || 0} />
        </div>

        <div
          style={{
            textAlign: "center",
            marginTop: "1rem",
            color: "#333",
          }}
        >
          {/* Contenedor del nombre y el ícono */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <h2
              style={{
                margin: 0,
                fontSize: "32px",
                fontWeight: "500",
              }}
            >
              {profile?.displayName || "Usuario"}
            </h2>
          </div>

          {/* Profesión */}
          <p
            style={{
              margin: "4px 0 0 0",
              fontSize: "16px",
              color: "#666",
            }}
          >
            {profile?.career || "Sin carrera especificada"}
          </p>

          {/* Biografía */}
          {profile?.bio && (
            <p
              style={{
                margin: "8px 20px 0 20px",
                fontSize: "14px",
                color: "#888",
                fontStyle: "italic",
              }}
            >
              {profile.bio}
            </p>
          )}
        </div>

        {/* Botón de panel de administración (solo para admins) */}
        {isAdmin && (
          <div style={{ display: "flex", justifyContent: "center", marginTop: "1.5rem" }}>
            <IonButton
              color="warning"
              onClick={() => history.push("/admin")}
              style={{ width: "90%" }}
            >
              <IonIcon icon={shieldCheckmarkOutline} slot="start" />
              Panel de Administración
            </IonButton>
          </div>
        )}

        {/* Publicaciones del usuario */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div style={{ width: "90%" }}>
            <h3
              style={{
                marginTop: "2rem",
                marginBottom: "1rem",
                fontSize: "20px",
                fontWeight: "600",
                color: "#333",
              }}
            >
              Mis publicaciones
            </h3>

            {articles.length > 0 ? (
              articles.map((article) => (
                <PublicationCard
                  key={article.id}
                  title={article.title}
                  description={article.description}
                  price={`$${article.price}`}
                  image={article.image}
                  type="ofrecida"
                />
              ))
            ) : (
              <IonText color="medium">
                <p style={{ textAlign: "center", padding: "2rem" }}>
                  Aún no has publicado ningún artículo
                </p>
              </IonText>
            )}
          </div>
        </div>
      </IonContent>
      <TabBar />
    </IonPage>
  );
};

export default Perfil;
