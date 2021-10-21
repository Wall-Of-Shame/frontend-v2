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
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import ReactCardFlip from "react-card-flip";
import challenge from "../../assets/onboarding/challenge.png";
import coin from "../../assets/icons/coin.png";
import { showTabs, hideTabs } from "../../utils/TabsUtils";
import "./Store.scss";
import { useUser } from "../../contexts/UserContext";
import { useWindowSize } from "../../utils/WindowUtils";

interface PowerUp {
  type: "Protec" | "U2";
  price: number;
  description: string;
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
  const { user } = useUser();
  const { width } = useWindowSize();

  const [tab, setTab] = useState("powerups");

  const [isPowerUpFlipped, setIsPowerUpFlipped] = useState<PowerUpMap>({
    Protec: false,
    U2: false,
    Buffett: false,
  });

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

  return (
    <IonPage style={{ background: "#ffffff" }}>
      <IonHeader className='ion-no-border'>
        <IonToolbar color='main-beige' style={{ paddingTop: "0.5rem" }}>
          <IonTitle
            size='large'
            style={{
              paddingBottom: isPlatform("ios") ? "0.5rem" : 0,
            }}
          >
            Store
          </IonTitle>
          <IonButton
            className='placeholder-fab ion-align-items-center ion-no-padding'
            color='main-beige'
            mode='ios'
            slot='end'
            style={{
              margin: "0.5rem",
              width: "5.5rem",
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
              {user?.store.points ?? 0}
            </IonText>
          </IonButton>
        </IonToolbar>
        {!isPlatform("desktop") && <div className='store-header-curve' />}
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
                        >{`You have 0`}</IonText>
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
                        <IonText color='black'>750</IonText>
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
                    >
                      Buy
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonCol>
            );
          })}
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default Store;
