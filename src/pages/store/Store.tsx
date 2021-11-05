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
} from "@ionic/react";
import { closeCircle, flame, informationCircle } from "ionicons/icons";
import { useEffect, useReducer, useState } from "react";
import { useLocation } from "react-router";
import ReactCardFlip from "react-card-flip";
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
import PurchasePowerUpModal from "../../components/powerUp";
import { useAuth } from "../../contexts/AuthContext";
import { UserData } from "../../interfaces/models/Users";
import LoadingSpinner from "../../components/loadingSpinner";
import Alert from "../../components/alert";
import eggIcon from "../../assets/icons/egg.svg";
import tomatoIcon from "../../assets/icons/tomato.svg";
import poopIcon from "../../assets/icons/poop.svg";
import sooIcon from "../../assets/icons/sooIcon.png";
import benIcon from "../../assets/icons/benIcon.png";
import ProtecImg from "../../assets/powerup/protec.png";
import U2Img from "../../assets/powerup/u2.png";
import CoinModal from "./CoinModal";

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

export interface PowerUpMap {
  [key: string]: boolean;
}

export interface EffectMap {
  [key: string]: boolean;
}

export const powerUps: PowerUp[] = [
  {
    type: "Protec",
    price: 750,
    img: ProtecImg,
    description:
      "Makes you immune to one failure, you're safe from the Wall of Shame this time :)",
  },
  {
    type: "U2",
    price: 500,
    img: U2Img,
    description:
      "Arrow a friend to take the challenge with you. This invitation cannot be rejected :')",
  },
];

export interface Effect {
  icon: string;
  name: string;
  price: number;
  description: string;
}

export const effects: Effect[] = [
  {
    icon: tomatoIcon,
    name: "Tomato",
    price: 0,
    description:
      "This effect is free for all! Let's throw some rotten tomatoes at the burdens on the Wall :)",
  },
  {
    icon: eggIcon,
    name: "Egg",
    price: 250,
    description:
      "We are making this effect free for early birds! Thank you for using Wall of Shame :)",
  },
  {
    icon: poopIcon,
    name: "Poop",
    price: 500,
    description:
      "We are making this effect free for early birds! Thank you for using Wall of Shame :)",
  },
  {
    icon: sooIcon,
    name: "Uncle Soo",
    price: Infinity,
    description:
      "Exclusive effect! Available until 23:59 10 Nov 2021. Throw some Uncle Soos now!",
  },
  {
    icon: benIcon,
    name: "Prof Ben",
    price: Infinity,
    description:
      "Exclusive effect! Available until 23:59 10 Nov 2021. Throw some Prof Bens now!",
  },
];

const Store: React.FC = () => {
  const location = useLocation();
  const { refreshUser } = useAuth();
  const { user, purchaseItem, shouldRefreshUser } = useUser();
  const { width, isDesktop } = useWindowSize();

  const [refreshedUser, setRefreshedUser] = useState<UserData | null>(user);
  const [hasPurchased, setHasPurchased] = useState(false);
  const [tab, setTab] = useState("powerups");
  const [showCoinInfoModal, setShowCoinInfoModal] = useState(false);
  const [showPurchaseModal, setShowPurchaseModal] = useState(false);
  const [selectedPowerUp, setSelectedPowerUp] = useState<PowerUp | null>(null);

  const [isPowerUpFlipped, setIsPowerUpFlipped] = useState<PowerUpMap>({
    Protec: false,
    U2: false,
    Buffett: false,
  });

  const [isEffectFlipped, setIsEffectFlipped] = useState<EffectMap>({
    Tomato: false,
    Egg: false,
    Poop: false,
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

  useEffect(() => {
    refreshState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRefreshUser]);

  const refreshState = async () => {
    const refreshedData = await refreshUser();
    setRefreshedUser(refreshedData);
  };

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
                          src={p.img}
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
                        setHasPurchased(false);
                        setShowPurchaseModal(true);
                      }}
                    >
                      Buy
                    </IonButton>
                  </IonRow>
                </IonCol>
              </IonRow>
            </IonCol>
          );
        })}
      </IonRow>
    );
  };

  const renderEffects = () => {
    return (
      <IonRow
        style={{
          marginTop: "1rem",
          marginLeft: "0.5rem",
          marginRight: "0.5rem",
        }}
      >
        {effects.map((e) => {
          return (
            <IonCol sizeXs='6' sizeSm='4' sizeMd='4' key={e.name}>
              <IonRow className='ion-justify-content-center'>
                <ReactCardFlip
                  isFlipped={isEffectFlipped[e.name]}
                  flipDirection='horizontal'
                >
                  <div key={`${e.name}-front`}>
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
                          icon={
                            e.name === "Uncle Soo" || e.name === "Prof Ben"
                              ? flame
                              : informationCircle
                          }
                          color={
                            e.name === "Uncle Soo" || e.name === "Prof Ben"
                              ? "accent-beige"
                              : "main-beige"
                          }
                          style={{ fontSize: "1.33rem" }}
                          onClick={() => {
                            setIsEffectFlipped({
                              ...isEffectFlipped,
                              [e.name]: true,
                            });
                          }}
                        />
                      </IonRow>
                      <IonRow
                        className='ion-justify-content-center'
                        style={{ marginTop: "0.5rem" }}
                      >
                        <img
                          src={e.icon}
                          alt='Challenge'
                          className='store-card-img'
                          style={{
                            width: "65%",
                            height: "65%",
                          }}
                        />
                      </IonRow>
                      <IonRow className='ion-justify-content-center ion-margin-top'>
                        <IonText
                          style={{ fontWeight: "bold", fontSize: "1.05rem" }}
                          color='black'
                        >
                          {e.name}
                        </IonText>
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
                        <IonText color='black'>{e.price}</IonText>
                      </IonRow>
                    </IonCard>
                  </div>
                  <div key={`${e.name}-back`}>
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
                          color={
                            e.name === "Uncle Soo" || e.name === "Prof Ben"
                              ? "accent-beige"
                              : "main-beige"
                          }
                          style={{ fontSize: "1.33rem" }}
                          onClick={() => {
                            setIsEffectFlipped({
                              ...isEffectFlipped,
                              [e.name]: false,
                            });
                          }}
                        />
                      </IonRow>

                      <IonRow className='ion-justify-content-center'>
                        <IonText
                          style={{ fontWeight: "bold", fontSize: "1.05rem" }}
                          color='black'
                        >
                          {e.name}
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
                        {e.name === "Uncle Soo" && (
                          <IonText
                            color='black'
                            className='ion-text-center'
                            style={{
                              fontSize: width! < 350 ? "0.85rem" : "0.95rem",
                            }}
                          >
                            Exclusive effect! Available until 23:59 10 Nov 2021.
                            Throw some <strong>Uncle Soo</strong>s on the Wall
                            now!
                          </IonText>
                        )}
                        {e.name === "Prof Ben" && (
                          <IonText
                            color='black'
                            className='ion-text-center'
                            style={{
                              fontSize: width! < 350 ? "0.85rem" : "0.95rem",
                            }}
                          >
                            Exclusive effect! Available until 23:59 10 Nov 2021.
                            Throw some <strong>Prof Ben</strong>s on the Wall
                            now!
                          </IonText>
                        )}
                        {e.name !== "Prof Ben" && e.name !== "Uncle Soo" && (
                          <IonText
                            color='black'
                            className='ion-text-center'
                            style={{
                              fontSize: width! < 350 ? "0.85rem" : "0.95rem",
                            }}
                          >
                            {e.description}
                          </IonText>
                        )}
                      </IonRow>
                    </IonCard>
                  </div>
                </ReactCardFlip>
              </IonRow>
              <IonRow style={{ marginTop: "0.25rem" }}>
                <IonCol>
                  <IonRow className='ion-justify-content-center'>
                    <IonButton
                      color='main-blue'
                      expand='block'
                      mode='ios'
                      disabled
                      style={{
                        height: "2rem",
                        width: width! < 375 ? "40vw" : "10rem",
                      }}
                    >
                      Unlocked
                    </IonButton>
                  </IonRow>
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
              fontSize: isDesktop ? "1.5rem" : "2rem",
            }}
          >
            Store
          </IonTitle>
          <IonRow
            className='placeholder-fab ion-align-items-center'
            color='main-beige'
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
            <IonText style={{ fontWeight: "bold", marginRight: "0.5rem" }}>
              {refreshedUser?.store.points ?? 0}
            </IonText>
            <IonIcon
              icon={informationCircle}
              style={{ fontSize: "1.5rem", marginRight: "0.5rem" }}
              onClick={() => setShowCoinInfoModal(true)}
            />
          </IonRow>
        </IonToolbar>
        {!isDesktop && <div className='store-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
        <IonRow
          className='ion-justify-content-start ion-padding-horizontal'
          style={{ marginTop: isDesktop ? "1.5rem" : "2rem" }}
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
        {tab === "powerups" ? renderPowerUps() : renderEffects()}
        <CoinModal
          showModal={showCoinInfoModal}
          setShowModal={setShowCoinInfoModal}
        />
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
    </IonPage>
  );
};

export default Store;
