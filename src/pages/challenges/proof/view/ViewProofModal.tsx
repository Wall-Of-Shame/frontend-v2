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
import Container from "../../../../components/container";
import "./ViewProofModal.scss";
import { UserMini } from "../../../../interfaces/models/Challenges";
import Scrollbars from "react-custom-scrollbars";

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
      isOpen={showModal}
      onDidDismiss={() => setShowModal(false)}
      backdropDismiss={false}
    >
      <IonHeader translucent>
        <IonToolbar>
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
        <Scrollbars>
          <Container>
            <IonRow className='ion-justify-content-center ion-padding-vertical'>
              <img
                src={userData?.evidenceLink}
                alt='Proof'
                className='uploaded-proof'
              />
            </IonRow>
          </Container>
        </Scrollbars>
      </IonContent>
    </IonModal>
  );
};

export default ViewProofModal;
