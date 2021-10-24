import {
  IonButton,
  IonContent,
  IonGrid,
  IonIcon,
  IonModal,
  IonRow,
  IonText,
} from "@ionic/react";
import "./Store.scss";
import coin from "../../assets/icons/coin.png";
import { close } from "ionicons/icons";

interface CoinModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const CoinModal: React.FC<CoinModalProps> = (props: CoinModalProps) => {
  const { showModal, setShowModal } = props;

  return (
    <IonModal
      cssClass='coin-info-modal'
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
            <img
              src={coin}
              alt='Coins'
              style={{ width: "5rem", height: "5rem" }}
            />
          </IonRow>
          <IonRow
            className='ion-justify-content-center ion-align-items-center'
            style={{ marginTop: "0.5rem" }}
          >
            <IonText style={{ fontWeight: "600" }}>Wall of Shame Coins</IonText>
          </IonRow>
          <IonRow
            className='ion-justify-content-center ion-align-items-center ion-text-center'
            style={{ padding: "1rem" }}
          >
            <IonText>
              Earn coins by completing challenges! Each completed challenge
              grants you 100 coins. You can earn up to 500 coins per day :)
            </IonText>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default CoinModal;
