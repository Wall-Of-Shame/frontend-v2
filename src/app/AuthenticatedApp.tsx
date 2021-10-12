import { IonApp, IonRouterOutlet, IonSplitPane } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Route } from "react-router-dom";

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

/* Theme variables */
import "../theme/variables.scss";

import "./App.scss";
import Menu from "../components/menu";
import Tabs from "../pages/tabs";
import RightMenu from "../components/rightMenu";
import { isPlatform } from "@ionic/core";

const AuthenticatedApp: React.FC = () => {
  return (
    <IonApp>
      <IonReactRouter>
        <IonSplitPane contentId='main' className='split-pane-main'>
          {!isPlatform("ios") && <Menu />}
          <IonRouterOutlet id='main' className='split-pane-content'>
            <Route path='/challenges' render={() => <Tabs />} />
            <Route path='/' render={() => <Tabs />} />
          </IonRouterOutlet>
          {!isPlatform("ios") && <RightMenu />}
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default AuthenticatedApp;
