import {
  IonIcon,
  IonModal,
  IonButton,
  IonButtons,
  IonHeader,
  IonToolbar,
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { useReducer } from "react";
import Alert from "../alert";
import LoadingSpinner from "../loadingSpinner";

interface FeedbackModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export interface FeedbackModalState {
  email: string;
  password: string;
  hasError: boolean;
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

const FeedbackModal: React.FC<FeedbackModalProps> = (
  props: FeedbackModalProps
) => {
  const { showModal, setShowModal } = props;

  const [state, setState] = useReducer(
    (s: FeedbackModalState, a: Partial<FeedbackModalState>) => ({
      ...s,
      ...a,
    }),
    {
      email: "",
      password: "",
      hasError: false,
      isLoading: false,
      showAlert: false,
      alertHeader: "",
      alertMessage: "",
      hasConfirm: false,
      confirmHandler: () => {},
      cancelHandler: () => {},
      okHandler: undefined,
    }
  );

  return (
    <IonModal
      isOpen={showModal}
      onDidDismiss={() => setShowModal(false)}
      backdropDismiss={false}
    >
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              color='dark'
              onClick={() => {
                setShowModal(false);
              }}
            >
              <IonIcon icon={arrowBackOutline} size='large' />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <LoadingSpinner
        loading={state.isLoading}
        message={"Loading"}
        closeLoading={() => {}}
      />
      <Alert
        showAlert={state.showAlert}
        closeAlert={(): void => {
          setState({
            showAlert: false,
          });
        }}
        alertHeader={state.alertHeader}
        alertMessage={state.alertMessage}
        hasConfirm={state.hasConfirm}
        confirmHandler={state.confirmHandler}
        cancelHandler={state.cancelHandler}
        okHandler={state.okHandler}
      />
    </IonModal>
  );
};

export default FeedbackModal;
