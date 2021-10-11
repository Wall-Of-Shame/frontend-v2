import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonPopover,
  IonRadio,
  IonRadioGroup,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonText,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { useEffect, useReducer, useState } from "react";
import "./WallOfShame.scss";
import { hideTabs, showTabs } from "../../utils/TabsUtils";
import { useLocation } from "react-router";
import {
  chevronBackOutline,
  chevronForwardOutline,
  refreshOutline,
  trophy,
} from "ionicons/icons";
import { database } from "../../firebase";
import {
  ref,
  onValue,
  query,
  orderByKey,
  limitToLast,
} from "firebase/database";
import { Shame } from "../../interfaces/models/Challenges";
import { differenceInSeconds, format, parseISO } from "date-fns";
import { UserList } from "../../interfaces/models/Users";
import { useUser } from "../../contexts/UserContext";
import LoadingSpinner from "../../components/loadingSpinner";
import Alert from "../../components/alert";
import AvatarImg from "../../components/avatar";
import { Socket } from "socket.io-client";
import { useSocket } from "../../contexts/SocketContext";
import Container from "../../components/container";

interface WallOfShameState {
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

const WallOfShame: React.FC = () => {
  const location = useLocation();
  const { connect } = useSocket();
  const { getGlobalRankings, getFriendsRankings } = useUser();

  const [tab, setTab] = useState("live");
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });
  const [shames, setShames] = useState<Shame[]>([]);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [hasSynced, setHasSynced] = useState(false);
  const [globalRankings, setGlobalRankings] = useState<UserList[]>([]);
  const [friendsRankings, setFriendsRankings] = useState<UserList[]>([]);
  const trophyColors = ["#ffd73c", "#bcbcbc", "#be7b2d"];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [type, setType] = useState("Global");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [socket, setSocket] = useState<Socket | undefined>(undefined);

  const [state, setState] = useReducer(
    (s: WallOfShameState, a: Partial<WallOfShameState>) => ({
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

  const topShamesRef = query(
    ref(database, "shames"),
    orderByKey(),
    limitToLast(50)
  );

  onValue(topShamesRef, (snapshot) => {
    const object = snapshot.val();

    const newTime = Date.now();
    // Debounce the events
    if (differenceInSeconds(lastUpdated, newTime) < 2 && hasSynced) {
      return;
    }
    setLastUpdated(newTime);
    if (object) {
      const parsedValues = Object.values(object) as Shame[];
      if (parsedValues) {
        setShames(parsedValues.reverse());
        setHasSynced(true);
      }
    }
  });

  const fetchData = async (): Promise<void> => {
    try {
      const global = await getGlobalRankings();
      const friends = await getFriendsRankings();
      setGlobalRankings(global);
      setFriendsRankings(friends);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const connectToSocket = async () => {
    const globalSocket = await connect();
    setSocket(globalSocket);
    globalSocket?.emit("globalLeaderboard", {}, (data: UserList[]) => {
      setGlobalRankings(data);
    });
    globalSocket?.on("globalLeaderboard", (data: UserList[]) => {
      setGlobalRankings(data);
    });
  };

  useEffect(() => {
    // fetchData();
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

  const renderLeaderboard = (rankings: UserList[]) => {
    const topThree = rankings
      .sort((x, y) => {
        const xCount = x.failedChallengeCount + (x.vetoedChallengeCount ?? 0);
        const yCount = y.failedChallengeCount + (y.vetoedChallengeCount ?? 0);
        return yCount - xCount;
      })
      .slice(0, 3);
    return (
      <>
        <IonRow className='ion-align-items-end' style={{ marginTop: "1rem" }}>
          {rankings.length > 1 && (
            <IonCol size='4'>
              <IonRow className='ion-justify-content-center'>
                <IonAvatar className='second-place-avatar'>
                  <AvatarImg avatar={topThree[1].avatar} />
                </IonAvatar>
              </IonRow>
              <IonRow className='ion-justify-content-center'>
                <IonIcon
                  icon={trophy}
                  style={{
                    color: trophyColors[1],
                    marginTop: "0.5rem",
                  }}
                ></IonIcon>
              </IonRow>
              <IonRow
                className='ion-justify-content-center'
                style={{ marginTop: "0.25rem" }}
              >
                <IonLabel>
                  <h4 style={{ fontWeight: "bold" }}>{topThree[1].name}</h4>
                </IonLabel>
              </IonRow>
              <IonRow
                className='ion-justify-content-center'
                style={{ marginTop: "0.25rem" }}
              >
                <IonLabel style={{ fontSize: "0.8rem" }}>
                  {topThree[1].failedChallengeCount +
                    (topThree[1].vetoedChallengeCount ?? 0) +
                    " shames"}
                </IonLabel>
              </IonRow>
            </IonCol>
          )}
          {rankings.length > 0 && (
            <IonCol size='4'>
              <IonRow className='ion-justify-content-center'>
                <IonAvatar className='first-place-avatar'>
                  <AvatarImg avatar={topThree[0].avatar} />
                </IonAvatar>
              </IonRow>
              <IonRow className='ion-justify-content-center'>
                <IonIcon
                  icon={trophy}
                  style={{
                    color: trophyColors[0],
                    marginTop: "0.5rem",
                  }}
                ></IonIcon>
              </IonRow>
              <IonRow
                className='ion-justify-content-center'
                style={{ marginTop: "0.25rem" }}
              >
                <IonLabel>
                  <h4 style={{ fontWeight: "bold" }}>{topThree[0].name}</h4>
                </IonLabel>
              </IonRow>
              <IonRow
                className='ion-justify-content-center'
                style={{ marginTop: "0.25rem" }}
              >
                <IonLabel style={{ fontSize: "0.8rem" }}>
                  {topThree[0].failedChallengeCount +
                    (topThree[0].vetoedChallengeCount ?? 0) +
                    " shames"}
                </IonLabel>
              </IonRow>
            </IonCol>
          )}
          {rankings.length > 2 && (
            <IonCol size='4'>
              <IonRow className='ion-justify-content-center'>
                <IonAvatar className='third-place-avatar'>
                  <AvatarImg avatar={topThree[2].avatar} />
                </IonAvatar>
              </IonRow>
              <IonRow className='ion-justify-content-center'>
                <IonIcon
                  icon={trophy}
                  style={{
                    color: trophyColors[2],
                    marginTop: "0.5rem",
                  }}
                ></IonIcon>
              </IonRow>
              <IonRow
                className='ion-justify-content-center'
                style={{ marginTop: "0.25rem" }}
              >
                <IonLabel>
                  <h4 style={{ fontWeight: "bold" }}>{topThree[2].name}</h4>
                </IonLabel>
              </IonRow>
              <IonRow
                className='ion-justify-content-center'
                style={{ marginTop: "0.25rem" }}
              >
                <IonLabel style={{ fontSize: "0.8rem" }}>
                  {topThree[2].failedChallengeCount +
                    (topThree[2].vetoedChallengeCount ?? 0) +
                    " shames"}
                </IonLabel>
              </IonRow>
            </IonCol>
          )}
        </IonRow>
        {rankings.length > 3 && (
          <IonCard>
            <IonList style={{ marginTop: "1rem", marginBottom: "1rem" }}>
              {rankings
                .sort((x, y) => {
                  const xCount =
                    x.failedChallengeCount + (x.vetoedChallengeCount ?? 0);
                  const yCount =
                    y.failedChallengeCount + (y.vetoedChallengeCount ?? 0);
                  return yCount - xCount;
                })
                .slice(3)
                .map((r, index) => {
                  return (
                    <IonItem
                      lines='none'
                      key={r.userId}
                      className='leaderboard-item'
                    >
                      <IonAvatar slot='start'>
                        <AvatarImg avatar={r.avatar} />
                      </IonAvatar>
                      <IonLabel>
                        <h4 style={{ fontWeight: "bold" }}>{r.name}</h4>
                      </IonLabel>
                      <IonLabel slot='end'>
                        {r.failedChallengeCount + (r.vetoedChallengeCount ?? 0)}
                      </IonLabel>
                    </IonItem>
                  );
                })}
            </IonList>
          </IonCard>
        )}
        {rankings.length <= 0 && (
          <Container>{"There's nothing here >_<"}</Container>
        )}
      </>
    );
  };
  const renderWall = () => {
    switch (tab) {
      case "live":
        if (shames.length <= 0) {
          return <Container>{"There's nothing here >_<"}</Container>;
        }
        return (
          <>
            {shames.map((s) => {
              return (
                <IonCard
                  key={s.timestamp}
                  className='ion-no-margin'
                  style={{ margin: "0.75rem" }}
                >
                  <IonItem lines='none' color='light'>
                    <IonAvatar slot='start'>
                      <AvatarImg avatar={s.avatar} />
                    </IonAvatar>
                    {s.type === "cheat" ? (
                      <IonLabel>
                        <h6>{s.name} cheated in the challenge:</h6>
                        <h4 style={{ fontWeight: "bold" }}>{s.title}</h4>
                        <h6>
                          On {format(parseISO(s.time), "dd MMM yyyy, HH:mm:ss")}
                        </h6>
                      </IonLabel>
                    ) : (
                      <IonLabel>
                        <h6>{s.name} failed the challenge:</h6>
                        <h4 style={{ fontWeight: "bold" }}>{s.title}</h4>
                        <h6>
                          On {format(parseISO(s.time), "dd MMM yyyy, HH:mm:ss")}
                        </h6>
                      </IonLabel>
                    )}
                  </IonItem>
                </IonCard>
              );
            })}
          </>
        );
      case "shameful":
        return (
          <>
            <IonRow style={{ borderBottom: "1px #cecece solid" }}>
              <IonCol size='6' className='ion-no-padding'>
                <IonSegment
                  onIonChange={(e) => setType(e.detail.value ?? "Global")}
                  value={type}
                  mode='md'
                  color='dark'
                  style={{
                    marginLeft: "1rem",
                    marginRight: "1rem",
                  }}
                >
                  <IonSegmentButton
                    value='Global'
                    className='ion-text-capitalize'
                  >
                    <IonLabel>Global</IonLabel>
                  </IonSegmentButton>
                  <IonSegmentButton
                    value='Friends'
                    className='ion-text-capitalize'
                  >
                    <IonLabel>Friends</IonLabel>
                  </IonSegmentButton>
                </IonSegment>
              </IonCol>
            </IonRow>
            {type === "Global" && renderLeaderboard(globalRankings)}
            {type === "Friends" && renderLeaderboard(friendsRankings)}
          </>
        );
    }
  };

  return (
    <IonPage>
      <IonPopover
        cssClass='popover'
        event={popoverState.event}
        isOpen={popoverState.showPopover}
        onDidDismiss={() =>
          setShowPopover({ showPopover: false, event: undefined })
        }
      >
        <IonList>
          <IonRadioGroup value={tab}>
            <IonItem
              lines='none'
              style={{ marginTop: isPlatform("ios") ? "0.5rem" : "0rem" }}
              onClick={() => {
                setTab("live");
                setShowPopover({ showPopover: false, event: undefined });
              }}
            >
              <IonLabel>Live Chart</IonLabel>
              <IonRadio value='live' />
            </IonItem>
            <IonItem
              lines='none'
              style={{ marginBottom: isPlatform("ios") ? "0.5rem" : "0rem" }}
              onClick={() => {
                setTab("shameful");
                setShowPopover({ showPopover: false, event: undefined });
              }}
            >
              <IonLabel>Top Chart</IonLabel>
              <IonRadio value='shameful' />
            </IonItem>
          </IonRadioGroup>
        </IonList>
      </IonPopover>
      <IonHeader className='ion-no-border'>
        {isPlatform("ios") ? (
          <IonToolbar
            style={{
              paddingTop: "2.5rem",
            }}
          >
            <IonTitle size='large' style={{ paddingBottom: "2rem" }}>
              Wall of Shame
            </IonTitle>
            <IonButtons
              slot='end'
              style={{ paddingTop: "1rem", height: "4rem" }}
            >
              <IonButton
                fill='clear'
                color='clear'
                mode='ios'
                style={{ marginTop: "1rem" }}
                onClick={(e: any) => {
                  e.persist();
                  setShowPopover({ showPopover: true, event: e });
                }}
              >
                <IonIcon icon={chevronBackOutline} size='small' />
                <IonText
                  style={{
                    marginLeft: "0.25rem",
                    marginRight: "0.25rem",
                  }}
                >
                  {tab === "live" ? "Live Chart" : "Top Chart"}
                </IonText>
                <IonIcon icon={chevronForwardOutline} size='small' />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        ) : (
          <IonToolbar>
            <IonTitle size='large'>Wall of Shame</IonTitle>
            <IonButtons slot='end'>
              <IonButton
                fill='clear'
                color='clear'
                mode='ios'
                onClick={(e: any) => {
                  e.persist();
                  setShowPopover({ showPopover: true, event: e });
                }}
              >
                <IonIcon icon={chevronBackOutline} size='small' />
                <IonText
                  style={{
                    marginLeft: "0.25rem",
                    marginRight: "0.25rem",
                  }}
                >
                  {tab === "live" ? "Live Chart" : "Top Chart"}
                </IonText>
                <IonIcon icon={chevronForwardOutline} size='small' />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        )}
      </IonHeader>
      <IonContent fullscreen>
        {renderWall()}
        <IonFab vertical='bottom' horizontal='end' slot='fixed'>
          <IonFabButton color='senary' onClick={fetchData} mode='ios'>
            <IonIcon icon={refreshOutline} />
          </IonFabButton>
        </IonFab>
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

export default WallOfShame;
