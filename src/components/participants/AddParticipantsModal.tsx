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
import { close } from "ionicons/icons";
import AvatarImg from "../avatar";
import lodash from "lodash";
import HorizontalScroll from "../horizontalScroll";

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
    const index = invitedUsers.findIndex((u) => u.userId === user.userId);
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
          <IonButtons slot='start'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              color='dark'
              onClick={() => setShowModal(false)}
            >
              <IonIcon icon={close} />
            </IonButton>
          </IonButtons>
          <IonTitle style={{ fontWeight: "bold" }}>
            Invite participants
          </IonTitle>
          <IonButtons slot='end'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              color='dark'
              onClick={() => completionCallback(invitedUsers)}
            >
              <IonText color='accent-beige' style={{ fontWeight: "bold" }}>
                Done
              </IonText>
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
          placeholder='Search a name or username'
          showCancelButton='never'
          className='ion-margin-top users-search'
          showClearButton='always'
        ></IonSearchbar>
        <HorizontalScroll users={invitedUsers} />
        <IonGrid className='ion-margin-top ion-no-padding'>
          <IonText
            className='ion-margin'
            style={{ fontSize: 17, fontWeight: 600 }}
          >
            Search results
          </IonText>
          {matchedUsers.map((u) => {
            return (
              <IonRow
                className='ion-margin'
                key={u.userId}
                style={{ marginBottom: "1.25rem" }}
              >
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
                        invitedUsers.findIndex((i) => i.userId === u.userId) ===
                        -1
                          ? "solid"
                          : "outline"
                      }
                      style={{ height: "2rem", width: "100%" }}
                      onClick={() => handleInvite(u)}
                    >
                      <IonText style={{ fontSize: "0.9rem" }}>
                        {invitedUsers.findIndex(
                          (i) => i.userId === u.userId
                        ) !== -1
                          ? "Added"
                          : "Add"}
                      </IonText>
                    </IonButton>
                  </IonCol>
                )}
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
            <IonButton
              mode='ios'
              color='main-beige'
              shape='round'
              style={{
                display: "flex",
                flex: 1,
                marginLeft: "2rem",
                marginRight: "2rem",
              }}
            >
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
