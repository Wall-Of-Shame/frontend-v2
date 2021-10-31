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
import { useUser } from "../../contexts/UserContext";

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
  const { sendFeedback } = useUser();

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
    maxSizeMB: 0.3,
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

  const validateInputs = (): boolean => {
    return isValidEmail(state.email) && state.description.length > 0;
  };

  const handleSend = async () => {
    setState({ isLoading: true });

    try {
      const compressedFile = await imageCompression(file!, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = async () => {
        if (reader.result && typeof reader.result === "string") {
          await sendFeedback(state.email, state.description, reader.result);
          setState({
            isLoading: false,
            showAlert: true,
            alertHeader: "Success",
            alertMessage: "Your feedback has been sent successfully",
            hasConfirm: false,
          });
        } else {
          throw new Error("Please re-upload your image file!");
        }
      };
    } catch (error) {
      setState({
        isLoading: false,
        showAlert: true,
        hasConfirm: false,
        alertHeader: "Oooops",
        alertMessage: "Our server is taking a break, come back later please :)",
      });
    }
  };

  return (
    <IonModal
      mode='ios'
      isOpen={showModal}
      onDidDismiss={() => setShowModal(false)}
      backdropDismiss={true}
    >
      <IonHeader className='ion-no-border'>
        <IonToolbar color='main-blue' mode='md' className='store-header'>
          <IonButtons slot='start'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              onClick={() => {
                setImage("");
                setShowModal(false);
              }}
            >
              <IonIcon
                icon={close}
                color='white'
                style={{ fontSize: "1.5rem" }}
              />
            </IonButton>
          </IonButtons>
          <IonTitle size='large' color='white'>
            Feedback
          </IonTitle>
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
                width: "100%",
                borderRadius: "0.5rem",
                background: "#ffffff",
                paddingLeft: "0.75rem",
                boxShadow: "rgba(149, 149, 149, 0.2) 0px 2px 10px 0px",
              }}
            >
              <IonInput
                value={state.email}
                debounce={100}
                type='email'
                placeholder='Enter your email*'
                autoCorrect='on'
                onIonChange={(event) => {
                  setState({ email: event.detail.value ?? "" });
                }}
              />
            </div>
          </IonRow>
          <IonRow
            className='ion-padding-horizontal ion-justify-content-end'
            style={{ marginTop: "0.5rem" }}
          >
            <IonText style={{ fontSize: "14px", color: "#adadad" }}>
              {`${state.email.length}/50`}
            </IonText>
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
                width: "100%",
                borderRadius: "0.5rem",
                background: "#ffffff",
                paddingLeft: "0.75rem",
                boxShadow: "rgba(149, 149, 149, 0.2) 0px 2px 10px 0px",
              }}
            >
              <IonTextarea
                value={state.description}
                debounce={100}
                rows={4}
                maxlength={200}
                autoCorrect='on'
                placeholder='What did you expect and what happened instead?*'
                onIonChange={(event) => {
                  setState({ description: event.detail.value ?? "" });
                }}
              />
            </div>
          </IonRow>
          <IonRow
            className='ion-padding-horizontal ion-justify-content-end'
            style={{ marginTop: "0.5rem" }}
          >
            <IonText style={{ fontSize: "14px", color: "#adadad" }}>
              {`${state.description.length}/200`}
            </IonText>
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
      </IonContent>
      <IonFooter>
        <IonToolbar>
          <IonRow
            className='ion-justify-content-around'
            style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
          >
            <IonButton
              shape='round'
              color='accent-blue'
              mode='ios'
              disabled={!validateInputs()}
              onClick={handleSend}
            >
              <IonText style={{ marginLeft: "1rem", marginRight: "1rem" }}>
                Send
              </IonText>
            </IonButton>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default FeedbackModal;
