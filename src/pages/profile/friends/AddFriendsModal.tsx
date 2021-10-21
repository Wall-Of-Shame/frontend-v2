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
import { useCallback, useState } from "react";
import "./Friends.scss";
import { useUser } from "../../../contexts/UserContext";
import { addOutline, arrowBack, removeOutline } from "ionicons/icons";
import AvatarImg from "../../../components/avatar";
import lodash from "lodash";

interface AddFriendsModalProps {
  users: UserList[];
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  completionCallback: (invitedUsers: UserList[]) => void;
}

const AddFriendsModal: React.FC<AddFriendsModalProps> = (props) => {
  const { users, showModal, setShowModal, completionCallback } = props;
  const { user, searchUser } = useUser();
  const [searchText, setSearchText] = useState("");
  const [matchedUsers, setMatchedUsers] = useState<UserList[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<UserList[]>(users);

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

  const handleInvite = (user: UserList) => {
    const index = invitedUsers.indexOf(user);
    if (index !== -1) {
      var newInvitedUsers = invitedUsers.slice(0);
      newInvitedUsers = invitedUsers.filter((u) => u.userId !== user.userId);
      setInvitedUsers(newInvitedUsers);
    } else {
      const newInvitedUsers = invitedUsers.slice(0);
      newInvitedUsers.push(user);
      setInvitedUsers(newInvitedUsers);
    }
  };

  return (
    <IonModal
      isOpen={showModal}
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
        <IonGrid className='ion-margin-top'>
          {invitedUsers.length > 0 && (
            <IonText
              className='ion-margin'
              style={{ fontSize: 17, fontWeight: 600 }}
            >
              Added users
            </IonText>
          )}
          {invitedUsers.map((u) => {
            return (
              <IonRow className='ion-margin' key={u.username}>
                <IonCol className='ion-align-item-center' size='3'>
                  <IonAvatar className='user-avatar'>
                    <AvatarImg avatar={u.avatar} />
                  </IonAvatar>
                </IonCol>
                <IonCol
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                  }}
                  size='6'
                >
                  <IonRow style={{ paddingBottom: "0.5rem" }}>
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
                  <IonButton
                    mode='ios'
                    shape='round'
                    color='tertiary'
                    fill='solid'
                    style={{ height: "2.5rem", width: "4.5rem" }}
                    onClick={() => handleInvite(u)}
                  >
                    <IonIcon icon={removeOutline} />
                  </IonButton>
                </IonCol>
              </IonRow>
            );
          })}
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default AddFriendsModal;
