import {
  IonModal,
  IonButton,
  IonHeader,
  IonToolbar,
  IonContent,
  IonRow,
  IonText,
  IonCol,
  IonAvatar,
  IonGrid,
  IonIcon,
  IonSearchbar,
  IonTitle,
  IonButtons,
} from "@ionic/react";
import { UserList } from "../../../interfaces/models/Users";
import { useCallback, useReducer, useState } from "react";
import "./Friends.scss";
import { useUser } from "../../../contexts/UserContext";
import { arrowBack } from "ionicons/icons";
import AvatarImg from "../../../components/avatar";
import lodash from "lodash";
import Alert from "../../../components/alert";
import LoadingSpinner from "../../../components/loadingSpinner";

interface AddFriendsModalProps {
  users: UserList[];
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  completionCallback: (invitedUsers: UserList[]) => void;
}

interface AddFriendsModalState {
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

const AddFriendsModal: React.FC<AddFriendsModalProps> = (props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { users, showModal, setShowModal, completionCallback } = props;
  const { user, searchUser, addFriend } = useUser();

  const [searchText, setSearchText] = useState("");
  const [matchedUsers, setMatchedUsers] = useState<UserList[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<UserList[]>(users);

  const [state, setState] = useReducer(
    (s: AddFriendsModalState, a: Partial<AddFriendsModalState>) => ({
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    lodash.debounce((e) => {
      handleSearch(e);
    }, 250),
    []
  );

  const handleSearch = async (searchText: string) => {
    if (searchText.length <= 0) {
      setMatchedUsers([]);
      return;
    }
    try {
      const response = await searchUser(searchText);
      setMatchedUsers(response);
    } catch (error) {}
  };

  const handleInvite = async (u: UserList) => {
    const index = invitedUsers.indexOf(u);
    if (index !== -1) {
      return;
    }

    const newInvitedUsers = invitedUsers.slice(0);
    newInvitedUsers.push(u);
    setInvitedUsers(newInvitedUsers);

    try {
      await addFriend(u.userId);
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

  return (
    <IonModal
      isOpen={showModal}
      mode='ios'
      onDidDismiss={() => setShowModal(false)}
      backdropDismiss={false}
      cssClass='add-friends-modal'
      swipeToClose={true}
    >
      <IonHeader className='ion-no-border'>
        <IonToolbar className='modal-search' color='main-blue'>
          <IonTitle>Find friends</IonTitle>
          <IonButtons slot='start'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              onClick={() => setShowModal(false)}
            >
              <IonIcon icon={arrowBack} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonSearchbar
          mode='ios'
          key='modal-search'
          value={searchText}
          onIonChange={(e) => {
            setSearchText(e.detail.value ?? "");
            debouncedSearch(e.detail.value ?? "");
          }}
          debounce={0}
          placeholder='Search for a name or username'
          showCancelButton='never'
          className='ion-margin-top users-search'
          showClearButton='always'
        ></IonSearchbar>
        <IonGrid className='ion-margin-top ion-no-padding'>
          <IonText
            className='ion-margin'
            style={{ fontSize: 17, fontWeight: 600 }}
          >
            Search results
          </IonText>
          {matchedUsers.map((u) => {
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
                  size='6'
                >
                  <IonRow style={{ paddingBottom: "0.25rem" }}>
                    <IonText style={{ fontSize: 17, fontWeight: 600 }}>
                      {u.name}
                    </IonText>
                  </IonRow>
                  <IonRow>{`@${u.username}`}</IonRow>
                </IonCol>
                {u.userId === user?.userId ? (
                  <IonCol
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    size='3.5'
                  >
                    <IonButton
                      mode='ios'
                      className='ion-no-padding'
                      color='main-beige'
                      disabled
                      fill='solid'
                      style={{ height: "2rem", width: "100%" }}
                    >
                      You
                    </IonButton>
                  </IonCol>
                ) : (
                  <IonCol
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                    size='3.5'
                  >
                    <IonButton
                      mode='ios'
                      className='ion-no-padding'
                      color={"main-blue"}
                      fill={
                        invitedUsers.indexOf(u) === -1 ? "solid" : "outline"
                      }
                      style={{ height: "2rem", width: "100%" }}
                      onClick={() => handleInvite(u)}
                    >
                      <IonText style={{ fontSize: "0.9rem" }}>
                        {invitedUsers.indexOf(u) !== -1 ? "Requested" : "Add"}
                      </IonText>
                    </IonButton>
                  </IonCol>
                )}
              </IonRow>
            );
          })}
        </IonGrid>
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
    </IonModal>
  );
};

export default AddFriendsModal;
