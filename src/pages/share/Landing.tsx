import React, { useEffect } from "react";
import { IonPage, IonContent } from "@ionic/react";
import { useUser } from "../../contexts/UserContext";

const Landing: React.FC = () => {
  const user = useUser();

  useEffect(() => {
    const params = window.location.pathname.split("link/");
    const shareLink = params.length > 1 ? params[1] : "";
    if (shareLink !== "") {
      window.localStorage.setItem("share", shareLink);
    } else {
      window.localStorage.removeItem("share");
    }
    if (user.user) {
      window.location.href = "challenges";
    } else {
      window.location.href = "onboarding";
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage style={{ background: "var(--ion-color-main-beige)" }}>
      <IonContent fullscreen></IonContent>
    </IonPage>
  );
};

export default Landing;
