import {
  IonApp,
  IonAvatar,
  IonBadge,
  IonButton,
  IonCol,
  IonIcon,
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
import { useUser } from "../contexts/UserContext";
import { useEffect, useState } from "react";

const AuthenticatedApp: React.FC = () => {
  const { width, isDesktop } = useWindowSize();
  const { user } = useUser();

  const [isDesktopBefore, setIsDesktopBefore] = useState(isDesktop);

  useEffect(() => {
    if (isDesktop !== isDesktopBefore && !isPlatform("desktop")) {
      setIsDesktopBefore(isDesktop);
      window.location.reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDesktop]);

  return (
    <IonApp>
      <IonReactRouter>
        {isDesktop && (
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
                  </IonTabButton>
                  <IonTabButton tab='explore' href='/explore'>
                    <IonIcon icon={flashlightOutline} />
                  </IonTabButton>
                  <IonTabButton tab='wall-of-shame' href='/wall-of-shame'>
                    <IonIcon icon={shameIcon} />
                  </IonTabButton>
                  <IonTabButton tab='store' href='/store'>
                    <IonIcon icon={storefrontOutline} />
                  </IonTabButton>
                  <IonTabButton tab='profile' href='/profile'>
                    <IonIcon icon={personOutline} />
                    {!!user?.friends.received && user?.friends.received > 0 && (
                      <IonBadge
                        mode='ios'
                        color='danger'
                        style={{
                          position: "absolute",
                          top: "0.5rem",
                          right: "0.4rem",
                          width: "0.85rem",
                          height: "0.85rem",
                        }}
                      >
                        &nbsp;
                      </IonBadge>
                    )}
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
            isDesktop ? "split-pane-main-desktop" : ""
          }`}
        >
          <IonRouterOutlet
            id='main'
            className={`split-pane-content ${
              !(
                isPlatform("desktop") ||
                isPlatform("tablet") ||
                isPlatform("ipad")
              )
                ? "non-desktop"
                : ""
            }`}
            style={{
              marginTop: isDesktop ? "3.5rem" : 0,
            }}
          >
            <Route path='/challenges' render={() => <Tabs />} />
            <Route path='/' render={() => <Tabs />} />
          </IonRouterOutlet>
          {(isPlatform("desktop") ||
            isPlatform("tablet") ||
            isPlatform("ipad")) && <RightMenu />}
        </IonSplitPane>
      </IonReactRouter>
    </IonApp>
  );
};

export default AuthenticatedApp;
