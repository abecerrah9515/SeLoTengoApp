import { Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import Articulos from "./pages/Articulos";
import Dealers from "./pages/Dealers";
import Publicar from "./pages/Publicar";
import Guardado from "./pages/Guardado";
import Perfil from "./pages/Perfil";
import DetalleArticulo from "./pages/Detalle";

/*Iconos*/

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/**
 * Ionic Dark Mode
 * -----------------------------------------------------
 * For more info, please see:
 * https://ionicframework.com/docs/theming/dark-mode
 */

/* import '@ionic/react/css/palettes/dark.always.css'; */
/* import '@ionic/react/css/palettes/dark.class.css'; */
import "@ionic/react/css/palettes/dark.system.css";

/* Theme variables */
import "./theme/variables.css";
import { addCircleOutline, heartOutline, homeOutline, peopleOutline, personOutline } from "ionicons/icons";
import { FavoritesProvider } from "./context/SavedContext";

setupIonicReact();

const App: React.FC = () => (
  <FavoritesProvider>
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/Articulos">
              <Articulos />
            </Route>
            <Route exact path="/Dealers">
              <Dealers />
            </Route>
            <Route path="/Publicar">
              <Publicar />
            </Route>
            <Route path="/Guardado">
              <Guardado />
            </Route>
            <Route path="/Perfil">
              <Perfil />
            </Route>
            <Route exact path="/articulo/:id">
              <DetalleArticulo />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom" color="primary" style={{ minHeight: "76px" }}>
            <IonTabButton tab="Articulos" href="/Articulos">
              <IonIcon aria-hidden="true" color="light" icon={homeOutline} style={{ fontSize: "35px" }} />
              <IonLabel style={{ fontSize: "12px" }}>Articulos</IonLabel>
            </IonTabButton>
            <IonTabButton tab="Dealers" href="/Dealers">
              <IonIcon aria-hidden="true" color="light" icon={peopleOutline} style={{ fontSize: "35px" }} />
              <IonLabel style={{ fontSize: "12px" }}>Dealers</IonLabel>
            </IonTabButton>
            <IonTabButton tab="Publicar" href="/Publicar">
              <IonIcon aria-hidden="true" color="light" icon={addCircleOutline} style={{ fontSize: "35px" }} />
              <IonLabel style={{ fontSize: "12px" }}>Publicar</IonLabel>
            </IonTabButton>
            <IonTabButton tab="Guardado" href="/Guardado">
              <IonIcon aria-hidden="true" color="light" icon={heartOutline} style={{ fontSize: "35px" }} />
              <IonLabel style={{ fontSize: "12px" }}>Guardado</IonLabel>
            </IonTabButton>
            <IonTabButton tab="Perfil" href="/Perfil">
              <IonIcon aria-hidden="true" color="light" icon={personOutline} style={{ fontSize: "35px" }} />
              <IonLabel style={{ fontSize: "12px" }}>Perfil</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  </FavoritesProvider>
);

export default App;
