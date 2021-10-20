import {
  IonAvatar,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { arrowBackOutline, personAddOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { hideTabs } from "../../../utils/TabsUtils";
import { useHistory } from "react-router";
import AvatarImg from "../../../components/avatar";
import Container from "../../../components/container";
import "../Profile.scss";
import AddFriendsModal from "./AddFriendsModal";

const Friends: React.FC = () => {
  const history = useHistory();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    hideTabs();
  }, []);

  return (
    <IonPage style={{ background: "#ffffff" }}>
      <IonHeader className='ion-no-border'>
        <IonToolbar color='main-blue' style={{ paddingTop: "0.5rem" }}>
          <IonButtons slot='start'>
            <IonFabButton
              className='placeholder-fab'
              color='main-blue'
              mode='ios'
              slot='start'
              style={{
                margin: "0.5rem",
                width: "2.75rem",
                height: "2.75rem",
              }}
              onClick={() => {
                history.goBack();
              }}
            >
              <IonIcon icon={arrowBackOutline} />
            </IonFabButton>
          </IonButtons>
          <IonButtons slot='end'>
            <IonFabButton
              className='placeholder-fab'
              color='main-blue'
              mode='ios'
              slot='end'
              style={{
                margin: "0.5rem",
                width: "2.75rem",
                height: "2.75rem",
              }}
              onClick={() => setShowModal(true)}
            >
              <IonIcon icon={personAddOutline} />
            </IonFabButton>
          </IonButtons>
        </IonToolbar>
        {!isPlatform("desktop") && <div className='profile-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
        <Container>{"There's nothing here >_<"}</Container>
        <AddFriendsModal
          users={[]}
          showModal={showModal}
          setShowModal={setShowModal}
          completionCallback={() => {}}
        />
      </IonContent>
    </IonPage>
  );
};

export default Friends;
