import {
  IonButton,
  IonButtons,
  IonContent,
  IonFabButton,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonToast,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { useReducer, useState } from "react";
import {
  arrowBack,
  chatbubbles,
  flash,
  pencil,
  personAdd,
} from "ionicons/icons";
import { useEffect } from "react";
import { Redirect, useHistory, useLocation } from "react-router";
import { useChallenge } from "../../../contexts/ChallengeContext";
import {
  ChallengeData,
  ChallengeInviteType,
  ChallengePost,
  ChallengeType,
  UserMini,
} from "../../../interfaces/models/Challenges";
import "./ChallengeDetails.scss";
import { formatISO, parseISO } from "date-fns";
import { useUser } from "../../../contexts/UserContext";
import EditChallenge from "../edit";
import LoadingSpinner from "../../../components/loadingSpinner";
import Alert from "../../../components/alert";
import isAfter from "date-fns/isAfter";
import { intervalToDuration } from "date-fns/esm";
import useInterval from "../../../hooks/useInterval";
import UploadProofModal from "../proof/upload";
import VoteModal from "../vote";
import ViewProofModal from "../proof/view";
import { hideTabs } from "../../../utils/TabsUtils";
import OfflineToast from "../../../components/offlineToast";
import Participants from "./Participants";
import FooterActions from "./FooterActions";
import EditParticipantsModal from "../../../components/participants/EditParticipantsModal";
import DetailsTab from "./DetailsTab";
import Chat from "./Chat";
import PowerUpModal from "../powerUp";

interface ChallengeDetailsProps {}

interface ChallengeDetailsState {
  editMode: boolean;
  showUploadProofModal: boolean;
  showViewProofModal: boolean;
  userUnderViewing: UserMini | undefined;
  showPowerUpModal: boolean;
  showVoteModal: boolean;
  showParticipantModal: boolean;
  showChatModal: boolean;
  participants: {
    accepted: {
      completed: UserMini[];
      notCompleted: UserMini[];
    };
    pending: UserMini[];
  };
  invitedUsers: UserMini[];
  message: string;
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
  showToast: boolean;
  toastMessage: string;
}

export interface EditChallengeState {
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
}

const ChallengeDetails: React.FC<ChallengeDetailsProps> = () => {
  const location = useLocation();
  const history = useHistory();
  const { user } = useUser()!;
  const { getChallenge, acceptChallenge, rejectChallenge, updateChallenge } =
    useChallenge();

  const [challenge, setChallenge] = useState<ChallengeData | null>(
    location.state as ChallengeData
  );
  const [tab, setTab] = useState("details");
  const [countdown, setCountdown] = useState<Duration | null>(null);
  const [didFinish, setDidFinish] = useState(false);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [hasEditError, setHasEditError] = useState(false);
  const [state, setState] = useReducer(
    (s: ChallengeDetailsState, a: Partial<ChallengeDetailsState>) => ({
      ...s,
      ...a,
    }),
    {
      editMode: false,
      showPowerUpModal: false,
      showUploadProofModal: false,
      showViewProofModal: false,
      userUnderViewing: undefined,
      showVoteModal: false,
      showParticipantModal: false,
      showChatModal: false,
      participants: challenge?.participants ?? {
        accepted: { completed: [], notCompleted: [] },
        pending: [],
      },
      invitedUsers:
        challenge?.participants.accepted.notCompleted.concat(
          challenge.participants.pending
        ) ?? [],
      message: "",
      isLoading: false,
      showAlert: false,
      alertHeader: "",
      alertMessage: "",
      hasConfirm: false,
      confirmHandler: () => {},
      cancelHandler: () => {},
      okHandler: undefined,
      showToast: false,
      toastMessage: "",
    }
  );

  const [editState, setEditState] = useReducer(
    (s: EditChallengeState, a: Partial<EditChallengeState>) => ({
      ...s,
      ...a,
    }),
    {
      title: challenge?.title ?? "",
      description: challenge?.description ?? "",
      punishmentType: challenge?.type ?? "NOT_COMPLETED",
      inviteType: challenge?.inviteType ?? "PRIVATE",
      startAt: challenge?.startAt ?? formatISO(Date.now()),
      endAt: challenge?.endAt ?? formatISO(Date.now()),
      participants: challenge?.participants ?? {
        accepted: {
          completed: [],
          notCompleted: [],
        },
        pending: [],
      },
      invitedUsers:
        challenge?.participants.accepted.notCompleted.concat(
          challenge?.participants.pending
        ) ?? [],
    }
  );

  const fetchData = async () => {
    try {
      const locationState = location.state as ChallengeData;
      const pathname = window.location.pathname;
      const splitted = pathname.split("/");
      let challengeId = "";
      if (splitted.length > 3) {
        challengeId = splitted[2];
      }
      if (!locationState && !challengeId) {
        return;
      }
      if (locationState) {
        const challenge = await getChallenge(locationState.challengeId);
        if (challenge) {
          setChallenge(challenge);
        }
      } else if (challengeId) {
        const challenge = await getChallenge(challengeId);
        if (challenge) {
          setChallenge(challenge);
        }
      }
    } catch (error) {
      console.log(error);
      setState({
        hasConfirm: false,
        showAlert: true,
        alertHeader: "Ooooops",
        alertMessage: "Our server is taking a break, come back later please :)",
      });
    }
  };

  const handleEdit = async () => {
    if (!challenge) {
      return;
    }
    setState({ isLoading: true });
    const updatedChallenge = await getChallenge(challenge.challengeId);
    if (updatedChallenge) {
      setChallenge(updatedChallenge);
      if (isAfter(Date.now(), parseISO(updatedChallenge.endAt))) {
        setState({
          isLoading: false,
          showAlert: true,
          hasConfirm: false,
          alertHeader: "Notice",
          alertMessage:
            "This challenge has already ended, it cannot be edited anymore :)",
        });
      } else if (isAfter(Date.now(), parseISO(updatedChallenge.startAt!))) {
        setState({
          isLoading: false,
          showAlert: true,
          hasConfirm: false,
          alertHeader: "Notice",
          alertMessage:
            "This challenge has already started, it cannot be edited anymore :)",
        });
      } else if (
        updatedChallenge.participants.accepted.completed.concat(
          updatedChallenge.participants.accepted.notCompleted
        ).length > 1
      ) {
        setState({
          isLoading: false,
          showAlert: true,
          hasConfirm: false,
          alertHeader: "Notice",
          alertMessage:
            "One or more participants have accepted the challenge, this challenge cannot be edited anymore :)",
        });
      } else {
        setState({ editMode: true, isLoading: false });
      }
    }
  };

  const handleAccept = async () => {
    if (challenge === null) {
      return;
    }
    setState({ isLoading: true });
    try {
      await acceptChallenge(challenge.challengeId);
      const updatedChallenge = await getChallenge(challenge.challengeId);
      if (updatedChallenge) {
        setChallenge(updatedChallenge);
      }
      setState({
        isLoading: false,
        showAlert: true,
        hasConfirm: false,
        alertHeader: "Woohoo",
        alertMessage: "You have accepted the challenge. ",
      });
    } catch (error) {
      setState({
        isLoading: false,
        showAlert: true,
        hasConfirm: false,
        alertHeader: "Ooooops",
        alertMessage: "Our server is taking a break, come back later please :)",
      });
      setShowOfflineToast(true);
    }
  };

  const handleReject = async () => {
    if (challenge === null) {
      return;
    }
    setState({ isLoading: true });
    try {
      await rejectChallenge(challenge.challengeId);
      setState({ isLoading: false });
      window.location.replace("challenges");
    } catch (error) {
      setState({
        isLoading: false,
        showAlert: true,
        hasConfirm: false,
        alertHeader: "Ooooops",
        alertMessage: "Our server is taking a break, come back later please :)",
      });
    }
  };

  const handleComplete = async () => {
    if (challenge === null) {
      return;
    }
    setState({ showUploadProofModal: true });
  };

  const handleSubmit = async () => {
    if (!challenge) {
      return;
    }
    const startAtTime = parseISO(editState.startAt);
    const endAtTime = parseISO(editState.endAt);
    if (
      editState.title.length <= 0 ||
      editState.description.length <= 0 ||
      isAfter(startAtTime, endAtTime) ||
      isAfter(Date.now(), startAtTime)
    ) {
      setHasEditError(true);
      return;
    }
    const updatedParticipants: string[] = state.invitedUsers.map(
      (u) => u.userId
    );
    const data: ChallengePost = {
      title: editState.title,
      description: editState.description,
      startAt: editState.startAt,
      endAt: editState.endAt,
      type: editState.punishmentType,
      inviteType: editState.inviteType,
      participants: updatedParticipants,
    };
    setState({ isLoading: true });
    try {
      await updateChallenge(challenge.challengeId, data);
      await fetchData();
      setTimeout(() => {
        setState({
          isLoading: false,
          editMode: false,
          showAlert: true,
          hasConfirm: false,
          alertHeader: "Success!",
          alertMessage: `You have successfully edited <strong>${challenge.title}</strong> :)`,
        });
      }, 1000);
    } catch (error) {
      setState({
        isLoading: false,
        showAlert: true,
        hasConfirm: false,
        alertHeader: "Ooooops",
        alertMessage: "Our server is taking a break, come back later please :)",
      });
    }
  };

  useInterval(() => {
    if (didFinish) {
      return;
    }
    if (!challenge) {
      window.location.href = "challenges";
      return;
    }
    const endAtTime = parseISO(challenge.endAt);
    const duration = intervalToDuration({
      start: Date.now(),
      end: endAtTime,
    });
    if (isAfter(Date.now(), endAtTime)) {
      setDidFinish(true);
      const zeroDuration = intervalToDuration({
        start: Date.now(),
        end: Date.now(),
      });
      setCountdown(zeroDuration);
    } else {
      setCountdown(duration);
    }
  }, 1000);

  useEffect(() => {
    fetchData();
    hideTabs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [didFinish]);

  const renderHeader = () => {
    if (challenge === null) {
      return <Redirect to={"challenges"} />;
    }

    if (isAfter(Date.now(), parseISO(challenge.endAt!))) {
      return (
        <IonRow className='ion-padding'>
          <IonText>The challenge has ended</IonText>
        </IonRow>
      );
    } else if (isAfter(Date.now(), parseISO(challenge.startAt!))) {
      if (
        challenge.participants.accepted.completed.findIndex(
          (p) => p.userId === user?.userId
        ) === -1
      ) {
        return (
          <IonRow className='ion-padding'>
            <IonText>Your challenge is</IonText>
          </IonRow>
        );
      } else {
        return (
          <IonRow className='ion-padding'>
            <IonText>You have completed the challenge</IonText>
          </IonRow>
        );
      }
    } else if (user?.userId === challenge.owner.userId) {
      return (
        <IonRow className='ion-padding'>
          <IonText>You have created a challenge to</IonText>
        </IonRow>
      );
    } else if (
      challenge.participants.pending.findIndex(
        (p) => p.userId === user?.userId
      ) !== -1
    ) {
      return (
        <IonRow className='ion-padding'>
          <IonText>You have been invited to</IonText>
        </IonRow>
      );
    }
    return <></>;
  };

  const renderTabs = () => {
    if (!challenge) {
      return <></>;
    }
    switch (tab) {
      case "details":
        return <DetailsTab challenge={challenge} countdown={countdown} />;
      case "participants":
        return (
          <div style={{ marginTop: "1rem" }}>
            <Participants
              challenge={challenge}
              viewProofCallback={(userUnderViewing) => {
                setState({
                  userUnderViewing,
                  showViewProofModal: true,
                });
              }}
            />
          </div>
        );
    }
  };

  const renderFooter = () => {
    if (!challenge) {
      return <></>;
    }
    switch (tab) {
      case "details":
        if (state.editMode) {
          return (
            <IonFooter translucent={true} key='details-edit'>
              <IonToolbar>
                <IonRow
                  className='ion-justify-content-around'
                  style={{ margin: "0.5rem" }}
                >
                  <IonButton
                    mode='ios'
                    shape='round'
                    color='main-beige'
                    expand='block'
                    fill='solid'
                    onClick={handleSubmit}
                  >
                    <IonText
                      style={{ marginLeft: "2rem", marginRight: "2rem" }}
                    >
                      Confirm changes
                    </IonText>
                  </IonButton>
                </IonRow>
              </IonToolbar>
            </IonFooter>
          );
        }
        return (
          <FooterActions
            challenge={challenge}
            viewVoteCallback={() => setState({ showVoteModal: true })}
            uploadProofCallback={() => setState({ showUploadProofModal: true })}
            handleAccept={handleAccept}
            handleReject={handleReject}
            handleComplete={handleComplete}
            alertCallback={(
              hasConfirm,
              alertHeader,
              alertMessage,
              confirmHandler
            ) => {
              setState({
                showAlert: true,
                hasConfirm: true,
                alertHeader,
                alertMessage,
                confirmHandler,
              });
            }}
          />
        );
      case "participants":
        return <></>;
    }
  };

  if (!challenge) {
    return <Redirect to={"challenges"} />;
  }

  const allParticipants = challenge.participants.accepted.completed
    .concat(challenge.participants.accepted.notCompleted)
    .concat(challenge.participants.accepted.protected);

  return (
    <IonPage style={{ background: "#ffffff" }}>
      <IonHeader className='ion-no-border'>
        <IonToolbar color='main-beige' style={{ paddingTop: "0.5rem" }}>
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
              if (state.editMode) {
                setState({ editMode: false });
              } else {
                history.goBack();
              }
            }}
          >
            <IonIcon icon={arrowBack} />
          </IonFabButton>
          {!state.editMode &&
            user?.userId === challenge.owner.userId &&
            !isAfter(Date.now(), parseISO(challenge.endAt!)) && (
              <>
                <IonButtons slot='end'>
                  {allParticipants.findIndex(
                    (p) => p.userId === user?.userId
                  ) !== -1 && (
                    <IonFabButton
                      className='placeholder-fab'
                      color='main-beige'
                      mode='ios'
                      slot='end'
                      style={{
                        margin: "0.5rem",
                        width: "2.75rem",
                        height: "2.75rem",
                      }}
                      onClick={() => setState({ showChatModal: true })}
                    >
                      <IonIcon
                        icon={chatbubbles}
                        style={{ fontSize: "1.5rem" }}
                      />
                    </IonFabButton>
                  )}
                  {!isAfter(Date.now(), parseISO(challenge.startAt!)) && (
                    <IonFabButton
                      className='placeholder-fab'
                      color='main-beige'
                      mode='ios'
                      slot='end'
                      style={{
                        margin: "0.5rem",
                        width: "2.75rem",
                        height: "2.75rem",
                      }}
                      onClick={() => setState({ showParticipantModal: true })}
                    >
                      <IonIcon
                        icon={personAdd}
                        style={{ fontSize: "1.5rem" }}
                      />
                    </IonFabButton>
                  )}
                  <IonFabButton
                    className='placeholder-fab'
                    color='main-beige'
                    mode='ios'
                    slot='end'
                    style={{
                      margin: "0.5rem",
                      width: "2.75rem",
                      height: "2.75rem",
                    }}
                    onClick={() => setState({ showPowerUpModal: true })}
                  >
                    <IonIcon icon={flash} style={{ fontSize: "1.5rem" }} />
                  </IonFabButton>
                  {!isAfter(Date.now(), parseISO(challenge.startAt!)) && (
                    <IonFabButton
                      className='placeholder-fab'
                      color='main-beige'
                      mode='ios'
                      slot='end'
                      style={{
                        margin: "0.5rem",
                        width: "2.75rem",
                        height: "2.75rem",
                      }}
                      onClick={handleEdit}
                    >
                      <IonIcon icon={pencil} style={{ fontSize: "1.5rem" }} />
                    </IonFabButton>
                  )}
                </IonButtons>
              </>
            )}
          {!state.editMode &&
            user?.userId !== challenge.owner.userId &&
            allParticipants.findIndex((p) => p.userId === user?.userId) !==
              -1 &&
            !isAfter(Date.now(), parseISO(challenge.endAt!)) && (
              <>
                <IonButtons slot='end'>
                  <IonFabButton
                    className='placeholder-fab'
                    color='main-beige'
                    mode='ios'
                    slot='end'
                    style={{
                      margin: "0.5rem",
                      width: "2.75rem",
                      height: "2.75rem",
                    }}
                    onClick={() => setState({ showChatModal: true })}
                  >
                    <IonIcon
                      icon={chatbubbles}
                      style={{ fontSize: "1.5rem" }}
                    />
                  </IonFabButton>
                  <IonFabButton
                    className='placeholder-fab'
                    color='main-beige'
                    mode='ios'
                    slot='end'
                    style={{
                      margin: "0.5rem",
                      width: "2.75rem",
                      height: "2.75rem",
                    }}
                    onClick={() => setState({ showPowerUpModal: true })}
                  >
                    <IonIcon icon={flash} style={{ fontSize: "1.5rem" }} />
                  </IonFabButton>
                </IonButtons>
              </>
            )}
          {isAfter(Date.now(), parseISO(challenge.endAt!)) && (
            <>
              <IonButtons slot='end'>
                <IonFabButton
                  className='placeholder-fab'
                  color='main-beige'
                  mode='ios'
                  slot='end'
                  style={{
                    margin: "0.5rem",
                    width: "2.75rem",
                    height: "2.75rem",
                  }}
                  onClick={() => setState({ showChatModal: true })}
                >
                  <IonIcon icon={chatbubbles} style={{ fontSize: "1.5rem" }} />
                </IonFabButton>
              </IonButtons>
            </>
          )}
        </IonToolbar>
        {state.editMode && (
          <div className='create-challenge-header'>
            <IonGrid>
              <IonRow className='ion-padding-horizontal ion-padding-bottom'>
                <IonText
                  color='white'
                  style={{ fontWeight: "bold", fontSize: "1.5rem" }}
                >
                  Edit your challenge
                </IonText>
              </IonRow>
            </IonGrid>
          </div>
        )}

        {!isPlatform("desktop") && <div className='challenges-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
        {state.editMode ? (
          <EditChallenge
            state={editState}
            setState={setEditState}
            hasError={hasEditError}
          />
        ) : (
          <>
            <IonGrid className='ion-margin-top'>
              {renderHeader()}
              <IonRow className='ion-padding-horizontal ion-padding-bottom'>
                <IonText style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                  {challenge.title}
                </IonText>
              </IonRow>
            </IonGrid>
            <IonRow
              className='ion-justify-content-start ion-padding-horizontal ion-padding-top'
              style={{ marginBottom: "1rem" }}
            >
              <IonButton
                shape='round'
                mode='ios'
                fill='solid'
                color={tab === "details" ? "main-beige" : "light"}
                onClick={() => setTab("details")}
                style={{
                  width: "5rem",
                  height: "2.5rem",
                }}
              >
                <IonText style={{ fontWeight: "bold" }}>Details</IonText>
              </IonButton>
              <IonButton
                shape='round'
                mode='ios'
                fill='solid'
                color={tab === "participants" ? "main-beige" : "light"}
                onClick={() => setTab("participants")}
                style={{
                  width: "7.75rem",
                  height: "2.5rem",
                }}
              >
                <IonText style={{ fontWeight: "bold" }}>Participants</IonText>
              </IonButton>
            </IonRow>
            {renderTabs()}
          </>
        )}
        <PowerUpModal
          showModal={state.showPowerUpModal}
          setShowModal={(showModal) => {
            setState({ showPowerUpModal: showModal });
          }}
          challengeData={challenge}
          refreshChallengeCallback={async () => {
            return fetchData();
          }}
        />
        <UploadProofModal
          challenge={challenge}
          userData={challenge.participants.accepted.completed.find(
            (p) => p.userId === user?.userId
          )}
          uploadCallback={(data) => setChallenge(data)}
          showModal={state.showUploadProofModal}
          setShowModal={(showModal) =>
            setState({ showUploadProofModal: showModal })
          }
        />
        <ViewProofModal
          userData={state.userUnderViewing}
          showModal={state.showViewProofModal}
          setShowModal={(showModal) =>
            setState({ showViewProofModal: showModal })
          }
        />
        <VoteModal
          showModal={state.showVoteModal}
          setShowModal={(showModal) => setState({ showVoteModal: showModal })}
          challengeId={challenge.challengeId}
          hasReleasedResults={challenge.hasReleasedResult}
          participantsCompleted={challenge.participants.accepted.completed}
          participantsCount={
            challenge.participants.accepted.completed.length +
            challenge.participants.accepted.notCompleted.length
          }
        />
        <EditParticipantsModal
          accepted={state.participants.accepted.notCompleted}
          pending={state.participants.pending}
          showModal={state.showParticipantModal}
          setShowModal={(showModal) =>
            setState({ showParticipantModal: showModal })
          }
          completionCallback={async (invitedUsers) => {
            setState({ invitedUsers: invitedUsers });
            setState({ showParticipantModal: false });
            const updatedParticipants: string[] = invitedUsers.map(
              (u) => u.userId
            );
            const data: ChallengePost = {
              title: challenge.title,
              description: challenge.description,
              startAt: challenge.startAt!,
              endAt: challenge.endAt,
              type: challenge.type,
              inviteType: challenge.inviteType,
              participants: updatedParticipants,
            };
            setState({ isLoading: true });
            try {
              await updateChallenge(challenge.challengeId, data);
              await fetchData();
              setState({ isLoading: false, showParticipantModal: false });
            } catch (error) {
              console.log(error);
              setState({
                isLoading: false,
                hasConfirm: false,
                showAlert: true,
                alertHeader: "Ooooops",
                alertMessage:
                  "Our server is taking a break, come back later please :)",
              });
            }
          }}
        />

        <Chat
          chatId={challenge.challengeId}
          participants={allParticipants}
          showModal={state.showChatModal}
          setShowModal={(showModal) => setState({ showChatModal: showModal })}
        />
        <OfflineToast
          message='Sorry, we need the internets to do that :('
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
        <IonToast
          isOpen={state.showToast}
          onDidDismiss={() => setState({ showToast: false })}
          message={state.toastMessage}
          duration={1500}
        />
      </IonContent>
      {renderFooter()}
    </IonPage>
  );
};

export default ChallengeDetails;
