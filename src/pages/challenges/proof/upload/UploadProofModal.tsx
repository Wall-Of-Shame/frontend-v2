import {
  IonContent,
  IonIcon,
  IonModal,
  IonRow,
  IonText,
  IonButton,
  IonButtons,
  IonHeader,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { close } from "ionicons/icons";
import Container from "../../../../components/container";
import { useReducer, useState } from "react";
import LoadingSpinner from "../../../../components/loadingSpinner";
import Alert from "../../../../components/alert";
import ImageUploader from "react-images-upload";
import "./UploadProofModal.scss";
import { useChallenge } from "../../../../contexts/ChallengeContext";
import {
  ChallengeData,
  UserMini,
} from "../../../../interfaces/models/Challenges";
import imageCompression from "browser-image-compression";
import isAfter from "date-fns/isAfter";
import parseISO from "date-fns/parseISO";
import Scrollbars from "react-custom-scrollbars";

interface UploadProofModalProps {
  challenge: ChallengeData;
  userData: UserMini | undefined;
  uploadCallback: (data: ChallengeData) => void;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

export interface UploadProofModalState {
  challenge?: ChallengeData;
  uploadMode: boolean;
  evidenceLink?: string;
  hasCompleted: boolean;
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

const UploadProofModal: React.FC<UploadProofModalProps> = (
  props: UploadProofModalProps
) => {
  const { challenge, userData, uploadCallback, showModal, setShowModal } =
    props;
  const { getChallenge, uploadProof, completeChallenge } = useChallenge();

  const [state, setState] = useReducer(
    (s: UploadProofModalState, a: Partial<UploadProofModalState>) => ({
      ...s,
      ...a,
    }),
    {
      challenge: challenge,
      uploadMode:
        userData?.evidenceLink === undefined || userData?.evidenceLink === "",
      evidenceLink: userData?.evidenceLink,
      hasCompleted: userData?.completedAt !== undefined,
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

  const handleReUpload = () => {
    setState({
      showAlert: true,
      hasConfirm: true,
      alertHeader: "Are you sure?",
      alertMessage:
        "Your original proof will be replaced with your new proof :)",
      confirmHandler: () => {
        setState({ uploadMode: true });
      },
      cancelHandler: () => {},
    });
  };

  const handleSubmit = async () => {
    setState({ isLoading: true });
    try {
      const compressedFile = await imageCompression(file!, options);
      const reader = new FileReader();
      reader.readAsDataURL(compressedFile);
      reader.onloadend = async () => {
        if (reader.result && typeof reader.result === "string") {
          await uploadProof(challenge.challengeId, reader.result);
          await completeChallenge(challenge.challengeId);
          await fetchData();
          setState({
            isLoading: false,
            showAlert: true,
            alertHeader: "Success",
            alertMessage: "Your proof has been uploaded successfully",
            hasConfirm: false,
            uploadMode: false,
          });
        } else {
          throw new Error("Please re-upload your image file!");
        }
      };
    } catch {
      setState({
        isLoading: false,
        showAlert: true,
        alertHeader: "Error processing the image you uploaded",
        alertMessage: "Please refresh and try again later",
      });
    }
  };

  const fetchData = async () => {
    try {
      const updatedChallenge = await getChallenge(challenge.challengeId);
      if (updatedChallenge) {
        const evidenceLink =
          updatedChallenge.participants.accepted.completed.find(
            (p) => p.userId === userData?.userId
          )?.evidenceLink ?? "";
        setState({ challenge: updatedChallenge, evidenceLink });
        uploadCallback(updatedChallenge);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderProof = () => {
    if (isAfter(Date.now(), parseISO(challenge.endAt)) && !state.evidenceLink) {
      return (
        <Container>
          <IonText>
            Too late, you did not upload any proof before the challenge ended 🤪
          </IonText>
        </Container>
      );
    }
    return (
      <Container>
        {state.uploadMode ? (
          <>
            <IonRow
              className='ion-padding-horizontal ion-justify-content-center'
              style={{ marginTop: "2.5rem" }}
            >
              <IonText style={{ fontWeight: "bolder" }}>
                Phew... You're safe!
              </IonText>
            </IonRow>
            <IonRow
              className='ion-padding-horizontal ion-justify-content-center'
              style={{ marginTop: "2.5rem" }}
            >
              <IonText>
                We sure hope you didn't cheat! You didn't cheat... right?
              </IonText>
            </IonRow>
            <IonRow
              className='ion-padding-horizontal ion-justify-content-center'
              style={{ marginTop: "2.5rem" }}
            >
              <IonText>
                Yknow what, upload some proof to show that you’ve completed the
                challenge!
              </IonText>
            </IonRow>
            <ImageUploader
              withIcon={false}
              buttonText='&nbsp;&nbsp;&nbsp;Select Image&nbsp;&nbsp;&nbsp;'
              buttonStyles={image ? { display: "none" } : undefined}
              onChange={onDrop}
              withPreview={true}
              singleImage={true}
              label={"Selected: " + image ?? "None"}
              labelStyles={{
                textAlign: "center",
                paddingBottom: "16px",
                fontSize: "16px",
              }}
              imgExtension={[".jpg", ".png", ".gif", "jpeg"]}
              maxFileSize={Infinity}
            />
            <IonRow
              className='ion-no-padding ion-justify-content-center'
              style={{ marginTop: "2.5rem" }}
            >
              <IonButton
                mode='ios'
                fill='solid'
                shape='round'
                color='secondary'
                className='ion-padding-horizontal'
                disabled={file === null}
                onClick={handleSubmit}
                style={{ marginBottom: "0.5rem" }}
              >
                <IonText
                  style={{
                    marginLeft: "1.5rem",
                    marginRight: "1.5rem",
                  }}
                >
                  {state.hasCompleted ? "Re-upload proof" : "Upload proof"}
                </IonText>
              </IonButton>
            </IonRow>
            {!state.hasCompleted && (
              <IonRow className='ion-no-padding ion-justify-content-center'>
                <IonButton
                  mode='ios'
                  fill='outline'
                  shape='round'
                  color='secondary'
                  className='ion-padding-horizontal'
                  onClick={() => {
                    setShowModal(false);
                    setTimeout(() => {
                      setState({
                        uploadMode:
                          userData?.evidenceLink === undefined ||
                          userData?.evidenceLink === "",
                      });
                    }, 200);
                  }}
                  style={{ marginBottom: "2rem" }}
                >
                  <IonText
                    style={{
                      marginLeft: "1.5rem",
                      marginRight: "1.5rem",
                    }}
                  >
                    Jk I haven't done it
                  </IonText>
                </IonButton>
              </IonRow>
            )}
          </>
        ) : (
          <>
            <IonRow className='ion-justify-content-center ion-margin-top'>
              <img
                src={userData?.evidenceLink}
                alt='Proof'
                className='uploaded-proof'
              />
            </IonRow>
            {!isAfter(Date.now(), parseISO(challenge.endAt)) ? (
              <IonButton
                mode='ios'
                fill='solid'
                shape='round'
                color='secondary'
                className='ion-padding-horizontal'
                style={{ marginTop: "2rem", marginBottom: "2rem" }}
                onClick={handleReUpload}
              >
                <IonText
                  style={{ marginLeft: "1.5rem", marginRight: "1.5rem" }}
                >
                  Re-upload
                </IonText>
              </IonButton>
            ) : (
              <IonRow className='ion-justify-content-center ion-margin-top'>
                <IonText>
                  Congratulations for completing the challenge 😊
                </IonText>
              </IonRow>
            )}
          </>
        )}
      </Container>
    );
  };

  return (
    <IonModal
      isOpen={showModal}
      onDidDismiss={() => {
        setShowModal(false);
        setTimeout(() => {
          setState({
            uploadMode:
              userData?.evidenceLink === undefined ||
              userData?.evidenceLink === "",
          });
        }, 200);
      }}
      backdropDismiss={false}
    >
      <IonHeader translucent>
        <IonToolbar>
          <IonTitle>Completed</IonTitle>
          <IonButtons slot='start'>
            <IonButton
              onClick={() => setShowModal(false)}
              style={{ margin: "0.5rem" }}
            >
              <IonIcon icon={close} size='large' />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <Scrollbars>
          <IonRow style={{ paddingTop: "1rem", paddingBottom: "1rem" }}>
            {renderProof()}
          </IonRow>
        </Scrollbars>
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
    </IonModal>
  );
};

export default UploadProofModal;
