import { IonContent, IonPage } from "@ionic/react";
import "./Guardado.scss";
import Card from "../atoms/Card";
import { Header } from "../components/Header";
import { useFavorites } from "../context/SavedContext";
import { POSTS } from "../utils/Constants/lists";

const Guardado: React.FC = () => {
  const { favorites } = useFavorites();

  return (
    <IonPage>
      <Header page={"Guardados"} color={"secondary"} searchBar={true} />

      <IonContent color="light">
        {favorites.length === 0 ? (
          <p>No tienes favoritos aún.</p>
        ) : (
          <>
            {POSTS.filter((card) => favorites.includes(card.id)).map((fav) => (
              <Card
                key={fav.id}
                id={fav.id}
                image={fav.image}
                name={fav.name}
                description={fav.description}
                price={fav.price}
                variant={fav.variant}
                active={true}
              ></Card>
            ))}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Guardado;
