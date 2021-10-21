import {
  IonButton,
  IonContent,
  IonFab,
  IonIcon,
  IonRow,
  IonText,
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { Link } from "react-router-dom";
import Container from "../../../components/container";
import { useAuth } from "../../../contexts/AuthContext";
import { SignUpModalState } from "./SignUpModal";

interface EmailVerificationProps {
  state: SignUpModalState;
  setState: React.Dispatch<Partial<SignUpModalState>>;
  nextPage: () => void;
  prevPage: () => void;
}

const EmailVerification: React.FC<EmailVerificationProps> = (
  props: EmailVerificationProps
) => {
  const { state, setState, nextPage, prevPage } = props;
  const { getFirebaseUser, refreshFirebaseUser, resendVerificationEmail } =
    useAuth();

  const handleContinue = async () => {
    setState({ isLoading: true });
    refreshFirebaseUser().then(() => {
      setState({ isLoading: false });
      const user = getFirebaseUser();
      console.log(user);
      if (user?.emailVerified) {
        nextPage();
      } else {
        setState({
          isLoading: false,
          showAlert: true,
          alertHeader: "Ooooops",
          alertMessage:
            "Seems like you have not verified your email 😅, maybe check your inbox again?",
        });
      }
    });
  };

  const handleResendEmail = async () => {
    setState({ isLoading: true });
    resendVerificationEmail().then(() => {
      setState({ isLoading: false });
    });
  };

  return (
    <IonContent fullscreen scrollY={false}>
      <IonFab
        horizontal='start'
        vertical='top'
        style={{ marginTop: "1rem", marginLeft: "1rem" }}
      >
        <IonIcon icon={arrowBackOutline} size='large' onClick={prevPage} />
      </IonFab>
      <Container>
        <IonRow slot='start' style={{ marginBottom: "2rem" }}>
          <IonText
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              marginLeft: "1rem",
              marginRight: "1rem",
            }}
          >
            Welcome!
          </IonText>
        </IonRow>
        <IonRow
          slot='start'
          style={{ textAlign: "left", marginBottom: "1rem" }}
        >
          <IonText
            style={{
              fontSize: "17px",
              marginLeft: "1rem",
              marginRight: "1rem",
            }}
          >
            We have sent a verification email to{" "}
            <IonText style={{ fontWeight: "bold" }}>{state.email}</IonText>
          </IonText>
        </IonRow>
        <IonRow slot='start' style={{ textAlign: "left" }}>
          <IonText
            style={{
              fontSize: "17px",
              marginLeft: "1rem",
              marginRight: "1rem",
            }}
          >
            Click on the link to complete your registration
          </IonText>
        </IonRow>
        <IonButton
          fill='solid'
          shape='round'
          color='main-blue'
          className='ion-padding-horizontal'
          style={{
            display: "flex",
            margin: "1rem",
            marginTop: "4rem",
          }}
          onClick={handleContinue}
        >
          <IonText
            color='white'
            style={{ marginLeft: "2rem", marginRight: "2rem" }}
          >
            Continue
          </IonText>
        </IonButton>
        <IonRow
          class='ion-justify-content-center'
          style={{ marginTop: "2rem" }}
        >
          <IonText class='ion-text-center' color='medium' style={{}}>
            Did not receive the email?&nbsp;
            <Link
              to={"#"}
              style={{ textDecoration: "none" }}
              onClick={handleResendEmail}
            >
              <IonText style={{ fontWeight: "bold" }}>Resend</IonText>
            </Link>
          </IonText>
        </IonRow>
      </Container>
    </IonContent>
  );
};

export default EmailVerification;
