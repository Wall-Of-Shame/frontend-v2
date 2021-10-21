import {
  IonAvatar,
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonItem,
  IonModal,
  IonRow,
  IonText,
} from "@ionic/react";
import { add, remove } from "ionicons/icons";
import challenge from "../../../assets/onboarding/challenge.png";
import "./PurchasePowerUpModal.scss";
import { PowerUp, PowerUpType } from "../../../interfaces/models/Store";
import { useState } from "react";

interface PurchasePowerUpModalProps {
  powerUp: PowerUp | null;
  purchaseCallback: (type: PowerUpType, count: number) => void;
  hasPurchased: boolean;
  currentCount: number;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const PurchasePowerUpModal: React.FC<PurchasePowerUpModalProps> = (
  props: PurchasePowerUpModalProps
) => {
  const {
    powerUp,
    purchaseCallback,
    hasPurchased,
    currentCount,
    showModal,
    setShowModal,
  } = props;

  const [count, setCount] = useState(1);

  return (
    <IonModal
      cssClass='purhcase-item-modal'
      isOpen={showModal}
      onDidDismiss={() => setShowModal(false)}
      backdropDismiss={true}
    >
      <IonContent fullscreen scrollY={false}>
        {hasPurchased ? (
          <IonGrid className='ion-padding' style={{ marginTop: "3rem" }}>
            <IonRow
              className='ion-justify-content-center'
              style={{
                paddingLeft: "0.5rem",
                paddingRight: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <IonText
                className='ion-text-center'
                style={{ fontWeight: "600" }}
              >
                Nice, now you have
              </IonText>
            </IonRow>
            <IonRow className='ion-justify-content-center ion-align-items-center'>
              <IonItem lines='none'>
                <IonAvatar
                  slot='start'
                  style={{ width: "3.5rem", height: "3.5rem" }}
                >
                  <img src={challenge} alt='Challenge' />
                </IonAvatar>
                <IonText
                  className='ion-text-center'
                  style={{ fontWeight: "600" }}
                >
                  {powerUp?.type ?? "-"}
                </IonText>
                <IonText className='ion-text-center'>&nbsp;?</IonText>
              </IonItem>
            </IonRow>
            <IonRow
              className='ion-justify-content-center ion-align-items-center'
              style={{ margin: "0.75rem" }}
            >
              <IonCol>
                <IonRow className='ion-justify-content-center ion-align-items-center'>
                  <IonText style={{ fontSize: "1.5rem" }}>x&nbsp;</IonText>
                  <IonText
                    className='ion-text-center'
                    style={{ fontWeight: "600", fontSize: "2rem" }}
                  >
                    {currentCount}
                  </IonText>
                </IonRow>
              </IonCol>
            </IonRow>
            <IonRow className='ion-justify-content-center'>
              <IonCol>
                <IonButton
                  color='main-beige'
                  shape='round'
                  expand='block'
                  mode='ios'
                  onClick={() => {
                    setShowModal(false);
                  }}
                >
                  Awesome!
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        ) : (
          <IonGrid className='ion-padding' style={{ marginTop: "0.5rem" }}>
            <IonRow
              className='ion-justify-content-center'
              style={{
                paddingLeft: "0.5rem",
                paddingRight: "0.5rem",
                marginBottom: "1rem",
              }}
            >
              <IonText
                className='ion-text-center'
                style={{ fontWeight: "600" }}
              >
                Do you want to spend{" "}
                {powerUp?.price ? powerUp?.price * count : "-"} coins to buy
                this item?
              </IonText>
            </IonRow>
            <IonRow className='ion-justify-content-center ion-align-items-center'>
              <IonItem lines='none'>
                <IonAvatar
                  slot='start'
                  style={{ width: "3.5rem", height: "3.5rem" }}
                >
                  <img src={challenge} alt='Challenge' />
                </IonAvatar>
                <IonText
                  className='ion-text-center'
                  style={{ fontWeight: "600" }}
                >
                  {powerUp?.type ?? "-"}
                </IonText>
                <IonText className='ion-text-center'>&nbsp;?</IonText>
              </IonItem>
            </IonRow>
            <IonRow
              className='ion-justify-content-center ion-align-items-center'
              style={{ margin: "0.75rem" }}
            >
              <IonCol>
                <IonRow className='ion-justify-content-center'>
                  <IonIcon
                    icon={remove}
                    size='large'
                    onClick={() => {
                      setCount(count < 2 ? 1 : count - 1);
                    }}
                  />
                </IonRow>
              </IonCol>
              <IonCol>
                <IonRow className='ion-justify-content-center'>
                  <IonText
                    className='ion-text-center'
                    style={{ fontWeight: "600", fontSize: "2rem" }}
                  >
                    {count}
                  </IonText>
                </IonRow>
              </IonCol>
              <IonCol>
                <IonRow className='ion-justify-content-center'>
                  <IonIcon
                    icon={add}
                    size='large'
                    onClick={() => {
                      setCount(count + 1);
                    }}
                  />
                </IonRow>
              </IonCol>
            </IonRow>
            <IonRow className='ion-justify-content-center'>
              <IonCol>
                <IonButton
                  color='main-beige'
                  shape='round'
                  expand='block'
                  mode='ios'
                  onClick={() => {
                    if (!powerUp?.type) {
                      return;
                    }
                    purchaseCallback(powerUp?.type, count);
                  }}
                >
                  Yas
                </IonButton>
              </IonCol>
            </IonRow>
            <IonRow className='ion-justify-content-center'>
              <IonCol>
                <IonButton
                  color='main-beige'
                  fill='outline'
                  shape='round'
                  expand='block'
                  mode='ios'
                  onClick={() => setShowModal(false)}
                >
                  Wait no I don't
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        )}
      </IonContent>
    </IonModal>
  );
};

export default PurchasePowerUpModal;
