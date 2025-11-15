import React, { useState, useEffect } from "react";
import {
  IonCard,
  IonCardContent,
  IonTextarea,
  IonButton,
  IonAvatar,
  IonIcon,
  IonSpinner,
  IonItem,
  IonLabel,
  IonAlert,
} from "@ionic/react";
import { trashOutline, sendOutline } from "ionicons/icons";
import { useAuth } from "../context/authContext";
import {
  createComment,
  getArticleComments,
  deleteComment,
} from "../firebase/commentsService";
import { getUserProfile } from "../firebase/userService";
import { Comment } from "../types/comment.types";
import "./Comments.scss";

interface CommentsProps {
  articleId: string;
}

const Comments: React.FC<CommentsProps> = ({ articleId }) => {
  const { currentUser, isAdmin } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingComments, setLoadingComments] = useState(true);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);
  const [deleteReason, setDeleteReason] = useState("");

  useEffect(() => {
    loadComments();
  }, [articleId]);

  const loadComments = async () => {
    setLoadingComments(true);
    try {
      const fetchedComments = await getArticleComments(articleId);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error al cargar comentarios:", error);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleAddComment = async () => {
    if (!currentUser || !newComment.trim()) return;

    setLoading(true);
    try {
      const userProfile = await getUserProfile(currentUser.uid);

      if (!userProfile) {
        alert("Error al obtener datos del perfil");
        return;
      }

      await createComment({
        articleId,
        userId: currentUser.uid,
        userName: userProfile.displayName,
        userPhoto: userProfile.photoURL || "",
        content: newComment.trim(),
      });

      setNewComment("");
      loadComments(); // Recargar comentarios
    } catch (error) {
      console.error("Error al agregar comentario:", error);
      alert("Error al agregar comentario");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (commentId: string) => {
    setCommentToDelete(commentId);
    setShowDeleteAlert(true);
  };

  const handleConfirmDelete = async (providedReason: string) => {
    if (!commentToDelete || !currentUser) return;

    try {
      await deleteComment({
        commentId: commentToDelete,
        deletedBy: currentUser.uid,
        deletionReason: providedReason || "Comentario inapropiado",
      });

      loadComments(); // Recargar comentarios
      setDeleteReason("");
      setCommentToDelete(null);
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
      alert("Error al eliminar comentario");
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate();
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (minutes < 1) return "Hace un momento";
    if (minutes < 60) return `Hace ${minutes} min`;
    if (hours < 24) return `Hace ${hours} h`;
    if (days < 7) return `Hace ${days} d`;
    return date.toLocaleDateString();
  };

  return (
    <div className="comments-section">
      <h3 style={{ marginTop: "1.5rem", marginBottom: "1rem", fontSize: "18px", fontWeight: "600" }}>
        Comentarios ({comments.length})
      </h3>

      {/* Formulario para agregar comentario */}
      {currentUser && (
        <IonCard>
          <IonCardContent>
            <IonTextarea
              placeholder="Escribe un comentario..."
              value={newComment}
              onIonChange={(e) => setNewComment(e.detail.value || "")}
              rows={3}
              maxlength={500}
            />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: "0.5rem" }}>
              <span style={{ fontSize: "12px", color: "#666" }}>
                {newComment.length}/500
              </span>
              <IonButton
                size="small"
                color="tertiary"
                onClick={handleAddComment}
                disabled={loading || !newComment.trim()}
              >
                <IonIcon icon={sendOutline} slot="start" />
                Comentar
              </IonButton>
            </div>
          </IonCardContent>
        </IonCard>
      )}

      {/* Lista de comentarios */}
      {loadingComments ? (
        <div style={{ textAlign: "center", padding: "2rem" }}>
          <IonSpinner />
        </div>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <IonCard key={comment.id} className="comment-card">
            <IonCardContent>
              <div style={{ display: "flex", gap: "12px" }}>
                <IonAvatar style={{ width: "40px", height: "40px", flexShrink: 0 }}>
                  <img
                    src={comment.userPhoto || "https://ionicframework.com/docs/img/demos/avatar.svg"}
                    alt={comment.userName}
                  />
                </IonAvatar>

                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div>
                      <p style={{ margin: 0, fontWeight: "600", fontSize: "14px" }}>
                        {comment.userName}
                      </p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#666" }}>
                        {formatDate(comment.createdAt)}
                      </p>
                    </div>

                    {/* Botón de eliminar (solo para admin o autor del comentario) */}
                    {currentUser && (isAdmin || currentUser.uid === comment.userId) && (
                      <IonButton
                        fill="clear"
                        size="small"
                        color="danger"
                        onClick={() => handleDeleteClick(comment.id)}
                      >
                        <IonIcon icon={trashOutline} slot="icon-only" />
                      </IonButton>
                    )}
                  </div>

                  <p style={{ margin: "8px 0 0 0", fontSize: "14px", color: "#333" }}>
                    {comment.content}
                  </p>
                </div>
              </div>
            </IonCardContent>
          </IonCard>
        ))
      ) : (
        <p style={{ textAlign: "center", color: "#666", padding: "2rem" }}>
          No hay comentarios aún. ¡Sé el primero en comentar!
        </p>
      )}

      {/* Alert para confirmar eliminación */}
      <IonAlert
        isOpen={showDeleteAlert}
        onDidDismiss={() => {
          setShowDeleteAlert(false);
          setCommentToDelete(null);
          setDeleteReason("");
        }}
        header="Eliminar comentario"
        message="¿Por qué deseas eliminar este comentario?"
        inputs={[
          {
            name: "reason",
            type: "textarea",
            placeholder: "Ej: Contenido ofensivo, spam, etc.",
            value: deleteReason,
          },
        ]}
        buttons={[
          {
            text: "Cancelar",
            role: "cancel",
          },
          {
            text: "Eliminar",
            role: "confirm",
            handler: (data) => {
              handleConfirmDelete(data.reason || "Sin razón especificada");
            },
          },
        ]}
      />
    </div>
  );
};

export default Comments;
