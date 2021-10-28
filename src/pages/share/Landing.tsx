import React, { useEffect } from "react";
import { IonPage, IonContent } from "@ionic/react";
import { useHistory } from "react-router";
import Container from "../../components/container";

const Landing: React.FC = () => {
  const history = useHistory();

  useEffect(() => {
    const params = window.location.pathname.split("link=");
    const shareLink = params.length > 1 ? params[1] : "";
    if (shareLink !== "") {
      window.localStorage.setItem("share", shareLink);
    } else {
      window.localStorage.removeItem("share");
    }
    history.replace("/");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage style={{ background: "var(--ion-color-main-beige)" }}>
      <IonContent fullscreen>
        <Container>
          <h1 id='wall-of-shame-header'>WALL OF SHAME</h1>
          <h5 style={{ marginTop: "1rem", marginBottom: "3rem" }}>
            Take the moral highground.
          </h5>
        </Container>
      </IonContent>
    </IonPage>
  );
};

export default Landing;
