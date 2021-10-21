import {
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { closeCircle, informationCircle } from "ionicons/icons";
import { useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router";
import ReactCardFlip from "react-card-flip";
import challenge from "../../assets/onboarding/challenge.png";
import coin from "../../assets/icons/coin.png";
import { showTabs, hideTabs } from "../../utils/TabsUtils";
import "./Store.scss";
import { useUser } from "../../contexts/UserContext";
import { useWindowSize } from "../../utils/WindowUtils";

import {
  PowerUp,
  PowerUpPostType,
  PowerUpType,
} from "../../interfaces/models/Store";
import PurchasePowerUpModal from "./powerUp";
import { useAuth } from "../../contexts/AuthContext";
import { UserData } from "../../interfaces/models/Users";
import LoadingSpinner from "../../components/loadingSpinner";
import Alert from "../../components/alert";
import Container from "../../components/container";

interface StoreState {
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

interface PowerUpMap {
  [key: string]: boolean;
}

const powerUps: PowerUp[] = [
  {
    type: "Protec",
    price: 750,
    description:
      "Makes you immune to one failure, you're safe from the Wall of Shame this time :)",
  },
  {
    type: "U2",
    price: 500,
    description:
      "Arrow a friend to take the challenge with you. This invitation cannot be rejected :')",
  },
];

const Store: React.FC = () => {
  const location = useLocation();
  const { refreshUser } = useAuth();
  const { user, purchaseItem } = useUser();
  const { width } = useWindowSize();

  const [refreshedUser, setRefreshedUser] = useState<UserData | null>(user);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [tab, setTab] = useState("powerups");
  const [showModal, setShowModal] = useState(false);
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUp | null>(null);

  const [isPowerUpFlipped, setIsPowerUpFlipped] = useState<PowerUpMap>({
    Protec: false,
    U2: false,
    Buffett: false,
  });

  const [state, setState] = useReducer(
    (s: StoreState, a: Partial<StoreState>) => ({
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

  useEffect(() => {
    if (
      location.pathname === "/challenges" ||
      location.pathname === "/explore" ||
      location.pathname === "/wall-of-shame" ||
      location.pathname === "/store" ||
      location.pathname === "/profile"
    ) {
      showTabs();
    } else {
      hideTabs();
    }
  }, [location.pathname]);

  const computePowerUpStock = (type: PowerUpType) => {
    switch (type) {
      case "Protec":
        return refreshedUser?.store.protecCount ?? 0;
      case "U2":
        return refreshedUser?.store.griefCount ?? 0;
    }
  };

  const adaptPowerUpType = (type: PowerUpType): PowerUpPostType => {
    switch (type) {
      case "Protec":
        return "PROTEC";
      case "U2":
        return "GRIEF";
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
      const refreshedData = await refreshUser();
      setRefreshedUser(refreshedData);
      setTimeout(() => {
        setState({ isLoading: false });
        setHasPurchased(true);
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

  const renderPowerUps = () => {
    return (
      <IonRow
        style={{
          marginTop: "1rem",
          marginLeft: "0.5rem",
          marginRight: "0.5rem",
        }}
      >
        {powerUps.map((p) => {
          return (
            <IonCol sizeXs='6' sizeSm='6' sizeMd='4' key={p.type}>
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
              <IonRow className='ion-justify-content-center'>
                <IonCol>
                  <IonButton
                    color='main-beige'
                    expand='block'
                    mode='ios'
                    style={{ height: "2rem" }}
                    onClick={() => {
                      setSelectedPowerUp(p);
                      setHasPurchased(false);
                      setShowModal(true);
                    }}
                  >
                    Buy
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonCol>
          );
        })}
      </IonRow>
    );
  };

  return (
    <IonPage style={{ background: "#ffffff" }}>
      <IonHeader className='ion-no-border'>
        <IonToolbar
          color='main-beige'
          mode='md'
          className='store-header'
          style={{ paddingTop: "0.5rem", paddingBottom: "0.25rem" }}
        >
          <IonTitle
            size='large'
            color='white'
            style={{
              fontWeight: "800",
              fontSize:
                isPlatform("desktop") ||
                isPlatform("tablet") ||
                isPlatform("ipad")
                  ? "1.5rem"
                  : "2rem",
            }}
          >
            Store
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
        {!(
          isPlatform("desktop") ||
          isPlatform("tablet") ||
          isPlatform("ipad")
        ) && <div className='store-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
        <IonRow
          className='ion-justify-content-start ion-padding-horizontal'
          style={{ marginTop: isPlatform("desktop") ? "1.5rem" : "2rem" }}
        >
          <IonButton
            shape='round'
            mode='ios'
            fill='solid'
            color={tab === "powerups" ? "main-beige" : "light"}
            onClick={() => setTab("powerups")}
          >
            <IonText style={{ fontWeight: "bold" }}>Power-ups</IonText>
          </IonButton>
          <IonButton
            shape='round'
            mode='ios'
            fill='solid'
            color={tab === "effects" ? "main-beige" : "light"}
            onClick={() => setTab("effects")}
          >
            <IonText style={{ fontWeight: "bold" }}>Effects</IonText>
          </IonButton>
        </IonRow>
        {tab === "powerups" ? (
          renderPowerUps()
        ) : (
          <Container>Coming soon :)</Container>
        )}
        <PurchasePowerUpModal
          powerUp={selectedPowerUp}
          purchaseCallback={handlePurchasePowerUp}
          hasPurchased={hasPurchased}
          currentCount={
            (selectedPowerUp?.type === "Protec"
              ? refreshedUser?.store.protecCount
              : refreshedUser?.store.griefCount) ?? 0
          }
          showModal={showModal}
          setShowModal={setShowModal}
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
    </IonPage>
  );
};

export default Store;
