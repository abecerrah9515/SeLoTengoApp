import { IonContent, IonPage } from "@ionic/react";
import "./Guardado.scss";
import Card from "../atoms/Card";
import { Header } from "../components/Header";
import TabBar from "../components/TabBar";
import { useFavorites } from "../context/SavedContext";
import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
// import { useBackButton } from "../hooks/useBackButton";

interface IArticles {
  description: string;
  id: string;
  image: string;
  title: string;
  price: string;
  userName: string;
  type: string;
}

const Guardado: React.FC = () => {
  const { favorites } = useFavorites();
  const [articles, setArticles] = useState<IArticles[]>([]);
  // useBackButton(); // Temporalmente desactivado para diagnosticar

  useEffect(() => {
    // Escuchar cambios en la colección de artículos de Firebase
    const unsubscribe = onSnapshot(collection(db, "articles"), (querySnapshot) => {
      const fetchedArticles = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<IArticles, "id">),
      }));
      setArticles(fetchedArticles);
    });

    return () => unsubscribe();
  }, []);

  // Filtrar artículos que están en favoritos
  const favoriteArticles = articles.filter((article) => favorites.includes(article.id));

  return (
    <IonPage>
      <Header page={"Guardados"} color={"secondary"} searchBar={true} />

      <IonContent color="light" style={{ paddingBottom: "76px" }}>
        {favorites.length === 0 ? (
          <p style={{ textAlign: "center", padding: "1rem" }}>No tienes favoritos aún.</p>
        ) : favoriteArticles.length === 0 ? (
          <p style={{ textAlign: "center", padding: "1rem" }}>Cargando favoritos...</p>
        ) : (
          <>
            {favoriteArticles.map((article) => (
              <Card
                key={article.id}
                id={article.id}
                image={article.image}
                title={article.title}
                description={article.description}
                price={article.price}
                userName={article.userName || "Anónimo"}
                variant="article"
                postType={article.type as "product" | "service" | "request"}
                active={true}
              />
            ))}
          </>
        )}
      </IonContent>
      <TabBar />
    </IonPage>
  );
};

export default Guardado;
