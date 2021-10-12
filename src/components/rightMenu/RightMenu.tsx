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
import "./RightMenu.scss";
import FeedbackModal from "../feedback";
import { useWindowSize } from "../../utils/WindowUtils";

const RightMenu = () => {
  const { width, height } = useWindowSize();
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  return (
    <IonMenu
      contentId='right-section-menu'
      className='right-section'
      side='end'
      hidden={!(width! > 576 && height! > 576)}
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

export default RightMenu;
