import { IonApp, IonRouterOutlet } from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import { Redirect, Route, Switch } from "react-router-dom";

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
import Onboarding from "../pages/onboarding";
import Landing from "../pages/share";
import { getRedirectResult } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebase";
import AuthService from "../services/AuthService";
import { isInstagramBrowser } from "../utils/BrowserUtils";
import LoadingSpinner from "../components/loadingSpinner";

const redirectToOnboarding = (): React.ReactNode => (
  <Redirect to={"/onboarding"} />
);

const UnauthenticatedApp: React.FC = () => {
  const [isLoading, setIsLoadingVisible] = useState(false);

  useEffect(() => {
    if (!isInstagramBrowser()) {
      // skip if not instagram browser
      return;
    }
    setIsLoadingVisible(true);
    getRedirectResult(auth).then(async user => {
      if (!user) {
        setIsLoadingVisible(false);
        return;
      }
      const token = await user.user.getIdToken();
      await AuthService.login(token);
      setIsLoadingVisible(false);
      window.location.href = '';
    });
  }, []);
  
  if (isLoading) {
    return <LoadingSpinner
      loading={true}
      closeLoading={() => {}}
      message='Loading' 
    />
  }

  return (
    <IonApp className='unauthenticated-app'>
      <IonReactRouter>
        <IonRouterOutlet id='main'>
          <Switch>
            <Route exact path='/share/link/:id' component={Landing} />
            <Route exact path='/onboarding' component={Onboarding} />
            <Route render={redirectToOnboarding} />
          </Switch>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default UnauthenticatedApp;
