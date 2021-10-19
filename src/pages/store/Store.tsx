import {
  IonContent,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonPage,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { funnelOutline } from "ionicons/icons";
import { useEffect } from "react";
import { useLocation } from "react-router";
import Container from "../../components/container";
import { showTabs, hideTabs } from "../../utils/TabsUtils";
import "./Store.scss";

const Store: React.FC = () => {
  const location = useLocation();

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
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar color='main-beige' style={{ paddingTop: "0.5rem" }}>
          <IonTitle
            size='large'
            style={{
              paddingBottom: isPlatform("ios") ? "1rem" : 0,
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
        <Container>Coming soon :)</Container>
      </IonContent>
    </IonPage>
  );
};

export default Store;
