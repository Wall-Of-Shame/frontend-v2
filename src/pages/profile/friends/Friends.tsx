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
} from "@ionic/react";
import { chevronBackOutline, personAddOutline } from "ionicons/icons";
import { useEffect } from "react";
import { hideTabs } from "../../../utils/TabsUtils";
import { useHistory } from "react-router";
import AvatarImg from "../../../components/avatar";
import Container from "../../../components/container";

const Friends: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    hideTabs();
  }, []);

  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar style={{ paddingTop: "0.5rem" }}>
          <IonButtons slot='start'>
            <IonFabButton
              color='light'
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
              <IonIcon icon={chevronBackOutline} />
            </IonFabButton>
          </IonButtons>
          <IonButtons slot='end'>
            <IonFabButton
              color='light'
              mode='ios'
              slot='end'
              style={{
                margin: "0.5rem",
                width: "2.75rem",
                height: "2.75rem",
              }}
              onClick={() => {
                history.goBack();
              }}
            >
              <IonIcon icon={personAddOutline} style={{ fontSize: "1.5rem" }} />
            </IonFabButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <Container>{"There's nothing here >_<"}</Container>
      </IonContent>
    </IonPage>
  );
};

export default Friends;
