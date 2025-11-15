import React, { useEffect, useState } from "react";
import {
  IonPage,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonButton,
  IonList,
  IonItem,
  IonLabel,
  IonBadge,
  IonSpinner,
  IonSegment,
  IonSegmentButton,
  IonAlert,
  IonIcon,
  IonAvatar,
} from "@ionic/react";
import { checkmarkCircle, closeCircle, personOutline, documentTextOutline } from "ionicons/icons";
import { Header } from "../components/Header";
import TabBar from "../components/TabBar";
import { useAuth } from "../context/authContext";
import { useHistory } from "react-router-dom";
import {
  getAllUsers,
  getAllArticles,
  deactivateUser,
  reactivateUser,
  disableArticle,
  enableArticle,
} from "../firebase/adminService";
import "./Admin.scss";

const Admin: React.FC = () => {
  const { isAdmin, currentUser } = useAuth();
  const history = useHistory();

  const [segment, setSegment] = useState<"users" | "articles">("users");
  const [users, setUsers] = useState<any[]>([]);
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [showReasonAlert, setShowReasonAlert] = useState(false);
  const [actionType, setActionType] = useState<"deactivateUser" | "disableArticle" | null>(null);
  const [selectedId, setSelectedId] = useState<string>("");
  const [reason, setReason] = useState("");

  useEffect(() => {
    // Redirigir si no es admin
    if (!isAdmin) {
      history.push("/articulos");
      return;
    }

    loadData();
  }, [isAdmin]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedUsers, fetchedArticles] = await Promise.all([
        getAllUsers(),
        getAllArticles(),
      ]);

      setUsers(fetchedUsers);
      setArticles(fetchedArticles);
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeactivateUser = (userId: string) => {
    setActionType("deactivateUser");
    setSelectedId(userId);
    setShowReasonAlert(true);
  };

  const handleDisableArticle = (articleId: string) => {
    setActionType("disableArticle");
    setSelectedId(articleId);
    setShowReasonAlert(true);
  };

  const handleConfirmAction = async (providedReason: string) => {
    if (!currentUser || !selectedId) return;

    try {
      if (actionType === "deactivateUser") {
        await deactivateUser(selectedId, currentUser.uid, providedReason || "Sin razón especificada");
      } else if (actionType === "disableArticle") {
        await disableArticle(selectedId, currentUser.uid, providedReason || "Sin razón especificada");
      }

      await loadData(); // Recargar datos
      setReason("");
      setSelectedId("");
      setActionType(null);
    } catch (error) {
      console.error("Error al ejecutar acción:", error);
      alert("Error al ejecutar la acción");
    }
  };

  const handleReactivateUser = async (userId: string) => {
    try {
      await reactivateUser(userId);
      await loadData();
    } catch (error) {
      console.error("Error al reactivar usuario:", error);
      alert("Error al reactivar usuario");
    }
  };

  const handleEnableArticle = async (articleId: string) => {
    try {
      await enableArticle(articleId);
      await loadData();
    } catch (error) {
      console.error("Error al habilitar artículo:", error);
      alert("Error al habilitar artículo");
    }
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <IonPage>
      <Header page="Panel de Administración" color="secondary" logoutButton />
      <IonContent color="light" style={{ paddingBottom: "76px" }}>
        <div style={{ padding: "1rem" }}>
          {/* Segmentos para cambiar entre usuarios y publicaciones */}
          <IonSegment value={segment} onIonChange={(e) => setSegment(e.detail.value as any)}>
            <IonSegmentButton value="users">
              <IonIcon icon={personOutline} />
              <IonLabel>Usuarios</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="articles">
              <IonIcon icon={documentTextOutline} />
              <IonLabel>Publicaciones</IonLabel>
            </IonSegmentButton>
          </IonSegment>

          {loading ? (
            <div style={{ textAlign: "center", padding: "2rem" }}>
              <IonSpinner />
            </div>
          ) : (
            <>
              {/* Lista de Usuarios */}
              {segment === "users" && (
                <div style={{ marginTop: "1rem" }}>
                  <h3>Usuarios Registrados ({users.length})</h3>
                  {users.length > 0 ? (
                    <IonList>
                      {users.map((user) => (
                        <IonCard key={user.uid}>
                          <IonCardContent>
                            <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
                              <IonAvatar style={{ width: "50px", height: "50px" }}>
                                <img
                                  src={user.photoURL || "https://ionicframework.com/docs/img/demos/avatar.svg"}
                                  alt={user.displayName}
                                />
                              </IonAvatar>

                              <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: "600" }}>{user.displayName || "Sin nombre"}</p>
                                <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>{user.email}</p>
                                <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
                                  <IonBadge color={user.role === "admin" ? "warning" : "primary"}>
                                    {user.role === "admin" ? "Admin" : "Usuario"}
                                  </IonBadge>
                                  <IonBadge color={user.isActive ? "success" : "danger"}>
                                    {user.isActive ? "Activo" : "Desactivado"}
                                  </IonBadge>
                                </div>
                              </div>

                              {/* No permitir desactivar al usuario actual */}
                              {user.uid !== currentUser?.uid && (
                                <div>
                                  {user.isActive ? (
                                    <IonButton
                                      size="small"
                                      color="danger"
                                      fill="outline"
                                      onClick={() => handleDeactivateUser(user.uid)}
                                    >
                                      Desactivar
                                    </IonButton>
                                  ) : (
                                    <IonButton
                                      size="small"
                                      color="success"
                                      fill="outline"
                                      onClick={() => handleReactivateUser(user.uid)}
                                    >
                                      Reactivar
                                    </IonButton>
                                  )}
                                </div>
                              )}
                            </div>

                            {!user.isActive && user.deactivationReason && (
                              <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#999", fontStyle: "italic" }}>
                                Razón: {user.deactivationReason}
                              </p>
                            )}
                          </IonCardContent>
                        </IonCard>
                      ))}
                    </IonList>
                  ) : (
                    <p style={{ textAlign: "center", color: "#666" }}>No hay usuarios</p>
                  )}
                </div>
              )}

              {/* Lista de Publicaciones */}
              {segment === "articles" && (
                <div style={{ marginTop: "1rem" }}>
                  <h3>Publicaciones ({articles.length})</h3>
                  {articles.length > 0 ? (
                    <IonList>
                      {articles.map((article) => (
                        <IonCard key={article.id}>
                          <IonCardContent>
                            <div style={{ display: "flex", gap: "12px" }}>
                              <img
                                src={article.image || "https://via.placeholder.com/100"}
                                alt={article.title}
                                style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
                              />

                              <div style={{ flex: 1 }}>
                                <p style={{ margin: 0, fontWeight: "600" }}>{article.title}</p>
                                <p style={{ margin: "4px 0", fontSize: "12px", color: "#666" }}>
                                  Por: {article.userName}
                                </p>
                                <p style={{ margin: "4px 0", fontSize: "14px", color: "#FE8826", fontWeight: "600" }}>
                                  ${article.price}
                                </p>
                                <IonBadge color={article.isActive !== false ? "success" : "danger"}>
                                  {article.isActive !== false ? "Activa" : "Deshabilitada"}
                                </IonBadge>
                              </div>

                              <div>
                                {article.isActive !== false ? (
                                  <IonButton
                                    size="small"
                                    color="danger"
                                    fill="outline"
                                    onClick={() => handleDisableArticle(article.id)}
                                  >
                                    Deshabilitar
                                  </IonButton>
                                ) : (
                                  <IonButton
                                    size="small"
                                    color="success"
                                    fill="outline"
                                    onClick={() => handleEnableArticle(article.id)}
                                  >
                                    Habilitar
                                  </IonButton>
                                )}
                              </div>
                            </div>

                            {article.isActive === false && article.disabledReason && (
                              <p style={{ margin: "8px 0 0 0", fontSize: "12px", color: "#999", fontStyle: "italic" }}>
                                Razón: {article.disabledReason}
                              </p>
                            )}
                          </IonCardContent>
                        </IonCard>
                      ))}
                    </IonList>
                  ) : (
                    <p style={{ textAlign: "center", color: "#666" }}>No hay publicaciones</p>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </IonContent>

      <TabBar />

      {/* Alert para pedir razón */}
      <IonAlert
        isOpen={showReasonAlert}
        onDidDismiss={() => {
          setShowReasonAlert(false);
          setReason("");
          setSelectedId("");
          setActionType(null);
        }}
        header={actionType === "deactivateUser" ? "Desactivar Usuario" : "Deshabilitar Publicación"}
        message="¿Por qué deseas realizar esta acción?"
        inputs={[
          {
            name: "reason",
            type: "textarea",
            placeholder: "Ej: Contenido inapropiado, spam, etc.",
            value: reason,
          },
        ]}
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
          },
          {
            text: "Confirmar",
            role: "confirm",
            handler: (data) => {
              handleConfirmAction(data.reason || "Sin razón especificada");
            },
          },
        ]}
      />
    </IonPage>
  );
};

export default Admin;
