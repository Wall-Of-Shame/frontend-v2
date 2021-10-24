import {
  IonAvatar,
  IonCol,
  IonContent,
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
import {
  arrowBackOutline,
  checkmarkCircle,
  closeCircle,
  personAddOutline,
} from "ionicons/icons";
import { useEffect, useReducer, useState } from "react";
import { hideTabs } from "../../../utils/TabsUtils";
import { useHistory, useLocation } from "react-router";
import AvatarImg from "../../../components/avatar";
import Container from "../../../components/container";
import "../Profile.scss";
import AddFriendsModal from "./AddFriendsModal";
import { useWindowSize } from "../../../utils/WindowUtils";
import { useUser } from "../../../contexts/UserContext";
import { UserList } from "../../../interfaces/models/Users";
import LoadingSpinner from "../../../components/loadingSpinner";
import Alert from "../../../components/alert";
import { useAuth } from "../../../contexts/AuthContext";

interface FriendsState {
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

interface FriendsPushState {
  friends: UserList[];
  requests: UserList[];
}

const Friends: React.FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { isDesktop } = useWindowSize();
  const { refreshUser } = useAuth();
  const {
    getFriendRequests,
    getFriends,
    acceptRequest,
    rejectRequest,
    notifyShouldRefreshUser,
  } = useUser();

  const [showModal, setShowModal] = useState(false);
  const [requests, setRequests] = useState<UserList[]>(
    (location.state as FriendsPushState).requests ?? []
  );
  const [friends, setFriends] = useState<UserList[]>(
    (location.state as FriendsPushState).friends ?? []
  );

  const [state, setState] = useReducer(
    (s: FriendsState, a: Partial<FriendsState>) => ({
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    hideTabs();
  }, []);

  const handleAccept = async (userId: string) => {
    try {
      await acceptRequest(userId);
      await fetchData();
      await refreshUser();
      notifyShouldRefreshUser(true);
    } catch (error) {}
  };
  const handleReject = async (userId: string) => {
    try {
      await rejectRequest(userId);
      await fetchData();
      await refreshUser();
      notifyShouldRefreshUser(true);
    } catch (error) {}
  };

  return (
    <IonPage style={{ background: "#ffffff" }}>
      <IonHeader className='ion-no-border'>
        <IonToolbar color='main-blue' style={{ paddingTop: "0.5rem" }}>
          <IonFabButton
            className='placeholder-fab'
            color='main-blue'
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
            <IonIcon icon={arrowBackOutline} />
          </IonFabButton>
          <IonTitle
            size='large'
            color='white'
            style={{
              fontWeight: "800",
            }}
          >
            Friends
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
            onClick={() => setShowModal(true)}
          >
            <IonIcon icon={personAddOutline} />
          </IonFabButton>
        </IonToolbar>
        {!isDesktop && <div className='profile-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
        {requests.length > 0 && (
          <IonGrid
            className='ion-margin-top ion-no-padding'
            style={{ marginTop: "2rem" }}
          >
            <IonText
              className='ion-margin'
              style={{ fontSize: 17, fontWeight: 600 }}
            >
              Friend request{requests.length !== 1 ? "s" : ""} -{" "}
              {requests.length}
            </IonText>
            {requests.map((u) => {
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
                    size='6.5'
                  >
                    <IonRow style={{ paddingBottom: "0.25rem" }}>
                      <IonText style={{ fontSize: 17, fontWeight: 600 }}>
                        {u.name}
                      </IonText>
                    </IonRow>
                    <IonRow>{`@${u.username}`}</IonRow>
                  </IonCol>
                  <IonCol
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    size='3'
                  >
                    <IonIcon
                      icon={closeCircle}
                      color='main-beige'
                      style={{ fontSize: "2.5rem" }}
                      onClick={() => {
                        setState({
                          showAlert: true,
                          hasConfirm: true,
                          alertHeader: "Hold on...",
                          alertMessage: `Are you sure you would like to reject ${u.name}'s friend request?`,
                          confirmHandler: () => handleReject(u.userId),
                        });
                      }}
                    />
                    <IonIcon
                      icon={checkmarkCircle}
                      color='main-blue'
                      style={{ fontSize: "2.5rem" }}
                      onClick={() => handleAccept(u.userId)}
                    />
                  </IonCol>
                </IonRow>
              );
            })}
          </IonGrid>
        )}
        {friends.length > 0 && (
          <IonGrid
            className='ion-margin-top ion-no-padding'
            style={{ marginTop: "2rem" }}
          >
            <IonText
              className='ion-margin'
              style={{ fontSize: 17, fontWeight: 600 }}
            >
              Friend{friends.length !== 1 ? "s" : ""} - {friends.length}
            </IonText>
            {friends.map((u) => {
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
                    size='6.5'
                  >
                    <IonRow style={{ paddingBottom: "0.25rem" }}>
                      <IonText style={{ fontSize: 17, fontWeight: 600 }}>
                        {u.name}
                      </IonText>
                    </IonRow>
                    <IonRow>{`@${u.username}`}</IonRow>
                  </IonCol>
                  {/*<IonCol
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    size='3'
                  >
                    <IonIcon
                      icon={ellipsisHorizontal}
                      color='main-blue'
                      style={{ fontSize: "2.5rem" }}
                      onClick={() => handleReject(u.userId)}
                    />
                  </IonCol>*/}
                </IonRow>
              );
            })}
          </IonGrid>
        )}
        {requests.length === 0 && friends.length === 0 && (
          <Container>{"There's nothing here >_<"}</Container>
        )}
        <AddFriendsModal
          users={[]}
          requested={[]}
          showModal={showModal}
          setShowModal={setShowModal}
          completionCallback={() => {}}
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
      </IonContent>
    </IonPage>
  );
};

export default Friends;
