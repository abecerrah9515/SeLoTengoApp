import { IonContent, IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useBackButton } from "../hooks/useBackButton";

import "./Articulos.scss";
import Card from "../atoms/Card";
import { Header } from "../components/Header";
import TabBar from "../components/TabBar";

interface IArticles {
  description: string;
  id: string;
  image: string;
  title: string;
  price: string;
  userName: string;
  profileImage?: string;
  type: string;
  isActive?: boolean;
}

const Articulos: React.FC = () => {
  const [articles, setArticles] = useState<IArticles[]>([]);
  // useBackButton(); // Temporalmente desactivado para diagnosticar

  useEffect(() => {
    // Escucha en tiempo real los cambios en Firestore
    const unsubscribe = onSnapshot(collection(db, "articles"), (querySnapshot) => {
      const fetchedArticles = querySnapshot.docs
        .map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<IArticles, "id">),
        }))
        // Filtrar solo publicaciones activas (isActive === true o undefined para retrocompatibilidad)
        .filter((article) => article.isActive !== false);

      setArticles(fetchedArticles);
      console.log("Artículos cargados:", fetchedArticles);
    });

    // Limpia el listener cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  return (
    <IonPage>
      <Header page="Articulos" color="secondary" searchBar bellIcon />
      <IonContent color="light" style={{ paddingBottom: "76px" }}>
        {articles.length > 0 ? (
          articles.map((article) => (
            <Card
              key={article.id}
              id={article.id}
              image={article.image}
              title={article.title}
              description={article.description}
              price={article.price}
              userName={article.userName || "Anónimo"}
              profileImage={article.profileImage}
              variant="article"
              postType={article.type as "product" | "service" | "request"}
            />
          ))
        ) : (
          <p style={{ textAlign: "center", padding: "1rem" }}>No hay artículos publicados aún.</p>
        )}
      </IonContent>
      <TabBar />
    </IonPage>
  );
};

export default Articulos;
