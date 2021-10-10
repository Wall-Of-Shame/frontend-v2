import {
  IonButton,
  IonButtons,
  IonCard,
  IonContent,
  IonFab,
  IonFabButton,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import { useReducer, useState } from "react";
import {
  arrowBackOutline,
  pencil,
  personAdd,
  refreshOutline,
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
import { format, formatISO, parseISO } from "date-fns";
import { useUser } from "../../../contexts/UserContext";
import EditChallenge from "../edit";
import LoadingSpinner from "../../../components/loadingSpinner";
import Alert from "../../../components/alert";
import isAfter from "date-fns/isAfter";
import isBefore from "date-fns/isBefore";
import { intervalToDuration } from "date-fns/esm";
import useInterval from "../../../hooks/useInterval";
import UploadProofModal from "../proof/upload";
import VoteModal from "../vote";
import ViewProofModal from "../proof/view";
import { hideTabs } from "../../../utils/TabsUtils";
import { database } from "../../../firebase";
import { ref, set } from "firebase/database";
import { VoteData } from "../../../interfaces/models/Votes";
import ActiveChallengeImg from "../../../components/activeChallengeImg";
import PendingChallengeImg from "../../../components/pendingChallengeImg";
import highground from "../../../assets/onboarding/highground.png";
import OfflineToast from "../../../components/offlineToast";
import Countdown from "./CountDown";
import Participants from "./Participants";
import FooterActions from "./FooterActions";
import EditParticipantsModal from "../../../components/participants/EditParticipantsModal";

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
      console.log(challenge);
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
    /*
    try {
      await completeChallenge(challenge.challengeId);
      const updatedChallenge = await getChallenge(challenge.challengeId);
      if (updatedChallenge) {
        setChallenge(updatedChallenge);
      }
      setState({
        isLoading: false,
        showAlert: true,
        hasConfirm: false,
        alertHeader: "Woohoo",
        alertMessage:
          "You have completed the challenge. Now chill and watch the rest suffer :)",
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
    */
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

  const renderImage = () => {
    if (challenge === null) {
      return <Redirect to={"challenges"} />;
    }
    if (
      isAfter(Date.now(), parseISO(challenge.startAt!)) &&
      isBefore(Date.now(), parseISO(challenge.endAt!))
    ) {
      // render active challenge
      return (
        <ActiveChallengeImg
          notCompleted={challenge.participants.accepted.notCompleted}
        />
      );
    } else if (!isAfter(Date.now(), parseISO(challenge.startAt!))) {
      // render waiting challenge
      return (
        <PendingChallengeImg
          waitingToStart={challenge.participants.accepted.notCompleted}
        />
      );
    }

    return (
      <div style={{ display: "flex", justifyContent: "center" }}>
        <img
          className='completed-challenge-img'
          src={highground}
          alt='Challenge Completed!'
        ></img>
      </div>
    );
  };

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
      return (
        <IonRow className='ion-padding'>
          <IonText>Your challenge is</IonText>
        </IonRow>
      );
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

  if (challenge === null) {
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

  const startsIn = Math.round(
    (parseISO(challenge.startAt!).getTime() - new Date().getTime()) / 1000
  );

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              color='dark'
              onClick={() => {
                history.goBack();
              }}
            >
              <IonIcon icon={arrowBackOutline} size='large' />
            </IonButton>
          </IonButtons>
          {user?.userId === challenge.owner.userId && (
            <>
              <IonButtons slot='end'>
                <IonButton
                  color='dark'
                  onClick={() => setState({ showParticipantModal: true })}
                >
                  <IonIcon slot='end' icon={personAdd} />
                </IonButton>
                <IonButton
                  style={{
                    marginRight: "0.5rem",
                  }}
                  color='dark'
                  onClick={async () => {
                    setState({ isLoading: true });
                    const updatedChallenge = await getChallenge(
                      challenge.challengeId
                    );
                    if (updatedChallenge) {
                      setChallenge(updatedChallenge);
                      if (
                        isAfter(Date.now(), parseISO(updatedChallenge.endAt))
                      ) {
                        setState({
                          isLoading: false,
                          showAlert: true,
                          hasConfirm: false,
                          alertHeader: "Notice",
                          alertMessage:
                            "This challenge has already ended, it cannot be edited anymore :)",
                        });
                      } else if (
                        isAfter(Date.now(), parseISO(updatedChallenge.startAt!))
                      ) {
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
                  }}
                >
                  <IonIcon slot='end' icon={pencil} />
                </IonButton>
              </IonButtons>
            </>
          )}
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid>
          {renderHeader()}
          <IonRow className='ion-padding-horizontal ion-padding-bottom'>
            <IonText style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
              {challenge.title}
            </IonText>
          </IonRow>
        </IonGrid>
        <IonRow>
          <IonSegment
            onIonChange={(e) => setTab(e.detail.value ?? "active")}
            value={tab}
            mode='md'
            color='dark'
            style={{
              marginBottom: "2rem",
            }}
          >
            <IonSegmentButton value='details' className='ion-text-capitalize'>
              <IonLabel>Details</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton
              value='participants'
              className='ion-text-capitalize'
            >
              <IonLabel>Participants</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonRow>
        {tab === "details" ? (
          <>
            {renderImage()}
            {isAfter(Date.now(), parseISO(challenge.startAt!)) && (
              <IonCard className='ion-align-items-center ion-justify-content-center'>
                <div style={{ margin: "1rem" }} />
                <Countdown countdown={countdown} />
                <div style={{ margin: "1rem" }} />
              </IonCard>
            )}

            <IonGrid style={{ marginBottom: "0.5rem" }}>
              {startsIn > 0 && startsIn < 86400 && (
                <IonRow
                  className='ion-justify-content-center'
                  style={{ marginTop: "0.25rem", marginBottom: "1.5rem" }}
                >
                  <IonText
                    color='dark'
                    style={{ fontWeight: "bold", fontSize: "1.5rem" }}
                  >
                    Starts in:&nbsp;
                  </IonText>
                  <IonText
                    style={{ fontWeight: "bold", fontSize: "1.5rem" }}
                    color={startsIn < 3600 ? "danger" : "dark"}
                  >
                    {`${
                      intervalToDuration({
                        start: new Date(),
                        end: parseISO(challenge.startAt!),
                      }).hours
                    }h ${
                      intervalToDuration({
                        start: new Date(),
                        end: parseISO(challenge.startAt!),
                      }).minutes
                    }min`}
                  </IonText>
                </IonRow>
              )}
              <IonRow className='ion-padding-horizontal ion-padding-bottom'>
                <IonText style={{ fontWeight: "bold" }}>
                  What do we need to do?
                </IonText>
              </IonRow>
              <IonRow className='ion-padding-horizontal ion-padding-bottom'>
                <IonText>{challenge.description}</IonText>
              </IonRow>
            </IonGrid>
            <IonGrid style={{ marginBottom: "0.5rem" }}>
              <IonRow className='ion-padding-horizontal ion-padding-bottom'>
                <IonText style={{ fontWeight: "bold" }}>
                  This challenge starts at
                </IonText>
              </IonRow>
              <IonRow className='ion-padding-horizontal ion-padding-bottom'>
                <IonText>
                  {format(
                    parseISO(challenge.startAt!),
                    "EEEE, dd MMM yyyy, HH:mm"
                  )}
                </IonText>
              </IonRow>
            </IonGrid>
            <IonGrid style={{ marginBottom: "0.5rem" }}>
              <IonRow className='ion-padding-horizontal ion-padding-bottom'>
                <IonText style={{ fontWeight: "bold" }}>
                  Complete the challenge and upload your proof by
                </IonText>
              </IonRow>
              <IonRow className='ion-padding-horizontal ion-padding-bottom'>
                <IonText>
                  {format(
                    parseISO(challenge.endAt),
                    "EEEE, dd MMM yyyy, HH:mm"
                  )}
                </IonText>
              </IonRow>
            </IonGrid>
          </>
        ) : (
          <Participants
            challenge={challenge}
            viewProofCallback={(userUnderViewing) => {
              setState({
                userUnderViewing,
                showViewProofModal: true,
              });
            }}
          />
        )}
        <IonFab vertical='bottom' horizontal='end' slot='fixed'>
          <IonFabButton color='senary' onClick={fetchData} mode='ios'>
            <IonIcon icon={refreshOutline} />
          </IonFabButton>
        </IonFab>
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
      <IonFooter translucent={true}>
        <IonToolbar>
          <FooterActions
            challenge={challenge}
            viewVoteCallback={() => setState({ showVoteModal: true })}
            uploadProofCallback={() => setState({ showUploadProofModal: true })}
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
    </IonPage>
  );
};

export default ChallengeDetails;
