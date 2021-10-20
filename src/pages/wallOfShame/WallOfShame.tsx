/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  IonAvatar,
  IonCard,
  IonCol,
  IonContent,
  IonFabButton,
  IonFooter,
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
import { useEffect, useReducer, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import StackGrid, { Grid } from "react-stack-grid";
import uniqid from "uniqid";
import "./WallOfShame.scss";
import { hideTabs, showTabs } from "../../utils/TabsUtils";
import { useLocation } from "react-router";
import { funnelOutline, trophy } from "ionicons/icons";
import { database } from "../../firebase";
import {
  ref,
  onValue,
  query,
  orderByKey,
  limitToLast,
} from "firebase/database";
import { Shame } from "../../interfaces/models/Challenges";
import { differenceInSeconds, isBefore, parseISO } from "date-fns";
import { UserList } from "../../interfaces/models/Users";
import { useUser } from "../../contexts/UserContext";
import LoadingSpinner from "../../components/loadingSpinner";
import Alert from "../../components/alert";
import AvatarImg from "../../components/avatar";
import { Socket } from "socket.io-client";
import { useSocket } from "../../contexts/SocketContext";
import Container from "../../components/container";
import { useWindowSize } from "../../utils/WindowUtils";
import intervalToDuration from "date-fns/intervalToDuration";
import { formatWallTime } from "../../utils/TimeUtils";
import { egg, poop, tomato } from "../../assets/overlay";
import useInterval from "../../hooks/useInterval";

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

interface Overlay {
  id: string;
  type: "tomato" | "egg" | "poop";
  top: number;
  left: number;
}

interface OverlayMap {
  [key: string]: Overlay[];
}

const WallOfShame: React.FC = () => {
  const location = useLocation();
  const { connect } = useSocket();
  const { width } = useWindowSize();
  const { getGlobalRankings, getFriendsRankings } = useUser();

  const [tab, setTab] = useState("live");
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });
  const grid = useRef<Grid | null>(null);
  const [shames, setShames] = useState<Shame[]>([]);
  const [selectedShame, setSelectedShame] = useState<string | null>(null);
  const [shameTool, setShameTool] = useState<"tomato" | "egg" | "poop" | "">(
    ""
  );
  const [lastShamed, setLastShamed] = useState(new Date().getTime() / 1000);
  const [overlaysPositions, setOverlaysPositions] = useState<OverlayMap>({});
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  const [hasSynced, setHasSynced] = useState(false);
  const [globalRankings, setGlobalRankings] = useState<UserList[]>([]);
  const [friendsRankings, setFriendsRankings] = useState<UserList[]>([]);
  const trophyColors = ["#ffd73c", "#bcbcbc", "#be7b2d"];

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [type, setType] = useState("Global");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

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
    limitToLast(100)
  );

  /*
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
        const reversed = parsedValues.reverse();
        setShames(reversed);
        setHasSynced(true);
      }
    }
  });
  */

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
    globalSocket?.emit("globalLeaderboard", {}, (data: UserList[]) => {
      setGlobalRankings(data);
    });
    globalSocket?.on("globalLeaderboard", (data: UserList[]) => {
      setGlobalRankings(data);
    });
    globalSocket?.emit("shameListGet", (data: Shame[]) => {
      setShames(data);
    });
    globalSocket?.on("shameListUpdate", (data: Shame[]) => {
      setShames([...data, ...shames]);
    });
  };

  const handleShame = (key: string) => {
    setLastShamed(new Date().getTime() / 1000);
    if (key !== selectedShame) {
      setSelectedShame(key);
      switch (shameTool) {
        case "tomato":
          const newTomatoPosition: Overlay = {
            id: uniqid(),
            type: "tomato",
            top: 10 + Math.round(Math.random() * 80),
            left: 10 + Math.round(Math.random() * 80),
          };
          let newTomatoOverlays = overlaysPositions[key] ?? [];
          newTomatoOverlays.push(newTomatoPosition);
          setOverlaysPositions({
            [key]: newTomatoOverlays,
          });
          return;
        case "egg":
          const newEggPosition: Overlay = {
            id: uniqid(),
            type: "egg",
            top: 10 + Math.round(Math.random() * 80),
            left: 10 + Math.round(Math.random() * 80),
          };
          let newEggOverlays = overlaysPositions[key] ?? [];
          newEggOverlays.push(newEggPosition);
          setOverlaysPositions({
            [key]: newEggOverlays,
          });
          return;
        case "poop":
          const newPoopPosition: Overlay = {
            id: uniqid(),
            type: "poop",
            top: 10 + Math.round(Math.random() * 80),
            left: 10 + Math.round(Math.random() * 80),
          };
          let newPoopOverlays = overlaysPositions[key] ?? [];
          newPoopOverlays.push(newPoopPosition);
          setOverlaysPositions({
            [key]: newPoopOverlays,
          });
      }
    } else {
      switch (shameTool) {
        case "tomato":
          const newTomatoPosition: Overlay = {
            id: uniqid(),
            type: "tomato",
            top: Math.round(Math.random() * 100),
            left: Math.round(Math.random() * 100),
          };
          let newTomatoOverlays = overlaysPositions[key] ?? [];
          newTomatoOverlays.push(newTomatoPosition);
          setOverlaysPositions({
            ...overlaysPositions,
            [key]: newTomatoOverlays,
          });
          return;
        case "egg":
          const newEggPosition: Overlay = {
            id: uniqid(),
            type: "egg",
            top: Math.round(Math.random() * 100),
            left: Math.round(Math.random() * 100),
          };
          let newEggOverlays = overlaysPositions[key] ?? [];
          newEggOverlays.push(newEggPosition);
          setOverlaysPositions({
            ...overlaysPositions,
            [key]: newEggOverlays,
          });
          return;
        case "poop":
          const newPoopPosition: Overlay = {
            id: uniqid(),
            type: "poop",
            top: Math.round(Math.random() * 100),
            left: Math.round(Math.random() * 100),
          };
          let newPoopOverlays = overlaysPositions[key] ?? [];
          newPoopOverlays.push(newPoopPosition);
          setOverlaysPositions({
            ...overlaysPositions,
            [key]: newPoopOverlays,
          });
      }
    }
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
    setTimeout(() => {
      if (grid.current) {
        grid.current.updateLayout();
      }
    });
  }, [location.pathname]);

  useInterval(() => {
    if (new Date().getTime() / 1000 - lastShamed > 3) {
      setOverlaysPositions({});
    }
  }, 1000);

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
          <div
            style={{
              padding: "0.5rem",
              marginTop: !isPlatform("desktop") ? "1rem" : 0,
            }}
          >
            <StackGrid
              columnWidth={width! <= 576 ? "50%" : "33.3%"}
              monitorImagesLoaded={true}
              appearDelay={100}
              gridRef={(r) => (grid.current = r)}
            >
              {shames.map((s, index) => {
                const duration = intervalToDuration({
                  start: parseISO(s.time),
                  end: Date.now(),
                });
                return (
                  <div key={s.id} style={{ padding: "0.5rem" }}>
                    <IonRow className='ion-justify-content-center'>
                      <IonCard
                        className='ion-no-margin ion-text-center wall-of-shame-poster'
                        mode='ios'
                        button
                        onClick={() => {
                          handleShame(s.id);
                        }}
                        style={{
                          width: "100%",
                        }}
                      >
                        <IonRow className='ion-justify-content-center ion-padding-horizontal ion-padding-top'>
                          <div style={{ maxWidth: "6rem", maxHeight: "6rem" }}>
                            <AvatarImg avatar={s.avatar} />
                          </div>
                        </IonRow>
                        <IonRow className='ion-justify-content-center ion-padding'>
                          <IonLabel>
                            <h6>
                              <strong>{s.name} </strong>
                              {s.type === "cheat"
                                ? "cheated in:"
                                : "failed to:"}
                            </h6>
                            <h4 style={{ fontWeight: "bold" }}>{s.title}</h4>
                            <h6>
                              {formatWallTime(duration)}
                              {" ago"}
                            </h6>
                          </IonLabel>
                        </IonRow>
                        <IonRow
                          className='ion-justify-content-center'
                          style={{ paddingBottom: "0.5rem" }}
                        >
                          {`🍅 12 🍳 9 💩 5`}
                        </IonRow>
                        <AnimatePresence>
                          {!!overlaysPositions[s.id] &&
                            overlaysPositions[s.id].length > 0 &&
                            overlaysPositions[s.id].map((overlay) => {
                              return (
                                <motion.img
                                  key={`${s.id}-${overlay.type}-${overlay.id}`}
                                  initial={{
                                    opacity: 0,
                                    y: 100,
                                  }}
                                  animate={{
                                    opacity:
                                      overlay.type === "tomato"
                                        ? 0.7
                                        : overlay.type === "egg"
                                        ? 0.9
                                        : 0.7,
                                    scale: 1,
                                    y: 0,
                                  }}
                                  exit={{
                                    opacity: 0,
                                    y: 100,
                                    transition: {
                                      duration: 2,
                                    },
                                  }}
                                  src={
                                    overlay.type === "tomato"
                                      ? tomato
                                      : overlay.type === "egg"
                                      ? egg
                                      : poop
                                  }
                                  style={{
                                    position: "absolute",
                                    top: `calc(${overlay.top}% - 2.5rem)`,
                                    left: `calc(${overlay.left}% - 2.5rem)`,
                                    width: "5rem",
                                    height: "5rem",
                                  }}
                                  alt=''
                                />
                              );
                            })}
                        </AnimatePresence>
                      </IonCard>
                    </IonRow>
                  </div>
                );
              })}
            </StackGrid>
          </div>
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
    <IonPage style={{ background: "#ffffff" }}>
      <IonHeader className='ion-no-border'>
        <IonToolbar color='main-yellow' style={{ paddingTop: "0.5rem" }}>
          <IonTitle
            size='large'
            style={{
              paddingBottom: isPlatform("ios") ? "1rem" : 0,
            }}
          >
            Wall of Shame
          </IonTitle>
          <IonFabButton
            className='placeholder-fab'
            color='main-yellow'
            mode='ios'
            slot='end'
            style={{
              margin: "0.5rem",
              width: "2.75rem",
              height: "2.75rem",
            }}
            onClick={(e: any) => {
              e.persist();
              setShowPopover({ showPopover: true, event: e });
            }}
          >
            <IonIcon icon={funnelOutline} style={{ fontSize: "1.5rem" }} />
          </IonFabButton>
        </IonToolbar>
        {!isPlatform("desktop") && <div className='wall-header-curve' />}
      </IonHeader>
      <IonContent fullscreen>
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
        {renderWall()}
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
      <IonFooter className='transparent' mode='ios'>
        <div className='glass'>
          <IonRow style={{ margin: "0.5rem" }}>
            <IonCol
              style={{
                backgroundColor: shameTool === "tomato" ? "#FFC83C" : undefined,
                borderRadius: "2rem",
              }}
              onClick={() => {
                if (shameTool !== "tomato") {
                  setShameTool("tomato");
                } else {
                  setShameTool("");
                }
              }}
            >
              <IonRow className='ion-justify-content-center'>
                <IonText style={{ fontSize: "2rem" }}>🍅</IonText>
              </IonRow>
            </IonCol>
            <IonCol
              style={{
                backgroundColor: shameTool === "egg" ? "#FFC83C" : undefined,
                borderRadius: "2rem",
              }}
              onClick={() => {
                if (shameTool !== "egg") {
                  setShameTool("egg");
                } else {
                  setShameTool("");
                }
              }}
            >
              <IonRow className='ion-justify-content-center'>
                <IonText style={{ fontSize: "2rem" }}>🍳</IonText>
              </IonRow>
            </IonCol>
            <IonCol
              style={{
                backgroundColor: shameTool === "poop" ? "#FFC83C" : undefined,
                borderRadius: "2rem",
              }}
              onClick={() => {
                if (shameTool !== "poop") {
                  setShameTool("poop");
                } else {
                  setShameTool("");
                }
              }}
            >
              <IonRow className='ion-justify-content-center'>
                <div style={{ fontSize: "2rem" }}>💩</div>
              </IonRow>
            </IonCol>
          </IonRow>
        </div>
      </IonFooter>
    </IonPage>
  );
};

export default WallOfShame;
