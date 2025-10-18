import { IonContent, IonPage } from "@ionic/react";
import "./Articulos.scss";
import Card from "../atoms/Card";
import { Header } from "../components/Header";
import { POSTS } from "../utils/Constants/lists";

const Articulos: React.FC = () => {
  return (
    <IonPage>
      <Header page="Articulos" color="secondary" searchBar={true} />
      <IonContent color="light">
        {POSTS.map((fav) => (
          <Card
            key={fav.id}
            id={fav.id}
            image={fav.image}
            name={fav.name}
            description={fav.description}
            price={fav.price}
            variant={fav.variant}
          ></Card>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Articulos;
