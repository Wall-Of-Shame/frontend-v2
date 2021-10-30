import {
  IonAvatar,
  IonButton,
  IonContent,
  IonGrid,
  IonIcon,
  IonModal,
  IonRow,
  IonText,
} from "@ionic/react";
import "./PrivacyModal.scss";
import { close } from "ionicons/icons";
import logo from "../../assets/icon-192x192.png";
import { useWindowSize } from "../../utils/WindowUtils";

interface PrivacyModallProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const PrivacyModal: React.FC<PrivacyModallProps> = (
  props: PrivacyModallProps
) => {
  const { showModal, setShowModal } = props;
  const { width } = useWindowSize();

  return (
    <IonModal
      cssClass={
        width! < 350
          ? "privacy-modal-sm"
          : width! < 400
          ? "privacy-modal-md"
          : "privacy-modal"
      }
      mode='ios'
      isOpen={showModal}
      onDidDismiss={() => setShowModal(false)}
      backdropDismiss={true}
    >
      <IonContent fullscreen scrollY={false}>
        <IonButton
          color='light'
          shape='round'
          mode='ios'
          className='ion-no-padding'
          onClick={() => setShowModal(false)}
          style={{
            position: "absolute",
            top: "0.25rem",
            left: "0.5rem",
            width: "2.5rem",
            height: "2.5rem",
            zIndex: 20000,
          }}
        >
          <IonIcon icon={close} size='large' color='main-yellow' />
        </IonButton>
        <IonGrid className='ion-padding' style={{ marginTop: "2rem" }}>
          <IonRow className='ion-justify-content-center ion-align-items-center'>
            <IonAvatar style={{ width: "5rem", height: "5rem" }}>
              <img src={logo} alt='Logo' />
            </IonAvatar>
          </IonRow>
          <IonRow
            className='ion-justify-content-center ion-align-items-center'
            style={{ marginTop: "0.5rem" }}
          >
            <IonText style={{ fontWeight: "600" }}>Wall of Shame</IonText>
          </IonRow>
          <IonRow
            className='ion-justify-content-center ion-align-items-center ion-text-center'
            style={{ padding: "1rem" }}
          >
            <IonText>
              Here at the Wall of Shame, there is no such thing called privacy.
            </IonText>
          </IonRow>
          <IonRow
            className='ion-justify-content-center ion-align-items-center ion-text-center'
            style={{ padding: "0.25rem" }}
          >
            <IonText>
              Just kidding :) We will not collect any sensitive information that
              may identify you.
            </IonText>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default PrivacyModal;
