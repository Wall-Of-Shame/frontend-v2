import {
  IonAvatar,
  IonBadge,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonLabel,
  IonPage,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Challenges.scss";
import { useEffect, useReducer, useState } from "react";
import { chevronForward, refreshOutline, mailOutline } from "ionicons/icons";
import { hideTabs, showTabs } from "../../utils/TabsUtils";
import { useHistory, useLocation } from "react-router";
import SetUpProfileModal from "../../components/setupProfile/ProfileSetUpModal";
import { useUser } from "../../contexts/UserContext";
import { useChallenge } from "../../contexts/ChallengeContext";
import { useSelector } from "react-redux";
import { ChallengeData } from "../../interfaces/models/Challenges";
import { RootState } from "../../reducers/RootReducer";
import { ChallengeDux } from "../../reducers/ChallengeDux";
import LoadingSpinner from "../../components/loadingSpinner";
import Alert from "../../components/alert";
import { format } from "date-fns";
import parseISO from "date-fns/parseISO";
import AvatarImg from "../../components/avatar";
import { isPlatform } from "@ionic/core";
import { useSocket } from "../../contexts/SocketContext";
import challenge from "../../assets/onboarding/challenge.png";

interface ChallengesState {
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

const Challenges: React.FC = () => {
  const { user } = useUser();
  const { connect } = useSocket();
  const location = useLocation();
  const history = useHistory();
  const { getAllChallenges } = useChallenge();
  const selectChallenges = (state: RootState): ChallengeDux => state.challenges;

  const [tab, setTab] = useState("ongoing");
  const [showModal, setShowModal] = useState(false);

  const [ongoing, setOngoing] = useState<ChallengeData[]>(
    useSelector(selectChallenges).ongoing
  );

  const [pendingResponse, setPendingResponse] = useState<ChallengeData[]>(
    useSelector(selectChallenges).pendingResponse
  );

  const [pendingStart, setPendingStart] = useState<ChallengeData[]>(
    useSelector(selectChallenges).pendingStart
  );

  const [state, setState] = useReducer(
    (s: ChallengesState, a: Partial<ChallengesState>) => ({
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
    }
  );

  const connectToSocket = async () => {
    await connect();
  };

  useEffect(() => {
    fetchData();
    connectToSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (
      location.pathname === "/challenges" ||
      location.pathname === "/explore" ||
      location.pathname === "/wall-of-shame" ||
      location.pathname === "/store" ||
      location.pathname === "/profile"
    ) {
      showTabs();
    } else {
      hideTabs();
    }
  }, [location.pathname]);

  const fetchData = async () => {
    try {
      const allChallenges = await getAllChallenges();
      setOngoing(allChallenges.ongoing);
      setPendingStart(allChallenges.pendingStart);
      setPendingResponse(allChallenges.pendingResponse);
    } catch (error) {
      console.log(error);
    }
  };

  const renderChallenges = () => {
    switch (tab) {
      case "ongoing":
        if (ongoing && ongoing.length > 0) {
          return (
            <>
              {ongoing?.map((c) => {
                const acceptedCount = c.participants.accepted.completed.concat(
                  c.participants.accepted.notCompleted
                ).length;
                return (
                  <IonCard
                    mode='ios'
                    button
                    key={c.challengeId}
                    onClick={() => {
                      history.push(`challenges/${c.challengeId}/details`, c);
                    }}
                  >
                    <IonGrid className='ion-no-padding'>
                      <IonRow className='ion-align-items-center'>
                        <IonCol size='12'>
                          <IonCardHeader style={{ paddingBottom: "0.75rem" }}>
                            <IonCardTitle style={{ fontSize: "1.2rem" }}>
                              {c.title}
                            </IonCardTitle>
                          </IonCardHeader>
                          <IonCardContent>
                            <IonRow>
                              <IonText
                                style={{
                                  fontSize: "0.8rem",
                                  fontWeight: "bold",
                                  marginBottom: "0.25rem",
                                }}
                              >
                                {`Ends at: ${format(
                                  parseISO(c.endAt),
                                  "dd MMM yyyy, HH:mm"
                                )}`}
                              </IonText>
                            </IonRow>
                            <IonRow style={{ marginTop: "0.5rem" }}>
                              <IonText style={{ fontSize: "0.8rem" }}>
                                {acceptedCount} participant
                                {acceptedCount === 1 ? "" : "s"}
                              </IonText>
                            </IonRow>
                            <IonRow
                              style={{ paddingTop: "0.5rem" }}
                              className='ion-align-items-center'
                            >
                              {c.participants.accepted.completed
                                .concat(c.participants.accepted.notCompleted)
                                .map((p) => {
                                  return (
                                    <IonAvatar
                                      className='avatar'
                                      key={p.userId}
                                      style={{ marginRight: "0.25rem" }}
                                    >
                                      <AvatarImg avatar={p.avatar} />
                                    </IonAvatar>
                                  );
                                })}
                            </IonRow>
                          </IonCardContent>
                        </IonCol>
                      </IonRow>
                    </IonGrid>
                  </IonCard>
                );
              })}
            </>
          );
        } else {
          return (
            <IonGrid
              style={{
                display: "flex",
                height: "37.5vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IonRow className='ion-padding ion-justify-content-center'>
                {"There's nothing here >_<"}
              </IonRow>
            </IonGrid>
          );
        }
      case "pending":
        if (
          (pendingResponse && pendingResponse.length > 0) ||
          (pendingStart && pendingStart.length > 0)
        ) {
          return (
            <>
              {pendingResponse.length > 0 && (
                <>
                  <IonRow className='ion-padding-horizontal ion-margin-top'>
                    <IonText style={{ color: "gray" }}>
                      Pending Invitations
                    </IonText>
                  </IonRow>
                  {pendingResponse?.map((c) => {
                    const acceptedCount =
                      c.participants.accepted.completed.concat(
                        c.participants.accepted.notCompleted
                      ).length;
                    return (
                      <IonCard
                        mode='ios'
                        button
                        key={c.challengeId}
                        onClick={() => {
                          history.push(
                            `challenges/${c.challengeId}/details`,
                            c
                          );
                        }}
                      >
                        <IonGrid className='ion-no-padding'>
                          <IonRow className='ion-align-items-center'>
                            <IonCol size='12'>
                              <IonCardHeader
                                style={{ paddingBottom: "0.75rem" }}
                              >
                                <IonCardTitle style={{ fontSize: "1.2rem" }}>
                                  {c.title}
                                </IonCardTitle>
                              </IonCardHeader>
                              <IonCardContent>
                                <IonRow>
                                  <IonText
                                    style={{
                                      fontSize: "0.8rem",
                                      fontWeight: "bold",
                                      marginBottom: "0.25rem",
                                    }}
                                  >
                                    Waiting for your response
                                  </IonText>
                                </IonRow>
                                <IonRow style={{ marginTop: "0.5rem" }}>
                                  <IonText style={{ fontSize: "0.8rem" }}>
                                    {acceptedCount} participant
                                    {acceptedCount === 1 ? "" : "s"}
                                  </IonText>
                                </IonRow>
                                <IonRow
                                  style={{ paddingTop: "0.5rem" }}
                                  className='ion-align-items-center'
                                >
                                  {c.participants.accepted.completed
                                    .concat(
                                      c.participants.accepted.notCompleted
                                    )
                                    .map((p) => {
                                      return (
                                        <IonAvatar
                                          className='avatar'
                                          key={p.userId}
                                          style={{ marginRight: "0.25rem" }}
                                        >
                                          <AvatarImg avatar={p.avatar} />
                                        </IonAvatar>
                                      );
                                    })}
                                </IonRow>
                              </IonCardContent>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonCard>
                    );
                  })}
                </>
              )}
              {pendingStart.length > 0 && (
                <>
                  {pendingStart?.map((c) => {
                    const acceptedCount =
                      c.participants.accepted.completed.concat(
                        c.participants.accepted.notCompleted
                      ).length;
                    return (
                      <IonCard
                        mode='ios'
                        button
                        key={c.challengeId}
                        onClick={() => {
                          history.push(
                            `challenges/${c.challengeId}/details`,
                            c
                          );
                        }}
                      >
                        <IonGrid className='ion-no-padding'>
                          <IonRow className='ion-align-items-center'>
                            <IonCol size='12'>
                              <IonCardHeader
                                style={{ paddingBottom: "0.75rem" }}
                              >
                                <IonCardTitle style={{ fontSize: "1.2rem" }}>
                                  {c.title}
                                </IonCardTitle>
                              </IonCardHeader>
                              <IonCardContent>
                                <IonRow>
                                  <IonText
                                    style={{
                                      fontSize: "0.8rem",
                                      fontWeight: "bold",
                                      marginBottom: "0.25rem",
                                    }}
                                  >
                                    {`Starts on ${format(
                                      parseISO(c.startAt!),
                                      "dd MMM yyyy, HH:mm"
                                    )}`}
                                  </IonText>
                                </IonRow>
                                <IonRow style={{ marginTop: "0.5rem" }}>
                                  <IonText style={{ fontSize: "0.8rem" }}>
                                    {acceptedCount} participant
                                    {acceptedCount === 1 ? "" : "s"} have
                                    accepted
                                  </IonText>
                                </IonRow>
                                <IonRow
                                  style={{ paddingTop: "0.5rem" }}
                                  className='ion-align-items-center'
                                >
                                  {c.participants.accepted.completed
                                    .concat(
                                      c.participants.accepted.notCompleted
                                    )
                                    .map((p) => {
                                      return (
                                        <IonAvatar
                                          className='avatar'
                                          key={p.userId}
                                          style={{ marginRight: "0.25rem" }}
                                        >
                                          <AvatarImg avatar={p.avatar} />
                                        </IonAvatar>
                                      );
                                    })}
                                </IonRow>
                              </IonCardContent>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonCard>
                    );
                  })}
                </>
              )}
            </>
          );
        } else {
          return (
            <IonGrid
              style={{
                display: "flex",
                height: "37.5vh",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <IonRow className='ion-padding ion-justify-content-center'>
                {"There's nothing here >_<"}
              </IonRow>
            </IonGrid>
          );
        }
    }
  };

  useEffect(() => {
    // fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (!user?.username || !user?.name) {
        setShowModal(true);
      }
    }, 1000);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar>
          <IonTitle
            size='large'
            style={{ paddingBottom: isPlatform("ios") ? "1rem" : 0 }}
          >
            Challenges
          </IonTitle>
          <IonFabButton
            color='light'
            mode='ios'
            slot='end'
            style={{
              margin: "0.5rem",
              width: "3rem",
              height: "3rem",
            }}
            routerLink='/challenges/invitations'
          >
            <IonIcon icon={mailOutline} />
            {pendingResponse.length >= 0 && (
              <IonBadge
                mode='ios'
                color='danger'
                style={{
                  position: "absolute",
                  top: "0.45rem",
                  right: "0.3rem",
                  width: "1rem",
                  height: "1rem",
                }}
              >
                &nbsp;
              </IonBadge>
            )}
          </IonFabButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonRow className='ion-justify-content-center ion-padding'>
          <img
            src={challenge}
            alt='Challenge'
            className='create-challenge-img'
          />
        </IonRow>
        <IonRow
          className='ion-justify-content-center'
          style={{ marginBottom: "1.5rem" }}
        >
          <IonButton
            shape='round'
            mode='ios'
            fill='solid'
            color='secondary'
            routerLink='challenges/create'
          >
            Create a new challenge
          </IonButton>
        </IonRow>
        <IonSegment
          onIonChange={(e) => setTab(e.detail.value ?? "active")}
          value={tab}
          mode='md'
          color='dark'
          style={{
            marginTop: "1rem",
            paddingRight: "0.5rem",
            paddingLeft: "0.5rem",
          }}
        >
          <IonSegmentButton value='ongoing' className='ion-text-capitalize'>
            <IonLabel>Ongoing</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value='pending' className='ion-text-capitalize'>
            <IonLabel>Upcoming</IonLabel>
          </IonSegmentButton>
        </IonSegment>
        {renderChallenges()}
        <IonFab vertical='bottom' horizontal='end' slot='fixed'>
          <IonFabButton color='senary' onClick={fetchData} mode='ios'>
            <IonIcon icon={refreshOutline} />
          </IonFabButton>
        </IonFab>
        <SetUpProfileModal showModal={showModal} setShowModal={setShowModal} />
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
    </IonPage>
  );
};

export default Challenges;
