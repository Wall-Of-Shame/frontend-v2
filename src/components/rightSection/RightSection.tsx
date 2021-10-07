import React from "react";
import {
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonIcon,
} from "@ionic/react";
import { hammerOutline, bugOutline } from "ionicons/icons";
import "./RightSection.scss";
import { useLocation } from "react-router";

const RightSection = () => {
  const location = useLocation();
  return (
    <IonMenu
      contentId='right-section-menu'
      className='right-section'
      side='end'
    >
      <IonContent forceOverscroll={false} id='right-section-menu'>
        <IonList lines='none'>
          <IonListHeader>Help</IonListHeader>
          <IonItem
            button
            routerLink={"/tutorial"}
            routerDirection='none'
            className={
              location.pathname.startsWith("/tutorial") ? "selected" : undefined
            }
          >
            <IonIcon slot='start' icon={hammerOutline} />
            Tutorial
          </IonItem>
          <IonItem
            button
            routerLink={"/feedback"}
            routerDirection='none'
            className={
              location.pathname.startsWith("/feedback") ? "selected" : undefined
            }
          >
            <IonIcon slot='start' icon={bugOutline} />
            Feedback
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default RightSection;
