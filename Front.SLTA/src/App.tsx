import { Redirect, Route } from "react-router-dom";
import { IonApp, IonRouterOutlet, setupIonicReact } from "@ionic/react";
import { IonReactHashRouter } from "@ionic/react-router";

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

import Articulos from "./pages/Articulos";
import Guardado from "./pages/Guardado";
import Dealers from "./pages/Dealers";
import Perfil from "./pages/Perfil";
import EditarPerfil from "./pages/EditarPerfil";
import Publicar from "./pages/Publicar";
import DetalleArticulo from "./pages/Detalle";
import DetalleDealer from "./pages/DetalleDealer";
import Admin from "./pages/Admin";
import Login from "./pages/auth/login/Login";
import Register from "./pages/auth/register/Register";

import { FavoritesProvider } from "./context/SavedContext";
import PrivateRoute from "./components/PrivateRoute";

setupIonicReact();

const App: React.FC = () => (
  <FavoritesProvider>
    <IonApp>
      <IonReactHashRouter>
        <IonRouterOutlet>
          {/* Rutas de autenticación */}
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />

          {/* Rutas principales protegidas */}
          <PrivateRoute exact path="/articulos" component={Articulos} />
          <PrivateRoute exact path="/dealers" component={Dealers} />
          <PrivateRoute exact path="/publicar" component={Publicar} />
          <PrivateRoute exact path="/guardado" component={Guardado} />
          <PrivateRoute exact path="/perfil" component={Perfil} />
          <PrivateRoute exact path="/editar-perfil" component={EditarPerfil} />

          {/* Rutas de administración (solo admin) */}
          <PrivateRoute exact path="/admin" component={Admin} />

          {/* Rutas de detalle protegidas */}
          <PrivateRoute exact path="/articulo/:id" component={DetalleArticulo} />
          <PrivateRoute exact path="/dealer/:id" component={DetalleDealer} />

          {/* Redirección inicial */}
          <Route exact path="/">
            <Redirect to="/login" />
          </Route>
        </IonRouterOutlet>
      </IonReactHashRouter>
    </IonApp>
  </FavoritesProvider>
);

export default App;
