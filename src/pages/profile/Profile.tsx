import React, { useReducer, useState } from "react";
import {
  IonAvatar,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonText,
  IonToolbar,
  IonPopover,
  isPlatform,
  IonCardHeader,
  IonCardTitle,
  IonFabButton,
  IonBadge,
  IonButton,
  IonTitle,
} from "@ionic/react";
import { useEffect } from "react";
import {
  ellipsisVertical,
  createOutline,
  settingsOutline,
  logOutOutline,
  hammerOutline,
  bugOutline,
} from "ionicons/icons";
import { Avatar, UserList } from "../../interfaces/models/Users";
import { useHistory, useLocation } from "react-router";
import { PieChart } from "react-minimal-pie-chart";
import { useAuth } from "../../contexts/AuthContext";
import { hideTabs, showTabs } from "../../utils/TabsUtils";
import "./Profile.scss";
import { useUser } from "../../contexts/UserContext";
import AvatarImg from "../../components/avatar";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/RootReducer";
import { ChallengeDux } from "../../reducers/ChallengeDux";
import { ChallengeData } from "../../interfaces/models/Challenges";
import { format, parseISO } from "date-fns";
import FeedbackModal from "../../components/feedback";
import Alert from "../../components/alert";
import { useWindowSize } from "../../utils/WindowUtils";

export interface ProfileState {
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

const Profile: React.FC = () => {
  const { logout } = useAuth();
  const {
    user,
    getFriendRequests,
    getFriends,
    shouldRefreshUser,
    notifyShouldRefreshUser,
  } = useUser();
  const { isDesktop } = useWindowSize();
  const location = useLocation();
  const history = useHistory();
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });
  const selectChallenges = (state: RootState): ChallengeDux => state.challenges;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [completed, setCompleted] = useState<ChallengeData[]>(
    useSelector(selectChallenges).history
  );
  const [requests, setRequests] = useState<UserList[]>([]);
  const [friends, setFriends] = useState<UserList[]>([]);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [state, setState] = useReducer(
    (s: ProfileState, a: Partial<ProfileState>) => ({
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
      const requestsData = await getFriendRequests();
      const friendsData = await getFriends();
      setRequests(requestsData);
      setFriends(friendsData);
    } catch (error) {}
  };

  useEffect(() => {
    // Fetch requests
    fetchData();
    notifyShouldRefreshUser(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRefreshUser]);

  useEffect(() => {
    // Fetch requests
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderChallengeHistory = () => {
    if (completed && completed.length > 0) {
      return (
        <>
          {completed.slice(0, 5).map((c) => {
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
                        <IonRow>
                          <IonCardTitle style={{ fontSize: "1.2rem" }}>
                            {c.title}
                          </IonCardTitle>
                        </IonRow>
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
                            {`Ended on ${format(
                              parseISO(c.endAt),
                              "dd MMM yyyy, HH:mm"
                            )}`}
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
          {completed.length > 5 && (
            <IonRow
              className='ion-justify-content-center'
              style={{ marginBottom: "1.5rem" }}
            >
              <IonButton
                mode='ios'
                color='main-blue'
                shape='round'
                onClick={() => history.push("/challenge-history")}
              >
                Show all
              </IonButton>
            </IonRow>
          )}
        </>
      );
    } else {
      return (
        <IonRow
          className='ion-padding ion-justify-content-center'
          style={{ marginBottom: "0.5rem" }}
        >
          <IonText color='medium'>{"There's nothing here >_<"}</IonText>
        </IonRow>
      );
    }
  };

  return (
    <IonPage style={{ background: "#ffffff" }}>
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
          <IonItem
            button
            detail={false}
            lines='none'
            style={{ marginTop: isPlatform("ios") ? "0.5rem" : "0rem" }}
            onClick={() => {
              setShowPopover({ showPopover: false, event: undefined });
              history.push("/profile/edit");
            }}
          >
            <IonIcon
              slot='start'
              icon={createOutline}
              style={{ fontSize: "1.5rem" }}
            />
            <IonLabel>Edit profile</IonLabel>
          </IonItem>
          <IonItem
            button
            detail={false}
            lines='none'
            className='tutorial'
            onClick={() => {
              setShowPopover({ showPopover: false, event: undefined });
              setState({
                showAlert: true,
                alertHeader: "Coming soon :)",
                alertMessage: "Thank you for using Wall of Shame",
              });
            }}
          >
            <IonIcon
              slot='start'
              icon={hammerOutline}
              style={{ fontSize: "1.5rem" }}
            />
            <IonLabel>Tutorial</IonLabel>
          </IonItem>
          <IonItem
            button
            detail={false}
            lines='none'
            className='bug-report'
            onClick={() => {
              setShowPopover({ showPopover: false, event: undefined });
              setShowFeedbackModal(true);
            }}
          >
            <IonIcon
              slot='start'
              icon={bugOutline}
              style={{ fontSize: "1.5rem" }}
            />
            <IonLabel>Feedback</IonLabel>
          </IonItem>
          <IonItem
            button
            detail={false}
            lines='none'
            onClick={() => {
              setShowPopover({ showPopover: false, event: undefined });
              history.push("/profile/settings");
            }}
          >
            <IonIcon
              slot='start'
              icon={settingsOutline}
              style={{ fontSize: "1.5rem" }}
            />
            <IonLabel>Settings</IonLabel>
          </IonItem>
          <IonItem
            button
            detail={false}
            lines='none'
            onClick={() => {
              setShowPopover({ showPopover: false, event: undefined });
              setState({
                showAlert: true,
                hasConfirm: true,
                alertHeader: "Are you sure?",
                alertMessage: "You would need to log in again.",
                confirmHandler: () => {
                  logout();
                },
              });
            }}
            style={{ marginBottom: isPlatform("ios") ? "0.5rem" : "0rem" }}
          >
            <IonIcon
              slot='start'
              icon={logOutOutline}
              style={{ fontSize: "1.5rem" }}
            />
            <IonLabel>Log out</IonLabel>
          </IonItem>
        </IonList>
      </IonPopover>
      <IonHeader className='ion-no-border'>
        <IonToolbar
          color='main-blue'
          mode='md'
          className='store-header'
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
            Profile
          </IonTitle>
          <IonFabButton
            className='placeholder-fab'
            color='main-blue'
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
            <IonIcon icon={ellipsisVertical} />
          </IonFabButton>
        </IonToolbar>
        {!isDesktop && <div className='profile-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
        <IonRow
          className='ion-align-items-center ion-margin'
          style={{ marginTop: "2.5rem" }}
        >
          <IonCol>
            <IonRow className='ion-justify-content-center'>
              <IonAvatar id='profile-avatar'>
                <AvatarImg avatar={user?.avatar ?? null} />
              </IonAvatar>
            </IonRow>
          </IonCol>
        </IonRow>
        <IonRow className='ion-justify-content-center'>
          <IonText
            style={{
              fontSize: "1.5rem",
              fontWeight: 600,
              marginTop: "0.5rem",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
            }}
          >
            {user?.name ?? "Display name not set"}
          </IonText>
        </IonRow>
        <IonRow className='ion-justify-content-center'>
          <IonText
            style={{
              fontSize: "1.2rem",
              fontWeight: 500,
              margin: "0.5rem",
            }}
            color='medium'
          >
            {`@${user?.username ?? "Username not set"}`}
          </IonText>
        </IonRow>

        <IonRow className='ion-justify-content-center'>
          <IonCol sizeXs='12' sizeMd='8' sizeLg='6'>
            <IonCard mode='ios' style={{ marginBottom: "2rem" }}>
              {(user?.completedChallengeCount ?? 0) +
                (user?.failedChallengeCount ?? 0) +
                (user?.vetoedChallengeCount ?? 0) >
                0 && (
                <IonRow className='ion-justify-content-center'>
                  <PieChart
                    style={{
                      width: "12rem",
                      height: "12rem",
                      marginTop: "2rem",
                    }}
                    startAngle={-90}
                    lineWidth={50}
                    data={[
                      {
                        title: "Completed",
                        value: user?.completedChallengeCount ?? 0,
                        color: "#fdab8f",
                      },
                      {
                        title: "Failures",
                        value: user?.failedChallengeCount ?? 0,
                        color: "#7dd7e1",
                      },
                      {
                        title: "Cheats",
                        value: user?.vetoedChallengeCount ?? 0,
                        color: "#ffc635",
                      },
                    ]}
                    label={({ dataEntry }) => {
                      const percentage = Math.round(dataEntry.percentage);
                      if (percentage > 0) {
                        return `${Math.round(dataEntry.percentage)}%`;
                      }
                      return "";
                    }}
                    labelPosition={75}
                    labelStyle={{
                      fontSize: "0.5rem",
                    }}
                  />
                </IonRow>
              )}
              <IonGrid className='ion-no-padding'>
                <IonRow className='ion-align-items-center'>
                  <IonCol size='12'>
                    <IonCardContent>
                      <IonRow className='ion-justify-content-center ion-align-items-center'>
                        <IonText
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 600,
                            marginRight: "0.5rem",
                            color: "#000000",
                          }}
                        >
                          {user?.completedChallengeCount ?? 0}
                        </IonText>
                        <IonText
                          style={{ fontSize: "0.9rem", fontWeight: 400 }}
                        >
                          {`Challenge${
                            user?.completedChallengeCount !== 1 ? "s" : ""
                          } Completed`}
                        </IonText>
                        <IonBadge
                          mode='ios'
                          style={{
                            marginLeft: "0.5rem",
                            width: "1rem",
                            height: "1rem",
                            backgroundColor: "#fdab8f",
                          }}
                        >
                          &nbsp;
                        </IonBadge>
                      </IonRow>
                      <IonRow className='ion-justify-content-center ion-align-items-center'>
                        <IonText
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 600,
                            marginRight: "0.5rem",
                            color: "#000000",
                          }}
                        >
                          {user?.failedChallengeCount ?? 0}
                        </IonText>
                        <IonText
                          style={{ fontSize: "0.9rem", fontWeight: 400 }}
                        >
                          {`Shameful Failure${
                            user?.failedChallengeCount !== 1 ? "s" : ""
                          }`}
                        </IonText>
                        <IonBadge
                          mode='ios'
                          style={{
                            marginLeft: "0.5rem",
                            width: "1rem",
                            height: "1rem",
                            backgroundColor: "#7dd7e1",
                          }}
                        >
                          &nbsp;
                        </IonBadge>
                      </IonRow>
                      <IonRow className='ion-justify-content-center ion-align-items-center'>
                        <IonText
                          style={{
                            fontSize: "1.5rem",
                            fontWeight: 600,
                            marginRight: "0.5rem",
                            color: "#000000",
                          }}
                        >
                          {user?.vetoedChallengeCount ?? 0}
                        </IonText>
                        <IonText
                          style={{ fontSize: "0.9rem", fontWeight: 400 }}
                        >
                          {`Shameless Cheat${
                            user?.vetoedChallengeCount !== 1 ? "s" : ""
                          }`}
                        </IonText>
                        <IonBadge
                          mode='ios'
                          style={{
                            marginLeft: "0.5rem",
                            width: "1rem",
                            height: "1rem",
                            backgroundColor: "#ffc635",
                          }}
                        >
                          &nbsp;
                        </IonBadge>
                      </IonRow>
                    </IonCardContent>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCard>
          </IonCol>
        </IonRow>
        <IonRow
          className='ion-padding-horizontal ion-justify-content-center'
          style={{
            marginBottom: "1rem",
          }}
        >
          <IonText style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
            Friends
          </IonText>
        </IonRow>
        {requests.length > 0 && (
          <IonGrid
            className='ion-margin-top ion-no-padding'
            style={{ marginTop: "1rem" }}
          >
            <IonText
              className='ion-margin'
              style={{ fontSize: 17, fontWeight: 600 }}
            >
              Friend request{requests.length !== 1 ? "s" : ""} -{" "}
              {requests.length}
            </IonText>
            {requests.slice(0, 5).map((u) => {
              return (
                <IonRow className='ion-margin' key={u.userId}>
                  <IonCol className='ion-align-item-center' size='2.5'>
                    <IonRow className='ion-justify-content-cneter'>
                      <IonAvatar
                        className='user-avatar'
                        style={{
                          width: "3rem",
                          height: "3rem",
                        }}
                      >
                        <AvatarImg avatar={u.avatar} />
                      </IonAvatar>
                    </IonRow>
                  </IonCol>
                  <IonCol
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    size='9.5'
                  >
                    <IonRow style={{ paddingBottom: "0.25rem" }}>
                      <IonText style={{ fontSize: 17, fontWeight: 600 }}>
                        {u.name}
                      </IonText>
                    </IonRow>
                    <IonRow>{`@${u.username}`}</IonRow>
                  </IonCol>
                </IonRow>
              );
            })}
          </IonGrid>
        )}
        {friends.length > 0 && (
          <IonGrid
            className='ion-margin-top ion-no-padding'
            style={{ marginTop: "1rem" }}
          >
            <IonText
              className='ion-margin'
              style={{ fontSize: 17, fontWeight: 600 }}
            >
              Friend{friends.length !== 1 ? "s" : ""} - {friends.length}
            </IonText>
            {friends.slice(0, 5).map((u) => {
              return (
                <IonRow className='ion-margin' key={u.userId}>
                  <IonCol className='ion-align-item-center' size='2.5'>
                    <IonRow className='ion-justify-content-cneter'>
                      <IonAvatar
                        className='user-avatar'
                        style={{
                          width: "3rem",
                          height: "3rem",
                        }}
                      >
                        <AvatarImg avatar={u.avatar} />
                      </IonAvatar>
                    </IonRow>
                  </IonCol>
                  <IonCol
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "center",
                    }}
                    size='9.5'
                  >
                    <IonRow style={{ paddingBottom: "0.25rem" }}>
                      <IonText style={{ fontSize: 17, fontWeight: 600 }}>
                        {u.name}
                      </IonText>
                    </IonRow>
                    <IonRow>{`@${u.username}`}</IonRow>
                  </IonCol>
                </IonRow>
              );
            })}
          </IonGrid>
        )}
        <IonRow
          className='ion-justify-content-center'
          style={{ marginBottom: "2rem" }}
        >
          <IonButton
            mode='ios'
            color='main-blue'
            shape='round'
            onClick={() => {
              history.push("/profile/friends");
            }}
          >
            See all friends and requests
          </IonButton>
        </IonRow>
        <IonRow className='ion-padding-horizontal ion-justify-content-center'>
          <IonText style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
            Past challenges
          </IonText>
        </IonRow>
        {renderChallengeHistory()}
        <FeedbackModal
          showModal={showFeedbackModal}
          setShowModal={setShowFeedbackModal}
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

export default Profile;
