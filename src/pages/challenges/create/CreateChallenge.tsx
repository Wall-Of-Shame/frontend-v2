import {
  IonButton,
  IonButtons,
  IonContent,
  IonDatetime,
  IonFabButton,
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
import { chevronBackOutline } from "ionicons/icons";
import { useState, useReducer, useEffect } from "react";
import {
  addHours,
  addYears,
  format,
  formatDuration,
  formatISO,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import "./CreateChallenge.scss";
import AddParticipantsModal from "../../../components/participants/AddParticipantsModal";
import {
  ChallengeInviteType,
  ChallengePost,
  ChallengeType,
} from "../../../interfaces/models/Challenges";
import { useChallenge } from "../../../contexts/ChallengeContext";
import { UserList } from "../../../interfaces/models/Users";
import { hideTabs } from "../../../utils/TabsUtils";
import LoadingSpinner from "../../../components/loadingSpinner";
import Alert from "../../../components/alert";
import OfflineToast from "../../../components/offlineToast";
import { useHistory } from "react-router";
import { intervalToDuration } from "date-fns/esm";

interface CreateChallengeProps {}

interface CreateChallengeState {
  title: string;
  description: string;
  punishmentType: ChallengeType;
  inviteType: ChallengeInviteType;
  startAt: string;
  endAt: string;
  invitedUsers: UserList[];
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

const CreateChallenge: React.FC<CreateChallengeProps> = (
  props: CreateChallengeProps
) => {
  const history = useHistory();
  const { createChallenge } = useChallenge();
  const [showModal, setShowModal] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showOfflineToast, setShowOfflineToast] = useState(false);

  const [state, setState] = useReducer(
    (s: CreateChallengeState, a: Partial<CreateChallengeState>) => ({
      ...s,
      ...a,
    }),
    {
      title: "",
      description: "",
      punishmentType: "NOT_COMPLETED",
      startAt: formatISO(addHours(Date.now(), 1)),
      endAt: formatISO(addHours(Date.now(), 2)),
      inviteType: "PRIVATE",
      invitedUsers: [],
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

  const handleCreate = () => {
    if (
      !(
        state.title.length > 0 &&
        state.description.length > 0 &&
        isAfter(parseISO(state.startAt), Date.now()) &&
        isAfter(parseISO(state.endAt), Date.now()) &&
        isAfter(parseISO(state.endAt), parseISO(state.startAt))
      )
    ) {
      setHasError(true);
      return;
    }
    setShowModal(true);
  };

  const handleSubmit = async (data: ChallengePost) => {
    setState({ isLoading: true });
    try {
      await createChallenge(data);
      setState({ isLoading: false });
      window.location.href = "challenges";
    } catch (error) {
      console.log(error);
      setState({ isLoading: false });
      setShowOfflineToast(true);
    }
  };

  useEffect(() => {
    hideTabs();
  }, []);

  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar style={{ paddingTop: "0.5rem" }}>
          <IonButtons slot='start'>
            <IonFabButton
              color='light'
              mode='ios'
              slot='start'
              style={{
                margin: "0.5rem",
                width: "2.75rem",
                height: "2.75rem",
              }}
              onClick={() => {
                history.goBack();
              }}
            >
              <IonIcon icon={chevronBackOutline} />
            </IonFabButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid style={{ marginTop: "0.5rem" }}>
          <IonRow className='ion-padding'>
            <IonText style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
              Create a new challenge
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
              What's the challenge called?*
            </IonText>
          </IonRow>
          <IonRow className='ion-padding-horizontal'>
            <div
              style={{
                width: "100%",
                borderRadius: "0.5rem",
                background: "#ffffff",
                paddingLeft: "0.75rem",
              }}
            >
              <IonInput
                value={state.title}
                placeholder='Enter title'
                maxlength={50}
                autoCorrect='on'
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
              {`${state.title.length}/50`}
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
              What do they need to do?*
            </IonText>
          </IonRow>
          <IonRow className='ion-padding-horizontal'>
            <div
              style={{
                width: "100%",
                borderRadius: "0.5rem",
                background: "#ffffff",
                paddingLeft: "0.75rem",
              }}
            >
              <IonTextarea
                value={state.description}
                rows={4}
                maxlength={200}
                autoCorrect='on'
                placeholder='Enter challenge description'
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
                max={formatISO(addYears(Date.now(), 10)).slice(0, -6)}
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
          {hasError &&
            !isAfter(parseISO(state.endAt), parseISO(state.startAt)) && (
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
        <AddParticipantsModal
          users={state.invitedUsers}
          showModal={showModal}
          setShowModal={setShowModal}
          completionCallback={(invitedUsers) => {
            setState({ invitedUsers: invitedUsers });
            const data: ChallengePost = {
              title: state.title,
              description: state.description,
              startAt: state.startAt,
              endAt: state.endAt,
              type: state.punishmentType,
              inviteType: state.inviteType,
              participants: invitedUsers.map((u) => {
                return u.userId;
              }),
            };
            handleSubmit(data);
            history.replace("/challenges");
          }}
        />
        <OfflineToast
          message='Sorry, we need the internets to create a challenge :('
          showToast={showOfflineToast}
          setShowToast={setShowOfflineToast}
        />
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
      <IonFooter translucent={true} className='ion-margin-top'>
        <IonToolbar>
          <IonRow
            className='ion-justify-content-center'
            style={{ margin: "0.5rem" }}
          >
            <IonButton
              mode='ios'
              shape='round'
              color='secondary'
              fill='solid'
              onClick={handleCreate}
            >
              <IonText style={{ marginLeft: "2rem", marginRight: "2rem" }}>
                Create challenge
              </IonText>
            </IonButton>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default CreateChallenge;
