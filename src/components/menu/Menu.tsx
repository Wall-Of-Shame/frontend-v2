import React from "react";
import { useLocation } from "react-router";

import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from "@ionic/react";
import {
  storefrontOutline,
  flashlightOutline,
  personOutline,
} from "ionicons/icons";
import challengeIcon from "../../assets/icons/challenge-icon.svg";
import shameIcon from "../../assets/icons/shame-icon.svg";

import "./Menu.scss";

const routes = {
  appPages: [
    { title: "Challenges", path: "/challenges", icon: challengeIcon },
    { title: "Explore", path: "/explore", icon: flashlightOutline },
    { title: "Wall", path: "/wall-of-shame", icon: shameIcon },
    { title: "Store", path: "/store", icon: storefrontOutline },
    { title: "Profile", path: "/profile", icon: personOutline },
  ],
};

interface Pages {
  title: string;
  path: string;
  icon: string;
  routerDirection?: string;
}

const Menu: React.FC = () => {
  const location = useLocation();

  function renderlistItems(list: Pages[]) {
    return list
      .filter((route) => !!route.path)
      .map((p) => (
        <IonMenuToggle key={p.title} auto-hide='false'>
          <IonItem
            detail={false}
            routerLink={p.path}
            routerDirection='none'
            className={
              location.pathname.startsWith(p.path) ? "selected" : undefined
            }
          >
            <IonIcon slot='start' icon={p.icon} />
            <IonLabel>{p.title}</IonLabel>
          </IonItem>
        </IonMenuToggle>
      ));
  }

  return (
    <IonMenu contentId='main' className='nav-menu' side='start'>
      <IonContent forceOverscroll={false}>
        <IonList lines='none' mode='md'>
          <IonListHeader>Welcome</IonListHeader>
          {renderlistItems(routes.appPages)}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;