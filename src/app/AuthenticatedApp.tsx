import {
  IonApp,
  IonAvatar,
  IonButton,
  IonCol,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonRow,
  IonSplitPane,
  IonTabBar,
  IonTabButton,
  IonText,
  IonToolbar,
} from "@ionic/react";
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
import Tabs from "../pages/tabs";
import RightMenu from "../components/rightSection";
import { isPlatform } from "@ionic/core";
import {
  flashlightOutline,
  storefrontOutline,
  personOutline,
  bugOutline,
  hammerOutline,
} from "ionicons/icons";
import logo from "../assets/icon-192x192.png";
import challengeIcon from "../assets/icons/challenge-icon.svg";
import shameIcon from "../assets/icons/shame-icon.svg";
import { useWindowSize } from "../utils/WindowUtils";

const AuthenticatedApp: React.FC = () => {
  const { width } = useWindowSize();

  return (
    <IonApp>
      <IonReactRouter>
        {(isPlatform("desktop") || isPlatform("ipad")) && (
          <IonToolbar className='desktop-navbar'>
            <IonRow className='ion-align-items-center'>
              {width! >= 992 && (
                <IonCol size='4'>
                  <IonRow className='ion-align-items-center'>
                    <IonAvatar
                      style={{
                        width: "2.5rem",
                        height: "2.5rem",
                        marginLeft: "1rem",
                        marginRight: "1rem",
                      }}
                    >
                      <img src={logo} alt='logo' />
                    </IonAvatar>
                    <IonText
                      style={{ fontWeight: "bold", fontSize: "1.25rem" }}
                    >
                      Wall of Shame
                    </IonText>
                  </IonRow>
                </IonCol>
              )}
              <IonCol
                className='ion-no-padding'
                size={width! >= 992 ? "4" : "12"}
              >
                <IonTabBar className='desktop-navbar-tabs'>
                  <IonTabButton tab='challenges' href='/challenges'>
                    <IonIcon icon={challengeIcon} />
                    <IonLabel>Challenges</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab='explore' href='/explore'>
                    <IonIcon icon={flashlightOutline} />
                    <IonLabel>Explore</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab='wall-of-shame' href='/wall-of-shame'>
                    <IonIcon icon={shameIcon} />
                    <IonLabel>Wall</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab='store' href='/store'>
                    <IonIcon icon={storefrontOutline} />
                    <IonLabel>Store</IonLabel>
                  </IonTabButton>
                  <IonTabButton tab='profile' href='/profile'>
                    <IonIcon icon={personOutline} />
                    <IonLabel>Profile</IonLabel>
                  </IonTabButton>
                </IonTabBar>
              </IonCol>
              {width! >= 992 && (
                <IonCol size='4'>
                  <IonRow className='ion-align-items-center ion-justify-content-end'>
                    <IonButton mode='ios' color='clear'>
                      <IonIcon
                        icon={hammerOutline}
                        color='dark'
                        style={{ fontSize: "1.5rem" }}
                      />
                    </IonButton>
                    <IonButton mode='ios' color='clear'>
                      <IonIcon
                        icon={bugOutline}
                        color='dark'
                        style={{ fontSize: "1.5rem" }}
                      />
                    </IonButton>
                  </IonRow>
                </IonCol>
              )}
            </IonRow>
          </IonToolbar>
        )}
        <IonSplitPane
          contentId='main'
          className={`split-pane-main ${
            isPlatform("desktop") || isPlatform("ipad")
              ? "split-pane-main-desktop"
              : ""
          }`}
        >
          <IonRouterOutlet
            id='main'
            className={`split-pane-content ${
              !isPlatform("desktop") && !isPlatform("ipad") ? "non-desktop" : ""
            }`}
            style={{
              marginTop:
                isPlatform("desktop") || isPlatform("ipad") ? "3.5rem" : 0,
            }}
          >
            <Route path='/challenges' render={() => <Tabs />} />
            <Route path='/' render={() => <Tabs />} />
          </IonRouterOutlet>
          {(isPlatform("desktop") || isPlatform("ipad")) && <RightMenu />}
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default AuthenticatedApp;
