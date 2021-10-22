import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
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
import { arrowBack, chevronForward } from "ionicons/icons";
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
import challenge from "../../../assets/onboarding/challenge.png";
import highground from "../../../assets/onboarding/highground.png";
import "../Challenges.scss";
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
import { useWindowSize } from "../../../utils/WindowUtils";

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
  const { isDesktop } = useWindowSize();
  const { createChallenge } = useChallenge();
  const [showModal, setShowModal] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [hasSetInviteType, setHasSetInviteType] = useState(false);

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

  if (!hasSetInviteType) {
    return (
      <IonPage style={{ background: "#ffffff" }}>
        <IonHeader className='ion-no-border'>
          <IonToolbar
            color='main-beige'
            className='challenges-header'
            style={{ paddingTop: "0.5rem" }}
          >
            <IonButtons slot='start'>
              <IonFabButton
                className='placeholder-fab'
                color='main-beige'
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
                <IonIcon icon={arrowBack} />
              </IonFabButton>
            </IonButtons>
          </IonToolbar>
          <div className='header'>
            <IonGrid>
              <IonRow className='ion-padding'>
                <IonText
                  color='white'
                  style={{ fontWeight: "bold", fontSize: "1.5rem" }}
                >
                  Tell us more about your challenge
                </IonText>
              </IonRow>
            </IonGrid>
          </div>
          {!isDesktop && <div className='challenges-header-curve' />}
        </IonHeader>

        <IonContent fullscreen>
          <IonGrid style={{ marginTop: "2rem" }}>
            <IonRow className='ion-justify-content-center'>
              <IonCol>
                <IonCard
                  className='ion-align-items-center ion-no-margin'
                  button
                  onClick={() => {
                    setState({ inviteType: "PRIVATE" });
                    setHasSetInviteType(true);
                  }}
                  style={{ marginLeft: "1rem", marginRight: "1rem" }}
                >
                  <IonItem lines='none' className='ion-margin-vertical'>
                    <IonAvatar slot='start'>
                      <img src={challenge} alt='' />
                    </IonAvatar>
                    <IonText style={{ fontSize: "0.9rem" }}>
                      For me and my friends
                    </IonText>
                    <IonIcon slot='end' icon={chevronForward} />
                  </IonItem>
                </IonCard>
              </IonCol>
            </IonRow>
            <IonRow
              className='ion-justify-content-center'
              style={{ marginTop: "0.5rem" }}
            >
              <IonCol>
                <IonCard
                  className='ion-align-items-center ion-no-margin'
                  button
                  onClick={() => {
                    setState({ inviteType: "PUBLIC" });
                    setHasSetInviteType(true);
                  }}
                  style={{ marginLeft: "1rem", marginRight: "1rem" }}
                >
                  <IonItem lines='none' className='ion-margin-vertical'>
                    <IonAvatar slot='start'>
                      <img src={highground} alt='' />
                    </IonAvatar>
                    <IonText style={{ fontSize: "0.9rem" }}>
                      For anyone to join
                    </IonText>
                    <IonIcon slot='end' icon={chevronForward} />
                  </IonItem>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage style={{ background: "#ffffff" }}>
      <IonHeader className='ion-no-border'>
        <IonToolbar
          color='main-beige'
          className='challenges-header'
          style={{ paddingTop: "0.5rem" }}
        >
          <IonButtons slot='start'>
            <IonFabButton
              className='placeholder-fab'
              color='main-beige'
              mode='ios'
              slot='start'
              style={{
                margin: "0.5rem",
                width: "2.75rem",
                height: "2.75rem",
              }}
              onClick={() => {
                setHasSetInviteType(false);
              }}
            >
              <IonIcon icon={arrowBack} />
            </IonFabButton>
          </IonButtons>
        </IonToolbar>
        <div className='header'>
          <IonGrid>
            <IonRow className='ion-padding-horizontal ion-padding-bottom'>
              <IonText
                color='white'
                style={{ fontWeight: "bold", fontSize: "1.5rem" }}
              >
                Create a new challenge
              </IonText>
            </IonRow>
          </IonGrid>
        </div>
        {!isDesktop && <div className='challenges-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid style={{ marginTop: "2rem" }}>
          <IonRow className='ion-padding ion-align-items-center'>
            <IonCol className='ion-no-padding' size='10'>
              <IonText style={{ fontWeight: "bold" }} color='primary'>
                {state.inviteType === "PRIVATE"
                  ? "For me and my friends"
                  : "For anyone to join"}
              </IonText>
            </IonCol>
            <IonCol className='ion-no-padding' size='2'>
              <IonRow className='ion-justify-content-end'>
                <IonText
                  style={{ fontSize: 15 }}
                  onClick={() => setHasSetInviteType(false)}
                >
                  Change
                </IonText>
              </IonRow>
            </IonCol>
          </IonRow>
          {/* <IonRow className="ion-padding-bottom ion-padding-horizontal">
            <IonText>
              {state.inviteType === "PRIVATE"
                ? "For me and my friends"
                : "For anyone to join"}
            </IonText>
          </IonRow> */}
        </IonGrid>
        <IonGrid>
          <IonRow className='ion-padding'>
            <IonText
              style={{ fontWeight: "600" }}
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
                boxShadow: "rgba(149, 149, 149, 0.2) 0px 2px 10px 0px",
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
          <IonRow className='ion-padding'>
            <IonText
              style={{ fontWeight: "600" }}
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
                boxShadow: "rgba(149, 149, 149, 0.2) 0px 2px 10px 0px",
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
              style={{ fontWeight: "600" }}
              color={
                hasError && isBefore(parseISO(state.endAt), Date.now())
                  ? "danger"
                  : "primary"
              }
            >
              Challenge dates
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
        <IonGrid className='ion-padding-bottom'>
          <IonRow className='ion-padding'>
            <IonText style={{ fontWeight: "600" }} color='primary'>
              Rule
            </IonText>
          </IonRow>
          <IonRow className='ion-padding-bottom ion-padding-horizontal'>
            <IonText>
              Anyone who doesn't finish the challenge in time will be thrown to
              the wall
            </IonText>
          </IonRow>
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
      <IonFooter>
        <IonToolbar>
          <IonRow
            className='ion-justify-content-center'
            style={{ margin: "0.5rem" }}
          >
            <IonButton
              mode='ios'
              shape='round'
              color='main-beige'
              fill='solid'
              onClick={handleCreate}
              style={{
                display: "flex",
                flex: 1,
                marginLeft: "2rem",
                marginRight: "2rem",
                maxWidth: 300,
              }}
            >
              <IonText style={{ marginLeft: "2rem", marginRight: "2rem" }}>
                Save
              </IonText>
            </IonButton>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonPage>
  );
};

export default CreateChallenge;
