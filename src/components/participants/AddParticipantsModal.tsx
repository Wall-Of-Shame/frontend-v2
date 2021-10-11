import {
  IonModal,
  IonButton,
  IonHeader,
  IonToolbar,
  IonContent,
  IonFooter,
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
import "./AddParticipantsModal.scss";
import { UserList } from "../../interfaces/models/Users";
import { useCallback, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { addOutline, checkmark, removeOutline } from "ionicons/icons";
import AvatarImg from "../avatar";
import lodash from "lodash";

interface AddParticipantsModalProps {
  users: UserList[];
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  completionCallback: (invitedUsers: UserList[]) => void;
}

const AddParticipantsModal: React.FC<AddParticipantsModalProps> = (props) => {
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
      cssClass='modal-container'
      swipeToClose={true}
    >
      <IonHeader translucent>
        <IonToolbar className='modal-search'>
          <IonTitle>Invite participants</IonTitle>
          <IonButtons slot='end'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              color='dark'
              onClick={() => completionCallback(invitedUsers)}
            >
              <IonIcon icon={checkmark} />
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
        <IonGrid className='ion-margin-top'>
          <IonText
            className='ion-margin'
            style={{ fontSize: 17, fontWeight: 600 }}
          >
            Search results
          </IonText>
          {matchedUsers.map((u) => {
            return (
              <IonRow className='ion-margin' key={u.userId}>
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
                {u.userId === user?.userId ? (
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
                      disabled
                      fill='solid'
                      style={{ height: "2.5rem", width: "4.5rem" }}
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
                    size='3'
                  >
                    <IonButton
                      mode='ios'
                      shape='round'
                      color={
                        invitedUsers.indexOf(u) !== -1
                          ? "quinary"
                          : "quaternary"
                      }
                      fill='solid'
                      style={{ height: "2.5rem", width: "4.5rem" }}
                      onClick={() => handleInvite(u)}
                    >
                      <IonIcon
                        icon={
                          invitedUsers.indexOf(u) !== -1
                            ? removeOutline
                            : addOutline
                        }
                      />
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
      <IonFooter>
        <IonToolbar>
          <IonRow
            className='ion-justify-content-around'
            style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
          >
            <IonButton mode='ios' color='secondary' shape='round'>
              <IonText
                style={{
                  marginLeft: "1rem",
                  marginRight: "1rem",
                  fontSize: 19,
                }}
              >
                Share link
              </IonText>
            </IonButton>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    </IonModal>
  );
};

export default AddParticipantsModal;
