import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonText,
  IonTextarea,
  IonToolbar,
} from "@ionic/react";
import { arrowBackOutline } from "ionicons/icons";
import { useState, useReducer, useEffect } from "react";
import {
  addYears,
  format,
  formatDuration,
  formatISO,
  intervalToDuration,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import "./EditChallenge.scss";
import {
  ChallengeData,
  ChallengeInviteType,
  ChallengePost,
  ChallengeType,
  UserMini,
} from "../../../interfaces/models/Challenges";
import { useChallenge } from "../../../contexts/ChallengeContext";
import { hideTabs } from "../../../utils/TabsUtils";
import OfflineToast from "../../../components/offlineToast";

interface EditChallengeProps {
  challenge: ChallengeData;
  backAction: () => void;
}

interface EditChallengeState {
  title: string;
  description: string;
  punishmentType: ChallengeType;
  inviteType: ChallengeInviteType;
  startAt: string;
  endAt: string;
  participants: {
    accepted: {
      completed: UserMini[];
      notCompleted: UserMini[];
    };
    pending: UserMini[];
  };
  invitedUsers: UserMini[];
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

const EditChallenge: React.FC<EditChallengeProps> = (
  props: EditChallengeProps
) => {
  const { challenge, backAction } = props;
  const { updateChallenge } = useChallenge();
  const [hasError, setHasError] = useState(false);
  const [showOfflineToast, setShowOfflineToast] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [state, setState] = useReducer(
    (s: EditChallengeState, a: Partial<EditChallengeState>) => ({
      ...s,
      ...a,
    }),
    {
      title: challenge.title,
      description: challenge.description ?? "",
      punishmentType: challenge.type,
      inviteType: challenge.inviteType,
      startAt: challenge.startAt ?? formatISO(Date.now()),
      endAt: challenge.endAt,
      participants: challenge.participants,
      invitedUsers: challenge.participants.accepted.notCompleted.concat(
        challenge.participants.pending
      ),
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

  const handleSubmit = async () => {
    const startAtTime = parseISO(state.startAt);
    const endAtTime = parseISO(state.endAt);
    if (
      state.title.length <= 0 ||
      state.description.length <= 0 ||
      isAfter(startAtTime, endAtTime) ||
      isAfter(Date.now(), startAtTime)
    ) {
      setHasError(true);
      return;
    }
    const updatedParticipants: string[] = state.invitedUsers.map(
      (u) => u.userId
    );
    const data: ChallengePost = {
      title: state.title,
      description: state.description,
      startAt: state.startAt,
      endAt: state.endAt,
      type: state.punishmentType,
      inviteType: state.inviteType,
      participants: updatedParticipants,
    };
    setState({ isLoading: true });
    await updateChallenge(challenge.challengeId, data)
      .then(() => {
        setState({ isLoading: false });
        window.location.href = `challenges/${challenge.challengeId}/details`;
      })
      .catch((error) => {
        console.log(error);
        setState({ isLoading: false });
        setShowOfflineToast(true);
      });
  };

  useEffect(() => {
    hideTabs();
  }, []);

  return (
    <IonPage style={{ background: "#ffffff" }}>
      <IonHeader>
        <IonToolbar color='main-beige' style={{ paddingTop: "0.5rem" }}>
          <IonButtons slot='start'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              color='white'
              onClick={backAction}
            >
              <IonIcon icon={arrowBackOutline} size='large' />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid style={{ marginTop: "0.5rem" }}>
          <IonRow className='ion-padding'>
            <IonText style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
              Edit your challenge
            </IonText>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow className='ion-padding-bottom ion-padding-horizontal'>
            <IonText>
              Anyone who doesn't finish the challenge in time will be thrown to
              the wall
            </IonText>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow className='ion-padding-horizontal ion-padding-bottom'>
            <IonText
              style={{ fontWeight: "bold" }}
              color={hasError && state.title.length <= 0 ? "danger" : "primary"}
            >
              What's the challenge called?
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
                value={state.title}
                placeholder='Enter title*'
                style={{ marginLeft: "0.5rem", marginRight: "5rem" }}
                onIonChange={(event) => {
                  setState({ title: event.detail.value ?? "" });
                }}
              />
            </div>
          </IonRow>
          <IonRow
            className='ion-padding-horizontal ion-justify-content-end'
            style={{ marginTop: "0.5rem" }}
          >
            <IonText style={{ fontSize: "14px", color: "#adadad" }}>
              {"0/30"}
            </IonText>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow className='ion-padding-horizontal ion-padding-bottom'>
            <IonText
              style={{ fontWeight: "bold" }}
              color={
                hasError && state.description.length <= 0 ? "danger" : "primary"
              }
            >
              What do they need to do?
            </IonText>
          </IonRow>
          <IonRow className='ion-padding-horizontal ion-padding-bottom'>
            <div
              style={{
                border: "solid 1px #adadad",
                width: "100%",
                borderRadius: "0.5rem",
              }}
            >
              <IonTextarea
                value={state.description}
                rows={4}
                placeholder='Enter challenge description*'
                style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
                onIonChange={(event) => {
                  setState({ description: event.detail.value ?? "" });
                }}
              />
            </div>
          </IonRow>
        </IonGrid>
        <IonGrid>
          <IonRow className='ion-padding'>
            <IonText
              style={{ fontWeight: "bold" }}
              color={
                hasError && isBefore(parseISO(state.endAt), Date.now())
                  ? "danger"
                  : "primary"
              }
            >
              When does the challenge start and end?
            </IonText>
          </IonRow>
          <IonList>
            <IonItem lines='none'>
              <IonLabel
                color={
                  !(
                    isAfter(parseISO(state.startAt), Date.now()) &&
                    isAfter(parseISO(state.endAt), parseISO(state.startAt))
                  )
                    ? "danger"
                    : "primary"
                }
              >
                Starts at
              </IonLabel>
              <IonDatetime
                displayFormat='D MMM YYYY HH:mm'
                min={formatISO(Date.now()).slice(0, -6)}
                max={formatISO(addYears(Date.now(), 1)).slice(0, -6)}
                value={state.startAt}
                placeholder={format(Date.now(), "d MMM yyyy HH:mm")}
                onIonChange={(e) => setState({ startAt: e.detail.value! })}
              ></IonDatetime>
            </IonItem>
            <IonItem lines='none'>
              <IonLabel
                color={
                  !(
                    isAfter(parseISO(state.endAt), Date.now()) &&
                    isAfter(parseISO(state.endAt), parseISO(state.startAt))
                  )
                    ? "danger"
                    : "primary"
                }
              >
                Ends at
              </IonLabel>
              <IonDatetime
                displayFormat='D MMM YYYY HH:mm'
                min={formatISO(Date.now()).slice(0, -6)}
                max={formatISO(addYears(Date.now(), 10)).slice(0, -6)}
                value={state.endAt}
                placeholder={format(Date.now(), "d MMM yyyy HH:mm")}
                onIonChange={(e) => setState({ endAt: e.detail.value! })}
              ></IonDatetime>
            </IonItem>
          </IonList>
          <IonRow
            className='ion-padding-horizontal ion-justify-content-end ion-text-end'
            style={{ marginTop: "0.5rem" }}
          >
            <IonText style={{ fontSize: "14px", color: "#adadad" }}>
              {`Duration: ${formatDuration(
                intervalToDuration({
                  start: parseISO(state.startAt),
                  end: parseISO(state.endAt),
                })
              )}`}
            </IonText>
          </IonRow>
          {hasError && isAfter(parseISO(state.startAt), parseISO(state.endAt)) && (
            <IonRow
              className='ion-padding-horizontal'
              style={{ marginTop: "0.5rem", marginBottom: "1rem" }}
            >
              <IonText color='danger'>
                The end time cannot be before start time
              </IonText>
            </IonRow>
          )}
          {hasError && isAfter(Date.now(), parseISO(state.startAt)) && (
            <IonRow
              className='ion-padding-horizontal'
              style={{ marginTop: "0.5rem", marginBottom: "1rem" }}
            >
              <IonText color='danger'>
                The start time cannot be in the past
              </IonText>
            </IonRow>
          )}
        </IonGrid>
        <OfflineToast
          message='Sorry, we need the internets to edit a challenge :('
          showToast={showOfflineToast}
          setShowToast={setShowOfflineToast}
        />
      </IonContent>
      <IonFooter translucent={true} className='ion-margin-top'>
        <IonToolbar>
          <IonRow
            className='ion-justify-content-center'
            style={{ margin: "0.5rem" }}
          >
            <IonButton
              mode='ios'
              shape='round'
              color='accent-beige'
              fill='solid'
              onClick={handleSubmit}
            >
              <IonText style={{ marginLeft: "2rem", marginRight: "2rem" }}>
                Confirm changes
              </IonText>
            </IonButton>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default EditChallenge;
