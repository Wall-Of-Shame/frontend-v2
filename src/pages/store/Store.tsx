import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { useEffect } from "react";
import { useLocation } from "react-router";
import Container from "../../components/container";
import { showTabs, hideTabs } from "../../utils/TabsUtils";

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
        <IonToolbar
          style={{
            paddingTop: isPlatform("ios") ? "0.75rem" : 0,
            paddingBottom: isPlatform("ios") ? "0.75rem" : 0,
          }}
        >
          <IonTitle size='large'>Store</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Container>Coming soon :)</Container>
      </IonContent>
    </IonPage>
  );
};

export default Store;
