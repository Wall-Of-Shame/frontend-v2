import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { parseISO } from "date-fns";
import { funnelOutline } from "ionicons/icons";
import { format } from "path";
import { useEffect } from "react";
import { useLocation } from "react-router";
import AvatarImg from "../../components/avatar";
import Container from "../../components/container";
import { Avatar } from "../../interfaces/models/Users";
import { showTabs, hideTabs } from "../../utils/TabsUtils";
import { useWindowSize } from "../../utils/WindowUtils";
import "./Explore.scss";

const Explore: React.FC = () => {
  const location = useLocation();
  const { isDesktop } = useWindowSize();

  const renderChallenges = () => {
    return (
      <Container>
        <div>
          list of challenges here
        </div>
      </Container>
    )
  }

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
      <IonHeader className="ion-no-border">
        <IonToolbar
          color="main-blue"
          mode="md"
          className="explore-header"
          style={{ paddingTop: "0.5rem", paddingBottom: "0.25rem" }}
        >
          <IonTitle
            size="large"
            color="white"
            style={{
              fontWeight: "800",
              fontSize: isDesktop ? "1.5rem" : "2rem",
            }}
          >
            Explore
          </IonTitle>
          <IonFabButton
            className="placeholder-fab"
            color="clear"
            mode="ios"
            slot="end"
            disabled
            style={{
              margin: "0.5rem",
              width: "2.75rem",
              height: "2.75rem",
            }}
          >
            <IonIcon
              icon={funnelOutline}
              color="main-blue"
              style={{ fontSize: "1.5rem" }}
            />
          </IonFabButton>
        </IonToolbar>
        {!isDesktop && <div className='explore-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid style={{ marginTop: "2rem" }}>
          <IonRow className="ion-padding ion-align-items-center">
            <IonText style={{ fontWeight: "bold" }} color="primary">
              Featured challenges
            </IonText>
          </IonRow>

          <IonRow className="ion-padding ion-align-items-center">
            <IonText style={{ fontWeight: "bold" }} color="primary">
              Trending challenges
            </IonText>
          </IonRow>
          {renderChallenges()}
        </IonGrid>
        {/* <Container>Coming soon :)</Container> */}
      </IonContent>
    </IonPage>
  );
};

export default Explore;
