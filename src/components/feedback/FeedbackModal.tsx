import {
  IonIcon,
  IonModal,
  IonButton,
  IonButtons,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonInput,
  IonRow,
  IonText,
  IonTextarea,
  IonFooter,
} from "@ionic/react";
import { close } from "ionicons/icons";
import { useReducer, useState } from "react";
import { isValidEmail } from "../../utils/ProfileUtils";
import Alert from "../alert";
import LoadingSpinner from "../loadingSpinner";
import ImageUploader from "react-images-upload";
import imageCompression from "browser-image-compression";
import "./FeedbackModal.scss";

interface FeedbackModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export interface FeedbackModalState {
  email: string;
  description: string;
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
      description: "",
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

  const [image, setImage] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const options = {
    maxSizeMB: 1,
    useWebWorker: true,
  };

  const onDrop = async (files: File[], pictures: string[]) => {
    if (pictures && pictures.length > 0 && files && files.length > 0) {
      const splitted = pictures[0].split(";");
      setImage(splitted[1].slice(5));
      setFile(files[0]);
    } else {
      setImage("");
    }
  };

  return (
    <IonModal
      cssClass='feedback-modal'
      isOpen={showModal}
      onDidDismiss={() => setShowModal(false)}
      backdropDismiss={false}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle>Feedback</IonTitle>
          <IonButtons slot='start'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              color='dark'
              onClick={() => {
                setImage("");
                setShowModal(false);
              }}
            >
              <IonIcon icon={close} size='large' />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <IonGrid style={{ marginTop: "1rem" }}>
          <IonRow className='ion-padding-horizontal ion-padding-bottom'>
            <IonText
              style={{ fontWeight: "bold" }}
              color={
                state.hasError && !isValidEmail(state.email)
                  ? "danger"
                  : "primary"
              }
            >
              Email
            </IonText>
          </IonRow>
          <IonRow className='ion-padding-horizontal'>
            <div
              style={{
                border: "solid 1px #adadad",
                width: "100%",
                borderRadius: "0.5rem",
              }}
            >
              <IonInput
                value={state.email}
                debounce={100}
                type='email'
                placeholder='Enter your email*'
                maxlength={50}
                autoCorrect='on'
                style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
                onIonChange={(event) => {
                  setState({ email: event.detail.value ?? "" });
                }}
              />
            </div>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow
            className='ion-padding-horizontal ion-padding-bottom'
            style={{ marginTop: "1rem" }}
          >
            <IonText
              style={{ fontWeight: "bold" }}
              color={
                state.hasError && state.description.length <= 0
                  ? "danger"
                  : "primary"
              }
            >
              Description
            </IonText>
          </IonRow>
          <IonRow className='ion-padding-horizontal'>
            <div
              style={{
                border: "solid 1px #adadad",
                width: "100%",
                borderRadius: "0.5rem",
              }}
            >
              <IonTextarea
                value={state.description}
                debounce={100}
                rows={4}
                maxlength={200}
                autoCorrect='on'
                placeholder='What did you expect and what happened instead?*'
                style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
                onIonChange={(event) => {
                  setState({ description: event.detail.value ?? "" });
                }}
              />
            </div>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow
            className='ion-padding-horizontal ion-padding-bottom'
            style={{ marginTop: "1rem" }}
          >
            <IonText
              style={{ fontWeight: "bold" }}
              color={
                state.hasError && state.description.length <= 0
                  ? "danger"
                  : "primary"
              }
            >
              Screenshot
            </IonText>
          </IonRow>
          <IonRow className='ion-no-padding'>
            <ImageUploader
              withIcon={false}
              buttonText='&nbsp;&nbsp;&nbsp;Select image&nbsp;&nbsp;&nbsp;'
              buttonStyles={image ? { display: "none" } : undefined}
              onChange={onDrop}
              withPreview={true}
              singleImage={true}
              label={image ? `Selected: ${image}` : "Selected: None"}
              labelStyles={{
                textAlign: "center",
                paddingBottom: "16px",
                fontSize: "16px",
              }}
              imgExtension={[".jpg", ".png", ".gif", "jpeg"]}
              maxFileSize={Infinity}
            />
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonRow
            className='ion-justify-content-around'
            style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
          >
            <IonButton shape='round' color='secondary' mode='ios'>
              <IonText style={{ marginLeft: "1rem", marginRight: "1rem" }}>
                Send
              </IonText>
            </IonButton>
          </IonRow>
        </IonToolbar>
      </IonFooter>
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
