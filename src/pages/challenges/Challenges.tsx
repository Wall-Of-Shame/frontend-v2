import {
  IonAvatar,
  IonBadge,
  IonButton,
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
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Challenges.scss";
import { useEffect, useReducer, useState } from "react";
import { refreshOutline, notificationsOutline } from "ionicons/icons";
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
import { useSocket } from "../../contexts/SocketContext";
import { Avatar } from "../../interfaces/models/Users";
import { useWindowSize } from "../../utils/WindowUtils";
import ChallengePageImg from "./challengePageImg";

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
  const { isDesktop } = useWindowSize();
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
                              style={{ marginTop: "0.5rem" }}
                              className='ion-align-items-center'
                            >
                              <IonAvatar
                                className='avatar'
                                key={c.owner.userId}
                                style={{ marginRight: "0.5rem" }}
                              >
                                <AvatarImg avatar={c.owner.avatar as Avatar} />
                              </IonAvatar>
                              <IonText
                                style={{
                                  fontSize: "0.8rem",
                                }}
                              >
                                Created by {c.owner.name ?? "Anonymous"}
                              </IonText>
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
            <IonRow
              className='ion-padding ion-justify-content-center'
              style={{ marginTop: "1.5rem" }}
            >
              {"There's nothing here >_<"}
            </IonRow>
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
                                  style={{ marginTop: "0.5rem" }}
                                  className='ion-align-items-center'
                                >
                                  <IonAvatar
                                    className='avatar'
                                    key={c.owner.userId}
                                    style={{ marginRight: "0.5rem" }}
                                  >
                                    <AvatarImg
                                      avatar={c.owner.avatar as Avatar}
                                    />
                                  </IonAvatar>
                                  <IonText
                                    style={{
                                      fontSize: "0.8rem",
                                    }}
                                  >
                                    Created by {c.owner.name ?? "Anonymous"}
                                  </IonText>
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
                                    {acceptedCount === 1 ? " has " : "s have "}
                                    accepted
                                  </IonText>
                                </IonRow>
                                <IonRow
                                  style={{ marginTop: "0.5rem" }}
                                  className='ion-align-items-center'
                                >
                                  <IonAvatar
                                    className='avatar'
                                    key={c.owner.userId}
                                    style={{ marginRight: "0.5rem" }}
                                  >
                                    <AvatarImg
                                      avatar={c.owner.avatar as Avatar}
                                    />
                                  </IonAvatar>
                                  <IonText
                                    style={{
                                      fontSize: "0.8rem",
                                    }}
                                  >
                                    Created by {c.owner.name ?? "Anonymous"}
                                  </IonText>
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
            <IonRow
              className='ion-padding ion-justify-content-center'
              style={{ marginTop: "1.5rem" }}
            >
              {"There's nothing here >_<"}
            </IonRow>
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
    <IonPage style={{ background: "#ffffff" }}>
      <IonHeader className='ion-no-border'>
        <IonToolbar
          color='main-beige'
          mode='md'
          className='challenges-header'
          style={{ paddingTop: "0.5rem", paddingBottom: "0.25rem" }}
        >
          <IonTitle
            size='large'
            color='white'
            style={{
              fontWeight: "800",
              fontSize: isDesktop ? "1.5rem" : "2rem",
            }}
          >
            Challenges
          </IonTitle>
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
            routerLink='/challenges/invitations'
          >
            <IonIcon
              icon={notificationsOutline}
              style={{ fontSize: "1.5rem" }}
            />
            {pendingResponse.length > 0 && (
              <IonBadge
                mode='ios'
                color='danger'
                style={{
                  position: "absolute",
                  top: "0.4rem",
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
        {!isDesktop && <div className='challenges-header-curve' />}
      </IonHeader>
      <IonContent fullscreen>
        <IonRow className='ion-justify-content-center ion-padding-bottom'>
          <ChallengePageImg
            user={user}
            active={ongoing && ongoing.length > 0}
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
            color='main-yellow'
            routerLink='challenges/create'
          >
            Create a new challenge
          </IonButton>
        </IonRow>
        <IonRow
          className='ion-justify-content-start ion-padding-horizontal ion-padding-top'
          style={{ marginBottom: "1.5rem" }}
        >
          <IonButton
            shape='round'
            mode='ios'
            fill='solid'
            color={tab === "ongoing" ? "main-beige" : "light"}
            onClick={() => setTab("ongoing")}
          >
            <IonText style={{ fontWeight: "bold" }}>Ongoing</IonText>
          </IonButton>
          <IonButton
            shape='round'
            mode='ios'
            fill='solid'
            color={tab === "pending" ? "main-beige" : "light"}
            onClick={() => setTab("pending")}
          >
            <IonText style={{ fontWeight: "bold" }}>Upcoming</IonText>
          </IonButton>
        </IonRow>
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
