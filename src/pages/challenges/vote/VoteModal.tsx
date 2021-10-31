import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonModal,
  IonRow,
  IonText,
  IonTitle,
  IonToast,
  IonToolbar,
} from "@ionic/react";
import "./VoteModal.scss";
import { arrowBack, refreshOutline } from "ionicons/icons";
import { UserMini } from "../../../interfaces/models/Challenges";
import { useUser } from "../../../contexts/UserContext";
import { useEffect, useReducer, useState } from "react";
import LoadingSpinner from "../../../components/loadingSpinner";
import Alert from "../../../components/alert";
import { useChallenge } from "../../../contexts/ChallengeContext";
import { VoteList } from "../../../interfaces/models/Votes";
import AvatarImg from "../../../components/avatar";
import ViewProofModal from "../proof/view";
import { addHours, isAfter, parseISO } from "date-fns";

interface VoteModalProps {
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  challengeId: string;
  endAt: string;
  participantsCount: number;
  participantsCompleted: UserMini[];
}

interface VoteModalState {
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
  okText?: string;
  showToast: boolean;
  toastMessage: string;
  showProofModal: boolean;
  userData: UserMini | undefined;
}

const VoteModal: React.FC<VoteModalProps> = (props: VoteModalProps) => {
  const { user } = useUser();
  const { showModal, setShowModal, challengeId, endAt, participantsCompleted } =
    props;
  const { getVotes, voteForParticipant } = useChallenge();
  const hasVotingEnded = isAfter(Date.now(), addHours(parseISO(endAt), 1));

  const [votes, setVotes] = useState<VoteList>([]);
  const [state, setState] = useReducer(
    (s: VoteModalState, a: Partial<VoteModalState>) => ({
      ...s,
      ...a,
    }),
    {
      isLoading: false,
      showAlert: false,
      alertHeader: "",
      alertMessage: "",
      hasConfirm: false,
      confirmHandler: () => {},
      cancelHandler: () => {},
      okHandler: undefined,
      okText: undefined,
      showToast: false,
      toastMessage: "",
      showProofModal: false,
      userData: undefined,
    }
  );

  const handleVote = async (userId: string) => {
    if (userId === user?.userId) {
      setState({
        showAlert: true,
        hasConfirm: false,
        alertHeader: "Seriously?",
        alertMessage: "You wanna vote yourself to the Wall of Shame? 🌚",
        okText: "Fine",
      });
      return;
    }
    setState({
      isLoading: false,
      showAlert: true,
      hasConfirm: true,
      alertHeader: "Are you sure?",
      alertMessage:
        "This action cannot be undone, please do not sabotage your friend for fun :)",
      confirmHandler: () => confirmHandler(userId),
    });
  };

  const confirmHandler = async (userId: string) => {
    setState({ isLoading: true });
    try {
      await voteForParticipant(challengeId, userId);
      await fetchData();
      setState({ isLoading: false });
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

  const fetchData = async () => {
    setState({ isLoading: true });
    try {
      const votes = await getVotes(challengeId);
      setVotes(votes);
      setState({ isLoading: false });
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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userCard = (u: UserMini) => {
    const vote = votes.find((v) => v.victim.userId === u.userId);
    const hasVoted = vote?.accusers.findIndex((a) => a === user?.userId) !== -1;
    return (
      <IonCol
        size='6'
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginTop: "1rem",
        }}
        key={u.username}
      >
        <IonRow className='ion-align-items'>
          <IonAvatar
            className='edit-profile-avatar'
            style={{ marginBottom: "0.75rem" }}
          >
            <AvatarImg avatar={u.avatar} />
          </IonAvatar>
        </IonRow>
        <IonRow style={{ marginBottom: "0.25rem" }}>
          <IonText style={{ fontWeight: "bold" }}>{u.name}</IonText>
        </IonRow>
        <IonRow style={{ marginBottom: "0.25rem" }}>
          <IonText style={{ fonrtSize: "0.75rem" }}>@{u.username}</IonText>
        </IonRow>
        <IonRow style={{ marginBottom: "0.75rem" }}>
          <IonText>
            {vote?.accusers.length
              ? `${
                  vote.accusers.length === 1
                    ? "1 vote"
                    : vote.accusers.length + " votes"
                }`
              : "0 votes"}
          </IonText>
        </IonRow>
        <IonRow>
          {!hasVotingEnded &&
            u.evidenceLink !== undefined &&
            u.evidenceLink !== "" && (
              <IonButton
                mode='ios'
                shape='round'
                color='main-blue'
                fill='solid'
                style={{ height: "2.5rem", width: "4.5rem" }}
                onClick={() => {
                  setState({ userData: u, showProofModal: true });
                }}
              >
                <IonText
                  style={{
                    fontSize: 15,
                    fontWeight: 600,
                  }}
                >
                  Proof
                </IonText>
              </IonButton>
            )}
          {!hasVotingEnded && (
            <IonButton
              mode='ios'
              shape='round'
              color='main-yellow'
              fill='solid'
              style={{ height: "2.5rem", width: "4.5rem" }}
              onClick={() => handleVote(u.userId)}
              disabled={hasVoted}
            >
              <IonText
                style={{
                  fontSize: 15,
                  fontWeight: 600,
                }}
              >
                {hasVoted ? "Voted" : "Vote"}
              </IonText>
            </IonButton>
          )}
        </IonRow>
      </IonCol>
    );
  };

  return (
    <IonModal
      isOpen={showModal}
      mode='ios'
      onDidDismiss={() => setShowModal(false)}
      backdropDismiss={false}
    >
      <IonHeader className='ion-no-border'>
        <IonToolbar color='main-beige' mode='md' className='store-header'>
          <IonButtons slot='start'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              onClick={() => setShowModal(false)}
            >
              <IonIcon
                icon={arrowBack}
                color='white'
                style={{ fontSize: "1.5rem" }}
              />
            </IonButton>
          </IonButtons>
          <IonTitle size='large' color='white'>
            Vote
          </IonTitle>
          <IonButton
            className='placeholder-fab ion-align-items-center'
            color='main-beige'
            mode='ios'
            shape='round'
            slot='end'
            disabled
            style={{
              margin: "0.5rem",
              height: "2.75rem",
            }}
          ></IonButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonContent>
          <IonFab vertical='bottom' horizontal='end' slot='fixed'>
            <IonFabButton color='main-beige' onClick={fetchData} mode='ios'>
              <IonIcon icon={refreshOutline} />
            </IonFabButton>
          </IonFab>
          <IonGrid>
            <IonRow className='ion-padding'>
              <IonText style={{ fontWeight: "bold", fontSize: "1.5rem" }}>
                {isAfter(Date.now(), addHours(parseISO(endAt), 1))
                  ? "Here are the voting results"
                  : "Vote to banish a cheater to the wall"}
              </IonText>
            </IonRow>
            <IonRow className='ion-padding-horizontal ion-padding-top'>
              <IonText style={{ fontSize: 17 }}>
                Rule: At least <strong>50%</strong> of the participants have to
                vote for a successful shaming 😊
              </IonText>
            </IonRow>
          </IonGrid>

          {participantsCompleted.length > 0 ? (
            <IonGrid>
              <IonRow className='ion-padding-bottom'>
                {participantsCompleted.map((p) => {
                  return userCard(p);
                })}
              </IonRow>
            </IonGrid>
          ) : (
            <IonGrid
              style={{
                display: "flex",
                height: "50%",
                alignItems: "center",
              }}
              className='ion-justify-content-center'
            >
              <IonRow className='ion-justify-content-center ion-margin ion-text-center'>
                No participant has completed the challenge :')
              </IonRow>
            </IonGrid>
          )}
          <div style={{ margin: "1rem" }} />
        </IonContent>
        <ViewProofModal
          userData={state.userData}
          showModal={state.showProofModal}
          setShowModal={(showModal) => setState({ showProofModal: showModal })}
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
          okText={state.okText}
        />
        <IonToast
          isOpen={state.showToast}
          mode='ios'
          onDidDismiss={() => setState({ showToast: false })}
          message={state.toastMessage}
          duration={1500}
        />
      </IonContent>
    </IonModal>
  );
};

export default VoteModal;
