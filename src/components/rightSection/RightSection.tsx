import React from "react";
import {
  IonMenu,
  IonContent,
  IonList,
  IonListHeader,
  IonItem,
  IonIcon,
} from "@ionic/react";
import { hammer, bug } from "ionicons/icons";
import "./RightSection.scss";

const RightSection = () => {
  return (
    <IonMenu
      contentId='right-section-menu'
      className='right-section'
      side='end'
    >
      <IonContent forceOverscroll={false} id='right-section-menu'>
        <IonList lines='none'>
          <IonListHeader>Help</IonListHeader>
          <IonItem button>
            <IonIcon slot='start' icon={hammer} />
            Tutorial
          </IonItem>
          <IonItem button>
            <IonIcon slot='start' icon={bug} />
            Report a bug
          </IonItem>
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default RightSection;
