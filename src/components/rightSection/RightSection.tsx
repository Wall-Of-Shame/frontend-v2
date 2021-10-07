import React, { useState } from "react";
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
import FeedbackModal from "../feedback";

const RightSection = () => {
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
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
            <IonIcon slot='start' icon={hammerOutline} />
            Tutorial
          </IonItem>
          <IonItem button onClick={() => setShowFeedbackModal(true)}>
            <IonIcon slot='start' icon={bugOutline} />
            Feedback
          </IonItem>
        </IonList>
        <FeedbackModal
          showModal={showFeedbackModal}
          setShowModal={setShowFeedbackModal}
        />
      </IonContent>
    </IonMenu>
  );
};

export default RightSection;
