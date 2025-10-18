import { IonContent, IonPage } from "@ionic/react";
import "./Dealers.scss";
import Card from "../atoms/Card";
import { Header } from "../components/Header";

const Dealers: React.FC = () => {
  return (
    <IonPage>
      <Header page={"Dealers"} color={"secondary"} searchBar={true} />

      <IonContent color="light">
        <Card
          id="A1"
          image="https://randomuser.me/api/portraits/men/32.jpg"
          name="Carlos Ramírez"
          description="Estudiante de Ingeniería - Disponible para tutorías"
          price="+57 300 456 7890"
          variant="contact"
        />
      </IonContent>
    </IonPage>
  );
};

export default Dealers;
