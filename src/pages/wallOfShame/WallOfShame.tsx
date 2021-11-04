import {
  IonAvatar,
  IonButton,
  IonCard,
  IonCol,
  IonContent,
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
  IonText,
  IonTitle,
  IonToolbar,
  isPlatform,
} from "@ionic/react";
import { useEffect, useReducer, useRef, useState } from "react";
import StackGrid, { Grid } from "react-stack-grid";
import uniqid from "uniqid";
import "./WallOfShame.scss";
import { useLocation } from "react-router";
import { funnelOutline, trophy } from "ionicons/icons";
import eggIcon from "../../assets/icons/egg.svg";
import tomatoIcon from "../../assets/icons/tomato.svg";
import poopIcon from "../../assets/icons/poop.svg";
import sooIcon from "../../assets/icons/sooIcon.png";
import benIcon from "../../assets/icons/benIcon.png";
import { hideTabs, showTabs } from "../../utils/TabsUtils";
import { Shame } from "../../interfaces/models/Challenges";
import { parseISO } from "date-fns";
import { UserList } from "../../interfaces/models/Users";
import LoadingSpinner from "../../components/loadingSpinner";
import Alert from "../../components/alert";
import AvatarImg from "../../components/avatar";
import { useSocket } from "../../contexts/SocketContext";
import Container from "../../components/container";
import { useWindowSize } from "../../utils/WindowUtils";
import intervalToDuration from "date-fns/intervalToDuration";
import { formatWallTime } from "../../utils/TimeUtils";
import ShameModal from "./shameModal";
import { ThrowItemPost } from "../../interfaces/models/Shame";
import ShameService from "../../services/ShameService";
import { formatEffectCount } from "../../utils/ShameUtils";
import { useUser } from "../../contexts/UserContext";

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

export type ShameTool = "tomato" | "egg" | "poop";

export interface Overlay {
  id: string;
  type: "tomato" | "egg" | "poop";
  top: number;
  left: number;
}

export interface OverlayMap {
  [key: string]: Overlay[];
}

const WallOfShame: React.FC = () => {
  const location = useLocation();
  const { connect } = useSocket();
  const { getFriends } = useUser();
  const { width, isDesktop } = useWindowSize();

  const [tab, setTab] = useState("live");
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });
  const grid = useRef<Grid | null>(null);
  const [shames, setShames] = useState<Shame[]>([]);
  const [selectedShameId, setSelectedShameId] = useState<string | null>(null);
  const [selectedShame, setSelectedShame] = useState<Shame | null>(null);
  const [showShameModal, setShowShameModal] = useState(false);
  const [turn, setTurn] = useState(0);
  const [overlaysPositions, setOverlaysPositions] = useState<OverlayMap>({});
  const [globalRankings, setGlobalRankings] = useState<UserList[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  const connectToSocket = async () => {
    const globalSocket = await connect();
    globalSocket?.emit("globalLeaderboard", {}, (data: UserList[]) => {
      setGlobalRankings(data);
    });
    globalSocket?.on("globalLeaderboard", (data: UserList[]) => {
      setGlobalRankings(data);
      fetchFriendsData();
    });
    globalSocket?.emit("shameListGet", (data: Shame[]) => {
      setShames(data);
    });
    globalSocket?.on("shameListUpdate", (data: Shame[]) => {
      setShames((prevState) => [...data, ...prevState]);
    });
  };

  const handleShame = (key: string, tool: ShameTool) => {
    if (key !== selectedShameId) {
      setSelectedShameId(key);
      switch (tool) {
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
      switch (tool) {
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

  const clearOverlays = () => {
    setOverlaysPositions({});
  };

  const fetchFriendsData = async () => {
    try {
      const friendsData = await getFriends();
      setFriendsRankings(friendsData);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    connectToSocket();
    fetchFriendsData();
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
        <IonRow
          className='ion-align-items-end ion-justify-content-center'
          style={{ marginTop: "1rem" }}
        >
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
            <IonList>
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
                      <IonLabel slot='end' style={{ marginRight: "0.25rem" }}>
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
              marginTop: !isDesktop ? "1rem" : 0,
            }}
          >
            <StackGrid
              columnWidth={width! <= 576 ? "50%" : "33.3%"}
              monitorImagesLoaded={true}
              appearDelay={0}
              horizontal={false}
              gridRef={(r) => (grid.current = r)}
            >
              {shames.map((s, index) => {
                const duration = intervalToDuration({
                  start: parseISO(s.time),
                  end: Date.now(),
                });
                return (
                  <div key={`${s.id}-${index}`} style={{ padding: "0.5rem" }}>
                    <IonRow className='ion-justify-content-center'>
                      <IonCard
                        className='ion-no-margin ion-text-center wall-of-shame-poster'
                        mode='ios'
                        button
                        onClick={() => {
                          setSelectedShame(s);
                          if (turn === 0) {
                            setTurn(1);
                            setShowShameModal(true);
                          }
                        }}
                        style={{
                          width: "100%",
                        }}
                      >
                        <IonRow className='ion-justify-content-center ion-padding-horizontal ion-padding-top'>
                          <div style={{ width: "5.5rem", height: "5.5rem" }}>
                            <AvatarImg avatar={s.avatar} />
                          </div>
                        </IonRow>
                        <IonRow className='ion-justify-content-center ion-padding'>
                          <IonLabel>
                            <h6>
                              <IonText
                                style={{
                                  fontWeight: "bold",
                                  whiteSpace: "break-spaces",
                                  wordBreak: "break-word",
                                }}
                              >
                                {s.name}{" "}
                              </IonText>
                              {s.type === "cheat"
                                ? "cheated in:"
                                : "failed to:"}
                            </h6>
                            <h4
                              style={{
                                fontWeight: "bold",
                                whiteSpace: "break-spaces",
                                wordBreak: "break-word",
                              }}
                            >
                              {s.title}
                            </h4>
                            <h6>
                              {formatWallTime(duration)}
                              {" ago"}
                            </h6>
                          </IonLabel>
                        </IonRow>
                        <IonRow
                          className='ion-justify-content-center'
                          style={{
                            paddingLeft: "0.5rem",
                            paddingRight: "0.5rem",
                          }}
                        >
                          <IonCol
                            size='4'
                            className='ion-no-padding ion-no-margin'
                            style={{ height: "1.5rem" }}
                          >
                            <img
                              src={tomatoIcon}
                              alt='tomato'
                              style={{ width: "1.33rem", height: "1.33rem" }}
                            />
                          </IonCol>
                          <IonCol
                            size='4'
                            className='ion-no-padding ion-no-margin'
                            style={{ height: "1.5rem" }}
                          >
                            <img
                              src={eggIcon}
                              alt='egg'
                              style={{ width: "1.33rem", height: "1.33rem" }}
                            />
                          </IonCol>
                          <IonCol
                            size='4'
                            className='ion-no-padding ion-no-margin'
                            style={{ height: "1.5rem" }}
                          >
                            <img
                              src={poopIcon}
                              alt='poop'
                              style={{ width: "1.33rem", height: "1.33rem" }}
                            />
                          </IonCol>
                        </IonRow>
                        <IonRow
                          className='ion-justify-content-center'
                          style={{
                            paddingLeft: "0.5rem",
                            paddingRight: "0.5rem",
                            fontSize: "0.75rem",
                            fontWeight: "400",
                          }}
                        >
                          <IonCol
                            size='4'
                            className='ion-no-padding ion-no-margin'
                          >
                            {formatEffectCount(s.effect.tomato ?? 0)}
                          </IonCol>
                          <IonCol
                            size='4'
                            className='ion-no-padding ion-no-margin'
                          >
                            {formatEffectCount(s.effect.egg ?? 0)}
                          </IonCol>
                          <IonCol
                            size='4'
                            className='ion-no-padding ion-no-margin'
                          >
                            {formatEffectCount(s.effect.poop ?? 0)}
                          </IonCol>
                        </IonRow>
                        <IonRow
                          className='ion-justify-content-center'
                          style={{
                            paddingLeft: "0.5rem",
                            paddingRight: "0.5rem",
                          }}
                        >
                          <IonCol
                            size='4'
                            className='ion-no-padding ion-no-margin'
                            style={{ height: "1.5rem" }}
                          >
                            <img
                              src={sooIcon}
                              alt='tomato'
                              style={{ width: "1.33rem", height: "1.33rem" }}
                            />
                          </IonCol>
                          <IonCol
                            size='4'
                            className='ion-no-padding ion-no-margin'
                            style={{ height: "1.5rem" }}
                          >
                            <img
                              src={benIcon}
                              alt='egg'
                              style={{ width: "1.33rem", height: "1.33rem" }}
                            />
                          </IonCol>
                        </IonRow>
                        <IonRow
                          className='ion-justify-content-center ion-no-padding ion-no-margin'
                          style={{
                            paddingLeft: "0.5rem",
                            paddingRight: "0.5rem",
                            marginBottom: "0.5rem",
                            fontSize: "0.75rem",
                            fontWeight: "400",
                          }}
                        >
                          <IonCol
                            size='4'
                            className='ion-no-padding ion-no-margin'
                          >
                            {formatEffectCount(s.effect.tomato ?? 0)}
                          </IonCol>
                          <IonCol
                            size='4'
                            className='ion-no-padding ion-no-margin'
                          >
                            {formatEffectCount(s.effect.egg ?? 0)}
                          </IonCol>
                        </IonRow>
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
            <IonRow
              className='ion-justify-content-start ion-padding-horizontal ion-padding-top'
              style={{ marginTop: "1rem", marginBottom: "1.5rem" }}
            >
              <IonButton
                shape='round'
                mode='ios'
                fill='solid'
                color={type === "Global" ? "main-yellow" : "light"}
                onClick={() => setType("Global")}
              >
                <IonText style={{ fontWeight: "bold" }}>Global</IonText>
              </IonButton>
              <IonButton
                shape='round'
                mode='ios'
                fill='solid'
                color={type === "Friends" ? "main-yellow" : "light"}
                onClick={() => setType("Friends")}
              >
                <IonText style={{ fontWeight: "bold" }}>Friends</IonText>
              </IonButton>
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
        <IonToolbar
          color='main-yellow'
          mode='md'
          className='wall-of-shame-header'
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
        {!isDesktop && <div className='wall-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
        <IonPopover
          cssClass='popover'
          mode='ios'
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

        <ShameModal
          shame={selectedShame}
          handleShame={handleShame}
          overlaysPositions={overlaysPositions}
          clearOverlays={clearOverlays}
          showModal={showShameModal}
          setShowModal={(showModal) => {
            setShowShameModal(false);
            setTimeout(() => {
              setTurn(0);
            }, 500);
          }}
          shameCallback={async (shames: ThrowItemPost[]) => {
            setState({ isLoading: true });
            try {
              await ShameService.sendShame(shames);
              const globalSocket = await connect();
              globalSocket?.emit("shameListGet", (data: Shame[]) => {
                setShames(data);
              });
              setState({ isLoading: false });
            } catch (error) {
              setState({
                isLoading: false,
                showAlert: true,
                hasConfirm: false,
                alertHeader: "Ooooops",
                alertMessage:
                  "Could not sync your thrown stuff to the server at the moment. Please try again later :)",
              });
            }
          }}
        />
        <LoadingSpinner
          loading={state.isLoading}
          message={"Syncing"}
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
