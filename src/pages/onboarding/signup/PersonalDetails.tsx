import {
  IonButton,
  IonContent,
  IonFab,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  IonToolbar,
} from "@ionic/react";
import "./SignUpModal.scss";
import { arrowBackOutline } from "ionicons/icons";
import Container from "../../../components/container";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { isValidEmail, isValidPassword } from "../../../utils/ProfileUtils";
import "../../../theme/transitions.scss";
import { SignUpModalState } from "./SignUpModal";
import { useAuth } from "../../../contexts/AuthContext";

interface PersonalDetailsProps {
  state: SignUpModalState;
  setState: React.Dispatch<Partial<SignUpModalState>>;
  setShowModal: (showModal: boolean) => void;
  nextPage: () => void;
}

const PersonalDetails: React.FC<PersonalDetailsProps> = (
  props: PersonalDetailsProps
) => {
  const { state, setState, setShowModal, nextPage } = props;
  const { signup } = useAuth();

  const verifyInputs = (): boolean => {
    return (
      isValidEmail(state.email) &&
      isValidPassword(state.password) &&
      state.password === state.passwordConfirmation
    );
  };

  const handleSubmit = () => {
    setState({ isLoading: true });
    signup(state.email, state.password)
      .then(() => {
        setState({ isLoading: false });
        nextPage();
      })
      .catch((error) => {
        setState({
          isLoading: false,
          showAlert: true,
          alertHeader: "Ooooops",
          alertMessage:
            "This email is already in use, maybe try another one instead?",
        });
      });
  };

  return (
    <IonContent fullscreen>
      <IonFab
        horizontal="start"
        vertical="top"
        style={{ marginTop: "1rem", marginLeft: "1rem" }}
      >
        <IonIcon
          icon={arrowBackOutline}
          size="large"
          onClick={() => setShowModal(false)}
        />
      </IonFab>
      <Container>
        <IonRow slot="start">
          <IonText
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              marginLeft: "1rem",
            }}
          >
            Create Account
          </IonText>
        </IonRow>
        <IonList className="ion-padding-vertical">
          <IonItem lines="full">
            <IonLabel
              color={
                state.email !== "" && !isValidEmail(state.email)
                  ? "danger"
                  : "primary"
              }
              position="floating"
            >
              Email*
            </IonLabel>
            <IonInput
              name="name"
              type="email"
              value={state.email}
              required
              onIonChange={(event: CustomEvent) => {
                setState({ email: event.detail.value });
              }}
            />
          </IonItem>
          <IonItem lines="full">
            <IonLabel color="primary" position="floating">
              Password*
            </IonLabel>
            <IonInput
              name="name"
              type="password"
              value={state.password}
              required
              onIonChange={(event: CustomEvent) => {
                setState({ password: event.detail.value });
              }}
            />
          </IonItem>
          <IonItem lines="full">
            <IonLabel color="primary" position="floating">
              Confirm Password*
            </IonLabel>
            <IonInput
              name="name"
              type="password"
              value={state.passwordConfirmation}
              required
              onIonChange={(event: CustomEvent) => {
                setState({ passwordConfirmation: event.detail.value });
              }}
            />
          </IonItem>
        </IonList>
        <IonButton
          mode="ios"
          fill="solid"
          color="main-blue"
          shape="round"
          className="ion-padding-horizontal"
          style={{
            display: "flex",
            margin: "1rem",
          }}
          disabled={!verifyInputs()}
          onClick={handleSubmit}
        >
          <IonText
            color="white"
            style={{ marginLeft: "2rem", marginRight: "2rem" }}
          >
            Next
          </IonText>
        </IonButton>
      </Container>
    </IonContent>
  );
};

export default PersonalDetails;
