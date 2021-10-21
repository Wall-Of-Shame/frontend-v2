import {
  IonButton,
  IonContent,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { funnelOutline } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useLocation } from "react-router";
import Container from "../../components/container";
import { showTabs, hideTabs } from "../../utils/TabsUtils";
import "./Store.scss";

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
          <IonFabButton
            className='placeholder-fab'
            color='main-beige'
            mode='ios'
            slot='end'
            disabled
            style={{
              margin: "0.5rem",
              width: "2.75rem",
              height: "2.75rem",
            }}
          >
            <IonIcon
              icon={funnelOutline}
              color='main-beige'
              style={{ fontSize: "1.5rem" }}
            />
          </IonFabButton>
        </IonToolbar>
        {!isPlatform("desktop") && <div className='store-header-curve' />}
      </IonHeader>
      <IonContent fullscreen>
        <IonRow
          className='ion-justify-content-start ion-padding'
          style={{ marginTop: "1rem", marginBottom: "1.5rem" }}
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
      </IonContent>
    </IonPage>
  );
};

export default Store;
