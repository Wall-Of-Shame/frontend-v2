import {
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonModal,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { close, closeCircle, informationCircle } from "ionicons/icons";
import coin from "../../../assets/icons/coin.png";
import challenge from "../../../assets/onboarding/challenge.png";
import "./PowerUpModal.scss";
import { PowerUp, PowerUpType } from "../../../interfaces/models/Store";
import { useReducer, useState } from "react";
import { PowerUpMap, powerUps } from "../../store/Store";
import ReactCardFlip from "react-card-flip";
import { useWindowSize } from "../../../utils/WindowUtils";
import { UserData } from "../../../interfaces/models/Users";
import { useAuth } from "../../../contexts/AuthContext";
import { useUser } from "../../../contexts/UserContext";
import LoadingSpinner from "../../../components/loadingSpinner";
import Alert from "../../../components/alert";
import PurchasePowerUpModal from "../../../components/powerUp";
import { adaptPowerUpType } from "../../../utils/StoreUtils";
import { ChallengeData } from "../../../interfaces/models/Challenges";
import { useChallenge } from "../../../contexts/ChallengeContext";

interface PowerUpModalProps {
  challengeData: ChallengeData;
  refreshChallengeCallback: () => Promise<void>;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

interface PowerUpModalState {
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

const PowerUpModal: React.FC<PowerUpModalProps> = (
  props: PowerUpModalProps
) => {
  const { showModal, setShowModal, challengeData, refreshChallengeCallback } =
    props;
  const { refreshUser } = useAuth();
  const { applyPowerUp, getAllChallenges, getChallenge } = useChallenge();
  const { user, purchaseItem } = useUser();
  const { width } = useWindowSize();

  const [refreshedUser, setRefreshedUser] = useState<UserData | null>(user);
  const [refreshedChallenge, setRefreshedChallenge] =
    useState<ChallengeData>(challengeData);

  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUp | null>(null);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [hasPurchased, setHasPurchased] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);

  const [isPowerUpFlipped, setIsPowerUpFlipped] = useState<PowerUpMap>({
    Protec: false,
    U2: false,
    Buffett: false,
  });

  const [state, setState] = useReducer(
    (s: PowerUpModalState, a: Partial<PowerUpModalState>) => ({
      ...s,
      ...a,
    }),
    {
      isLoading: false,
      showAlert: false,
      alertHeader: "",
      alertMessage: "",
      hasConfirm: false,
      confirmHandler: () => {},
      cancelHandler: () => {},
      okHandler: undefined,
    }
  );

  const computePowerUpStock = (type: PowerUpType) => {
    switch (type) {
      case "Protec":
        return refreshedUser?.store.protecCount ?? 0;
      case "U2":
        return refreshedUser?.store.griefCount ?? 0;
    }
  };

  const handlePurchasePowerUp = async (type: PowerUpType, count: number) => {
    let price = 0;
    switch (type) {
      case "Protec":
        price = count * powerUps[0].price;
        break;
      case "U2":
        price = count * powerUps[1].price;
    }
    if (price > (refreshedUser?.store.points ?? 0)) {
      setState({
        showAlert: true,
        hasConfirm: false,
        alertHeader: "Ooooops",
        alertMessage:
          "You do not have sufficient coins to complete this purchase. Try to do more challenges :)",
      });
      return;
    }
    setState({ isLoading: true });
    try {
      await purchaseItem({
        powerup: adaptPowerUpType(type),
        count: count,
      });
      const refreshedUserData = await refreshUser();
      setRefreshedUser(refreshedUserData);
      setTimeout(() => {
        setState({ isLoading: false });
      }, 1000);
    } catch (error) {
      setState({
        isLoading: false,
        showAlert: true,
        hasConfirm: false,
        alertHeader: "Ooooops",
        alertMessage: "Our server is taking a break, come back later please :)",
      });
    }
  };

  const handleApplyProtec = async () => {
    setState({
      showAlert: true,
      hasConfirm: true,
      alertHeader: "Are you sure?",
      alertMessage: `Use <strong>1 Protec</strong> for the following challenge: <strong>${challengeData.title}</strong>`,
      confirmHandler: applyProtec,
    });
  };

  const applyProtec = async () => {
    setState({ isLoading: true });
    try {
      await applyPowerUp("Protec", undefined, challengeData.challengeId);
      const refreshedData = await refreshUser();
      setRefreshedUser(refreshedData);
      const refreshedChallengeData = await getChallenge(
        refreshedChallenge.challengeId
      );
      if (refreshedChallengeData) {
        setRefreshedChallenge(refreshedChallengeData);
      }
      await refreshChallengeCallback();
      await getAllChallenges();
      setTimeout(() => {
        setState({
          isLoading: false,
          showAlert: true,
          hasConfirm: false,
          alertHeader: "Success!",
          alertMessage:
            "You have successfully activated <strong>Protec</strong> for this challenge! You are safe from the Wall of Shame :)",
        });
      }, 1000);
    } catch (error) {
      setTimeout(() => {
        setState({
          isLoading: false,
          showAlert: true,
          hasConfirm: false,
          alertHeader: "Ooooops",
          alertMessage:
            "Our server is taking a break, come back later please :)",
        });
      }, 1000);
    }
  };

  const renderAction = (p: PowerUp) => {
    switch (p.type) {
      case "Protec":
        if ((refreshedUser?.store.protecCount ?? 0) > 0) {
          return (
            <IonButton
              color='main-blue'
              expand='block'
              mode='ios'
              style={{
                height: "2rem",
                width: width! < 375 ? "40vw" : "10rem",
              }}
              onClick={handleApplyProtec}
            >
              {refreshedChallenge.participants.accepted.protected.findIndex(
                (p) => p.userId === user?.userId
              ) !== -1
                ? "Activated"
                : "Use"}
            </IonButton>
          );
        } else {
          return (
            <IonButton
              color='main-beige'
              expand='block'
              mode='ios'
              style={{
                height: "2rem",
                width: width! < 375 ? "40vw" : "10rem",
              }}
              onClick={() => {
                setSelectedPowerUp(p);
                setShowPurchaseModal(true);
              }}
            >
              Buy
            </IonButton>
          );
        }
      case "U2":
        if ((refreshedUser?.store.griefCount ?? 0) > 0) {
          return (
            <IonButton
              color='main-blue'
              expand='block'
              mode='ios'
              style={{
                height: "2rem",
                width: width! < 375 ? "40vw" : "10rem",
              }}
            >
              Use
            </IonButton>
          );
        } else {
          return (
            <IonButton
              color='main-beige'
              expand='block'
              mode='ios'
              style={{
                height: "2rem",
                width: width! < 375 ? "40vw" : "10rem",
              }}
              onClick={() => {
                setSelectedPowerUp(p);
                setShowPurchaseModal(true);
              }}
            >
              Buy
            </IonButton>
          );
        }
    }
  };

  return (
    <IonModal
      cssClass='purchase-powerup-modal'
      isOpen={showModal}
      mode='ios'
      onDidDismiss={() => setShowModal(false)}
      backdropDismiss={true}
    >
      <IonHeader className='ion-no-border'>
        <IonToolbar color='main-beige' mode='md' className='store-header'>
          <IonButtons slot='start'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              onClick={() => setShowModal(false)}
            >
              <IonIcon
                icon={close}
                color='white'
                style={{ fontSize: "1.5rem" }}
              />
            </IonButton>
          </IonButtons>
          <IonTitle size='large' color='white'>
            Power-ups
          </IonTitle>
          <IonButton
            className='placeholder-fab ion-align-items-center'
            color='main-beige'
            mode='ios'
            shape='round'
            slot='end'
            style={{
              margin: "0.5rem",
              height: "2.75rem",
            }}
          >
            <img
              src={coin}
              alt=''
              style={{
                width: "1.5rem",
                height: "1.5rem",
                marginRight: "0.5rem",
              }}
            />
            <IonText style={{ fontWeight: "bold" }}>
              {refreshedUser?.store.points ?? 0}
            </IonText>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={false}>
        <IonRow
          style={{
            marginTop: "1rem",
            marginLeft: "0.5rem",
            marginRight: "0.5rem",
          }}
        >
          {powerUps.map((p) => {
            return (
              <IonCol sizeXs='6' sizeSm='4' sizeMd='4' key={p.type}>
                <IonRow className='ion-justify-content-center'>
                  <ReactCardFlip
                    isFlipped={isPowerUpFlipped[p.type]}
                    flipDirection='horizontal'
                  >
                    <div key={`${p}-front`}>
                      <IonCard
                        mode='md'
                        className='ion-no-margin ion-align-items-center'
                        style={{
                          marginLeft: "0.5rem",
                          marginRight: "0.5rem",
                          height: width! < 375 ? "14rem" : "15rem",
                          width: width! < 375 ? "40vw" : "10rem",
                        }}
                      >
                        <IonRow
                          className='ion-justify-content-end'
                          style={{
                            paddingTop: "0.5rem",
                            paddingLeft: "0.5rem",
                            paddingRight: "0.5rem",
                          }}
                        >
                          <IonIcon
                            icon={informationCircle}
                            color='main-beige'
                            style={{ fontSize: "1.33rem" }}
                            onClick={() => {
                              setIsPowerUpFlipped({
                                ...isPowerUpFlipped,
                                [p.type]: true,
                              });
                            }}
                          />
                        </IonRow>
                        <IonRow className='ion-justify-content-center'>
                          <img
                            src={challenge}
                            alt='Challenge'
                            className='store-card-img'
                            style={{
                              width: "75%",
                              height: "75%",
                            }}
                          />
                        </IonRow>
                        <IonRow className='ion-justify-content-center'>
                          <IonText
                            style={{ fontWeight: "bold", fontSize: "1.05rem" }}
                            color='black'
                          >
                            {p.type}
                          </IonText>
                        </IonRow>
                        <IonRow className='ion-justify-content-center'>
                          <IonText
                            color='black'
                            style={{ fontSize: "0.9rem" }}
                          >{`You have ${computePowerUpStock(p.type)}`}</IonText>
                        </IonRow>
                        <IonRow
                          className='ion-justify-content-center ion-align-items-center'
                          style={{ margin: "0.5rem" }}
                        >
                          <img
                            src={coin}
                            alt=''
                            style={{
                              width: "1.5rem",
                              height: "1.5rem",
                              marginRight: "0.5rem",
                            }}
                          />
                          <IonText color='black'>{p.price}</IonText>
                        </IonRow>
                      </IonCard>
                    </div>
                    <div key={`${p}-back`}>
                      <IonCard
                        mode='md'
                        className='ion-no-margin ion-align-items-center'
                        style={{
                          marginLeft: "0.5rem",
                          marginRight: "0.5rem",
                          height: width! < 350 ? "14rem" : "15rem",
                        }}
                      >
                        <IonRow
                          className='ion-justify-content-end'
                          style={{
                            paddingTop: "0.5rem",
                            paddingLeft: "0.5rem",
                            paddingRight: "0.5rem",
                          }}
                        >
                          <IonIcon
                            icon={closeCircle}
                            color='main-beige'
                            style={{ fontSize: "1.33rem" }}
                            onClick={() => {
                              setIsPowerUpFlipped({
                                ...isPowerUpFlipped,
                                [p.type]: false,
                              });
                            }}
                          />
                        </IonRow>

                        <IonRow className='ion-justify-content-center'>
                          <IonText
                            style={{ fontWeight: "bold", fontSize: "1.05rem" }}
                            color='black'
                          >
                            {p.type}
                          </IonText>
                        </IonRow>
                        <IonRow
                          className='ion-justify-content-center'
                          style={{
                            marginBottom: "0.5rem",
                            paddingTop: "0.5rem",
                            paddingLeft: width! < 350 ? "0.5rem" : "0.75rem",
                            paddingRight: width! < 350 ? "0.5rem" : "0.75rem",
                          }}
                        >
                          <IonText
                            color='black'
                            className='ion-text-center'
                            style={{
                              fontSize: width! < 350 ? "0.85rem" : "0.95rem",
                            }}
                          >
                            {p.description}
                          </IonText>
                        </IonRow>
                      </IonCard>
                    </div>
                  </ReactCardFlip>
                </IonRow>
                <IonRow style={{ marginTop: "0.25rem" }}>
                  <IonCol>
                    <IonRow className='ion-justify-content-center'>
                      {renderAction(p)}
                    </IonRow>
                  </IonCol>
                </IonRow>
              </IonCol>
            );
          })}
        </IonRow>
        <PurchasePowerUpModal
          powerUp={selectedPowerUp}
          purchaseCallback={handlePurchasePowerUp}
          hasPurchased={hasPurchased}
          currentCount={
            (selectedPowerUp?.type === "Protec"
              ? refreshedUser?.store.protecCount
              : refreshedUser?.store.griefCount) ?? 0
          }
          showModal={showPurchaseModal}
          setShowModal={setShowPurchaseModal}
        />
        <LoadingSpinner
          loading={state.isLoading}
          message={"Loading"}
          closeLoading={() => {}}
        />
        <Alert
          showAlert={state.showAlert}
          closeAlert={(): void => {
            setState({
              showAlert: false,
            });
          }}
          alertHeader={state.alertHeader}
          alertMessage={state.alertMessage}
          hasConfirm={state.hasConfirm}
          confirmHandler={state.confirmHandler}
          cancelHandler={state.cancelHandler}
          okHandler={state.okHandler}
        />
      </IonContent>
    </IonModal>
  );
};

export default PowerUpModal;
