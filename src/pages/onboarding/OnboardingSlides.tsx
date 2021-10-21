import {
  IonButton,
  IonCol,
  IonIcon,
  IonRow,
  IonSlide,
  IonSlides,
  IonText,
} from "@ionic/react";
import React from "react";
import { logoGoogle, logoFacebook } from "ionicons/icons";

import "./Onboarding.scss";
import { Link } from "react-router-dom";
import Container from "../../components/container/Container";
import "./OnboardingSlides.scss";
import { useAuth } from "../../contexts/AuthContext";
import { OnboardingState } from "./Onboarding";

import challenge from "../../assets/onboarding/challenge.png";
import invite from "../../assets/onboarding/invite.png";
import highground from "../../assets/onboarding/highground.png";

interface OnboardingSlidesProps {
  initSwiper: (this: any) => Promise<void>;
  setShowSignUpModal: (showModal: boolean) => void;
  setShowLoginModal: (showModal: boolean) => void;
  swipeNext: () => void;
  swiperCallback: () => void;
  state: OnboardingState;
  setState: React.Dispatch<Partial<OnboardingState>>;
}

const OnboardingSlides: React.FC<OnboardingSlidesProps> = ({
  initSwiper,
  setShowSignUpModal,
  setShowLoginModal,
  swipeNext,
  swiperCallback,
  state,
  setState,
}) => {
  const { continueWithGoogle, continueWithFacebook } = useAuth();

  return (
    <IonSlides
      // pager={true}
      className="slides"
      onIonSlidesDidLoad={initSwiper}
      onIonSlideDidChange={swiperCallback}
    >
      <IonSlide className="slide beige">
        <Container>
          <img
            src={challenge}
            alt="challenge"
            style={{ marginTop: "0rem", marginBottom: "1rem" }}
          />
          <h1 style={{ marginBottom: "1.5rem" }}>Create a Challenge</h1>
          <p>
            Can’t stop procrastinating?
            <br />
            Create a challenge and set a deadline for your task!
          </p>
          <IonRow
            className="ion-justify-content-center"
            style={{ marginTop: "2rem" }}
          >
            <IonButton
              mode="ios"
              color="light"
              shape="round"
              fill="solid"
              onClick={swipeNext}
              style={{
                display: "flex",
                flex: 1,
                marginLeft: "2rem",
                marginRight: "2rem",
              }}
            >
              <IonText
                color="accent-beige"
                style={{
                  fontWeight: "bold",
                  marginLeft: "2rem",
                  marginRight: "2rem",
                }}
              >
                Next
              </IonText>
            </IonButton>
          </IonRow>
        </Container>
      </IonSlide>

      <IonSlide className="slide blue">
        <Container>
          <img
            src={invite}
            alt="invite"
            className="onboarding-image"
            style={{ marginTop: "0rem", marginBottom: "1rem" }}
          />
          <h1 style={{ marginBottom: "1.5rem" }}>Invite your friends</h1>
          <p>Why suffer alone? Invite your friends and complete the challenge together!</p>
          <IonRow
            className="ion-justify-content-center"
            style={{ marginTop: "2rem" }}
          >
            <IonButton
              mode="ios"
              color="light"
              shape="round"
              fill="solid"
              onClick={swipeNext}
              style={{
                display: "flex",
                flex: 1,
                marginLeft: "2rem",
                marginRight: "2rem",
              }}
            >
              <IonText
                color="accent-blue"
                style={{
                  fontWeight: "bold",
                  marginLeft: "2rem",
                  marginRight: "2rem",
                }}
              >
                Next
              </IonText>
            </IonButton>
          </IonRow>
        </Container>
      </IonSlide>

      <IonSlide className="slide yellow">
        <Container>
          <img
            src={highground}
            alt="highground"
            style={{ marginTop: "0rem", marginBottom: "1rem" }}
          />
          <h1 style={{ marginBottom: "1.5rem" }}>To the WALL OF SHAME</h1>
          <p>
            Losers of the challenge get thrown to the wall, where their names
            will be for all to see!
          </p>
          <IonRow
            className="ion-justify-content-center"
            style={{ marginTop: "2rem" }}
          >
            <IonButton
              mode="ios"
              color="light"
              shape="round"
              fill="solid"
              onClick={swipeNext}
              style={{
                display: "flex",
                flex: 1,
                marginLeft: "2rem",
                marginRight: "2rem",
              }}
            >
              <IonText
                color="accent-yellow"
                style={{
                  fontWeight: "bold",
                  marginLeft: "2rem",
                  marginRight: "2rem",
                }}
              >
                Next
              </IonText>
            </IonButton>
          </IonRow>
        </Container>
      </IonSlide>

      <IonSlide className="slide beige">
        <Container>
          {/* <img
            src={highground}
            alt="highground"
            style={{ marginTop: "0rem", marginBottom: "0rem" }}
          /> */}
          <h1 id="wall-of-shame-header">WALL OF SHAME</h1>
          <h5 style={{ marginTop: "1rem", marginBottom: "3rem" }}>
            Take the moral highground.
          </h5>
          <IonRow className="ion-justify-content-center ion-no-padding">
            <IonCol sizeXs="12" sizeSm="8" sizeMd="6" sizeLg="4" sizeXl="3">
              <IonButton
                mode="ios"
                expand="block"
                fill="solid"
                shape="round"
                color="light"
                style={{ marginLeft: "1rem", marginRight: "1rem" }}
                onClick={async () => {
                  setState({ isLoading: true });
                  continueWithGoogle(() => {})
                    .then(() => {
                      setState({ isLoading: false });
                      window.location.reload();
                    })
                    .catch((error) => {
                      console.log(error);
                      setState({
                        isLoading: false,
                        hasConfirm: false,
                        showAlert: true,
                        alertHeader: "Ooooops",
                        alertMessage:
                          "Our server is taking a break, come back later please :)",
                      });
                    });
                }}
              >
                <IonIcon color="main-yellow" src={logoGoogle} />
                <IonText
                  color="main-yellow"
                  style={{ fontWeight: "bold", marginLeft: 10 }}
                  id="login-options-button-text"
                >
                  &nbsp;&nbsp;Continue with Google
                </IonText>
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center ion-no-padding">
            <IonCol sizeXs="12" sizeSm="8" sizeMd="6" sizeLg="4" sizeXl="3">
              <IonButton
                mode="ios"
                expand="block"
                fill="solid"
                shape="round"
                color="light"
                style={{ marginLeft: "1rem", marginRight: "1rem" }}
                onClick={async () => {
                  setState({ isLoading: true });
                  continueWithFacebook(() => {})
                    .then(() => {
                      setState({ isLoading: false });
                      window.location.reload();
                    })
                    .catch((error) => {
                      console.log(error);
                      setState({
                        isLoading: false,
                        hasConfirm: false,
                        showAlert: true,
                        alertHeader: "Ooooops",
                        alertMessage:
                          "Our server is taking a break, come back later please :)",
                      });
                    });
                }}
              >
                <IonIcon color="accent-beige" src={logoFacebook} />
                <IonText
                  color="accent-beige"
                  style={{ fontWeight: "bold", marginLeft: 10 }}
                  id="login-options-button-text"
                >
                  &nbsp;&nbsp;Continue with Facebook
                </IonText>
              </IonButton>
            </IonCol>
          </IonRow>
          <div style={{ margin: "1rem" }}>
            <h4 className="separator">
              <span>or</span>
            </h4>
            {/* <p>or</p> */}
          </div>
          <IonRow
            className="ion-justify-content-center ion-no-padding"
            style={{ marginBottom: "1rem" }}
          >
            <IonCol sizeXs="12" sizeSm="8" sizeMd="6" sizeLg="4" sizeXl="3">
              <IonButton
                mode="ios"
                expand="block"
                fill="solid"
                color="light"
                shape="round"
                style={{ marginLeft: "1rem", marginRight: "1rem" }}
                onClick={() => setShowSignUpModal(true)}
              >
                <IonText
                  color="accent-blue"
                  style={{ fontWeight: "bold" }}
                  id="login-options-button-text"
                >
                  Create a new account
                </IonText>
              </IonButton>
            </IonCol>
          </IonRow>
          <IonRow className="ion-justify-content-center">
            <IonText
              className="ion-text-center"
              color="light"
              id="login-options-button-text"
            >
              Have an account?&nbsp;
              <Link
                to={"#"}
                color="light"
                style={{ textDecoration: "none" }}
                onClick={() => {
                  setShowLoginModal(true);
                }}
              >
                <IonText color="light" style={{ fontWeight: "bold" }}>
                  Log in
                </IonText>
              </Link>
            </IonText>
          </IonRow>
        </Container>
      </IonSlide>
    </IonSlides>
  );
};

export default OnboardingSlides;
