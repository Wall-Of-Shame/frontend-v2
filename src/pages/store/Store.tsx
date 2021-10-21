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
import { informationCircle } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import challenge from "../../assets/onboarding/challenge.png";
import coin from "../../assets/icons/lucky.png";
import { showTabs, hideTabs } from "../../utils/TabsUtils";
import "./Store.scss";

const powerUps = ["Protec", "U2", "Double"];

const Store: React.FC = () => {
  const location = useLocation();

  const [tab, setTab] = useState("powerups");

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
            <IonText style={{ fontWeight: "bold" }}>1342</IonText>
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
        <IonRow>
          {powerUps.map((p) => {
            return (
              <IonCol sizeXs='6' sizeSm='6' sizeMd='4'>
                <IonCard
                  mode='ios'
                  className='ion-no-margin'
                  style={{
                    marginTop: "1rem",
                    marginLeft: "1rem",
                    marginRight: "1rem",
                    marginBottom: "0.25rem",
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
                      {p}
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
                <IonRow
                  className='ion-justify-content-center'
                  style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
                >
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
