import {
  IonButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import "./ViewProofModal.scss";
import { UserMini } from "../../../../interfaces/models/Challenges";
import Container from "../../../../components/container";

interface ViewProofModalProps {
  userData: UserMini | undefined;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const ViewProofModal: React.FC<ViewProofModalProps> = (
  props: ViewProofModalProps
) => {
  const { userData, showModal, setShowModal } = props;

  return (
    <IonModal
      mode='ios'
      isOpen={showModal}
      onDidDismiss={() => setShowModal(false)}
      backdropDismiss={false}
    >
      <IonHeader className='ion-no-border'>
        <IonToolbar color='main-beige'>
          <IonTitle>{`${userData?.name}'s proof`}</IonTitle>
          <IonButtons slot='start'>
            <IonButton
              onClick={() => setShowModal(false)}
              style={{ margin: "0.5rem" }}
            >
              <IonIcon icon={arrowBackOutline} size='large' />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Container>
          <IonRow
            className='ion-justify-content-center'
            style={{ marginTop: "2rem" }}
          >
            <img
              src={userData?.evidenceLink}
              alt='Proof'
              className='uploaded-proof'
              style={{ maxWidth: "75%" }}
            />
          </IonRow>
        </Container>
      </IonContent>
    </IonModal>
  );
};

export default ViewProofModal;
