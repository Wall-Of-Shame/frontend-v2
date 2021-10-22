import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFabButton,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonTextarea,
  IonToast,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { useReducer, useState } from "react";
import {
  arrowBack,
  paperPlane,
  pencilOutline,
  personAddOutline,
} from "ionicons/icons";
import { useEffect } from "react";
import { Redirect, useHistory, useLocation } from "react-router";
import { useChallenge } from "../../../contexts/ChallengeContext";
import {
  ChallengeData,
  ChallengePost,
  UserMini,
} from "../../../interfaces/models/Challenges";
import "./ChallengeDetails.scss";
import { formatISO, parseISO } from "date-fns";
import { database } from "../../../firebase";
import { ref, set } from "firebase/database";
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
import { VoteData } from "../../../interfaces/models/Votes";
import OfflineToast from "../../../components/offlineToast";
import Participants from "./Participants";
import FooterActions from "./FooterActions";
import EditParticipantsModal from "../../../components/participants/EditParticipantsModal";
import DetailsTab from "./DetailsTab";
import Chat from "./Chat";
import uniqid from "uniqid";

interface ChallengeDetailsProps {}

interface ChallengeDetailsState {
  editMode: boolean;
  showUploadProofModal: boolean;
  showViewProofModal: boolean;
  userUnderViewing: UserMini | undefined;
  showVoteModal: boolean;
  showParticipantModal: boolean;
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

const ChallengeDetails: React.FC<ChallengeDetailsProps> = () => {
  const location = useLocation();
  const history = useHistory();
  const { user } = useUser()!;
  const {
    getChallenge,
    acceptChallenge,
    rejectChallenge,
    getVotes,
    releaseResults,
    updateChallenge,
  } = useChallenge();

  const [challenge, setChallenge] = useState<ChallengeData | null>(
    location.state as ChallengeData
  );
  const [tab, setTab] = useState("details");
  const [countdown, setCountdown] = useState<Duration | null>(null);
  const [didFinish, setDidFinish] = useState(false);
  const [showOfflineToast, setShowOfflineToast] = useState(false);
  const [state, setState] = useReducer(
    (s: ChallengeDetailsState, a: Partial<ChallengeDetailsState>) => ({
      ...s,
      ...a,
    }),
    {
      editMode: false,
      showUploadProofModal: false,
      showViewProofModal: false,
      userUnderViewing: undefined,
      showVoteModal: false,
      showParticipantModal: false,
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

  const fetchData = async () => {
    try {
      const locationState = location.state as ChallengeData;
      if (!locationState) {
        return;
      }
      const challenge = await getChallenge(locationState.challengeId);
      if (challenge) {
        setChallenge(challenge);
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

  const handleSendMessage = async (): Promise<void> => {
    if (!challenge) {
      return;
    }
    const timestamp = new Date().getTime();
    try {
      set(
        ref(
          database,
          `chat/${challenge.challengeId}/${timestamp}+${user?.userId}`
        ),
        {
          messageId: uniqid(),
          name: user?.name,
          userId: user?.userId,
          content: state.message,
          time: formatISO(Date.now()),
        }
      ).then(() => {
        setState({ message: "" });
      });
    } catch (error) {
      console.log(error);
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

  const handlePublishFailedUsersToFirebase = async (
    usersToShame: UserMini[]
  ): Promise<void> => {
    if (!challenge) {
      return;
    }
    const promises = usersToShame.map((u) => {
      const timestamp = new Date().getTime();
      return new Promise<void>((resolve, reject) => {
        set(ref(database, `shames/${timestamp}+${u.userId}`), {
          name: u.name,
          title: challenge.title,
          time: formatISO(Date.now()),
          timestamp: timestamp,
          avatar: u.avatar,
        })
          .then(() => resolve())
          .catch(() => reject());
      });
    });
    return await Promise.all(promises)
      .then(() => {
        return;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
  };

  const handlePublishCheatersToFirebase = async (
    usersToShame: VoteData[]
  ): Promise<void> => {
    if (!challenge) {
      return;
    }
    const promises = usersToShame.map((u) => {
      const timestamp = new Date().getTime();
      const victimData = challenge.participants.accepted.completed.find(
        (p) => p.userId === u.victim.userId
      );
      if (!victimData) {
        return Promise.resolve();
      }
      return new Promise<void>((resolve, reject) => {
        set(ref(database, `shames/${timestamp}+${u.victim.userId}`), {
          name: u.victim.name,
          title: challenge.title,
          type: "cheat",
          time: formatISO(Date.now()),
          timestamp: timestamp,
          avatar: victimData.avatar,
        })
          .then(() => resolve())
          .catch(() => reject());
      });
    });
    return await Promise.all(promises)
      .then(() => {
        return;
      })
      .catch((error) => {
        return Promise.reject(error);
      });
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

  const handleReleaseResults = async () => {
    if (challenge === null) {
      return;
    }
    setState({ isLoading: true });
    try {
      const votes = await getVotes(challenge.challengeId);
      const cheaters: VoteData[] = votes.filter((v) => {
        return (
          v.accusers.length >=
          challenge.participants.accepted.completed.concat(
            challenge.participants.accepted.notCompleted
          ).length /
            2
        );
      });
      const cheaterIds = cheaters.map((c) => c.victim.userId);
      await releaseResults(challenge.challengeId, cheaterIds);
      const updatedChallenge = await getChallenge(challenge.challengeId);
      if (updatedChallenge) {
        setChallenge(updatedChallenge);
        await handlePublishFailedUsersToFirebase(
          updatedChallenge.participants.accepted.notCompleted
        );
      } else {
        await handlePublishFailedUsersToFirebase(
          challenge.participants.accepted.notCompleted
        );
      }
      await handlePublishCheatersToFirebase(cheaters);
      setState({
        isLoading: false,
        showAlert: true,
        hasConfirm: false,
        alertHeader: "Woohoo",
        alertMessage:
          "You have released the results of this challenge. Check out the Wall :)",
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

  useInterval(() => {
    if (didFinish) {
      return;
    }
    if (challenge === null) {
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
      case "chat":
        return (
          <Chat
            chatId={challenge.challengeId}
            participants={challenge.participants.accepted.completed.concat(
              challenge.participants.accepted.notCompleted
            )}
          />
        );
    }
  };

  const renderFooter = () => {
    if (!challenge) {
      return <></>;
    }
    switch (tab) {
      case "details":
        return (
          <IonFooter translucent={true}>
            <IonToolbar>
              <FooterActions
                challenge={challenge}
                viewVoteCallback={() => setState({ showVoteModal: true })}
                uploadProofCallback={() =>
                  setState({ showUploadProofModal: true })
                }
                handleAccept={handleAccept}
                handleReject={handleReject}
                handleComplete={handleComplete}
                handleReleaseResults={handleReleaseResults}
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
            </IonToolbar>
          </IonFooter>
        );
      case "participants":
        return <></>;
      case "chat":
        return (
          <IonFooter translucent={true}>
            <IonToolbar>
              <IonRow
                className='ion-align-items-center'
                style={{ margin: "0.5rem" }}
              >
                <IonCol size='11'>
                  <div
                    style={{
                      width: "100%",
                      borderRadius: "2rem",
                      background: "#ffffff",
                      paddingLeft: "0.75rem",
                      boxShadow: "rgba(149, 149, 149, 0.2) 0px 2px 10px 0px",
                    }}
                  >
                    <IonTextarea
                      value={state.message ?? ""}
                      rows={1}
                      autoCorrect='on'
                      placeholder='Message...'
                      onIonChange={(event) => {
                        setState({
                          message: event.detail.value ?? "",
                        });
                      }}
                    />
                  </div>
                </IonCol>
                <IonCol size='1'>
                  <IonIcon
                    icon={paperPlane}
                    color='main-beige'
                    size='large'
                    onClick={handleSendMessage}
                  />
                </IonCol>
              </IonRow>
            </IonToolbar>
          </IonFooter>
        );
    }
  };

  if (!challenge) {
    return <Redirect to={"challenges"} />;
  }

  if (state.editMode) {
    return (
      <EditChallenge
        challenge={challenge}
        backAction={() => setState({ editMode: false })}
      />
    );
  }

  return (
    <IonPage style={{ background: "#ffffff" }}>
      <IonHeader className='ion-no-border'>
        <IonToolbar color='main-beige' style={{ paddingTop: "0.5rem" }}>
          <IonFabButton
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
          {user?.userId === challenge.owner.userId &&
            !isAfter(Date.now(), parseISO(challenge.startAt!)) && (
              <>
                <IonButtons slot='end'>
                  <IonFabButton
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
                      icon={personAddOutline}
                      style={{ fontSize: "1.5rem" }}
                    />
                  </IonFabButton>
                  <IonFabButton
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
                    <IonIcon
                      icon={pencilOutline}
                      style={{ fontSize: "1.5rem" }}
                    />
                  </IonFabButton>
                </IonButtons>
              </>
            )}
        </IonToolbar>
        {!isPlatform("desktop") && <div className='challenges-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
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
          <IonButton
            shape='round'
            mode='ios'
            fill='solid'
            color={tab === "chat" ? "main-beige" : "light"}
            onClick={() => setTab("chat")}
            style={{
              width: "4rem",
              height: "2.5rem",
            }}
          >
            <IonText style={{ fontWeight: "bold" }}>Chat</IonText>
          </IonButton>
        </IonRow>
        {renderTabs()}
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
            await updateChallenge(challenge.challengeId, data)
              .then(() => {
                setState({ isLoading: false });
                window.location.reload();
              })
              .catch((error) => {
                console.log(error);
                setState({ isLoading: false });
                setShowOfflineToast(true);
              });
          }}
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
