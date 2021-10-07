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
      <IonHeader className={isPlatform("ios") ? "ion-no-border" : ""}>
        <IonToolbar>
          <IonTitle>Store</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader
          collapse='condense'
          className={isPlatform("ios") ? "ion-no-border" : ""}
        >
          <IonToolbar>
            <IonTitle size='large'>Store</IonTitle>
          </IonToolbar>
        </IonHeader>
        <Container>Coming soon :)</Container>
      </IonContent>
    </IonPage>
  );
};

export default Store;