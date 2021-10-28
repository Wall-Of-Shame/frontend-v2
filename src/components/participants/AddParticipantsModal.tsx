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
  IonInput,
  IonToast,
} from "@ionic/react";
import "./AddParticipantsModal.scss";
import { UserList } from "../../interfaces/models/Users";
import { useCallback, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { checkmark, close } from "ionicons/icons";
import AvatarImg from "../avatar";
import lodash from "lodash";
import { RootState } from "../../reducers/RootReducer";
import { useSelector } from "react-redux";

interface AddParticipantsModalProps {
  users: UserList[];
  challengeId: string;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  completionCallback: (invitedUsers: UserList[]) => void;
}

const AddParticipantsModal: React.FC<AddParticipantsModalProps> = (props) => {
  const { users, challengeId, showModal, setShowModal, completionCallback } =
    props;
  const { user, searchUser } = useUser();

  const selectFriends = (state: RootState): UserList[] =>
    state.misc.friends ?? [];
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [friends, setFriends] = useState<any>(useSelector(selectFriends));
  const [copied, setCopied] = useState(false);
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
      let newInvitedUsers = invitedUsers.slice(0);
      newInvitedUsers = invitedUsers.filter((u) => u.userId !== user.userId);
      setInvitedUsers(newInvitedUsers);
    } else {
      const newInvitedUsers = invitedUsers.slice(0);
      newInvitedUsers.push(user);
      setInvitedUsers(newInvitedUsers);
    }
  };

  const friendsArray = Object.values(friends) as UserList[];

  return (
    <IonModal isOpen={showModal} mode='ios' backdropDismiss={false}>
      <IonHeader className='ion-no-border'>
        <IonToolbar color='main-beige' mode='md' className='store-header'>
          <IonButtons slot='start'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              onClick={() => {
                setShowModal(false);
                setTimeout(() => {
                  setInvitedUsers([]);
                }, 200);
              }}
            >
              <IonIcon
                icon={close}
                color='white'
                style={{ fontSize: "1.5rem" }}
              />
            </IonButton>
          </IonButtons>
          <IonTitle size='large' color='white'>
            Invite participants
          </IonTitle>
          <IonButtons slot='end'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              onClick={() => {
                completionCallback(invitedUsers);
              }}
            >
              <IonIcon
                icon={checkmark}
                color='white'
                style={{ fontSize: "1.5rem" }}
              />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={true}>
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
        {!!friendsArray && searchText === "" ? (
          <IonGrid className='ion-margin-top ion-no-padding'>
            <IonText
              className='ion-margin'
              style={{ fontSize: 17, fontWeight: 600 }}
            >
              Friends
            </IonText>
            {friendsArray.map((u) => {
              return (
                <IonRow
                  className='ion-margin-vertical ion-margin-end'
                  key={u.userId}
                >
                  <IonCol className='ion-align-item-center' size='2.5'>
                    <IonRow className='ion-justify-content-center'>
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
                          invitedUsers.findIndex(
                            (i) => i.userId === u.userId
                          ) === -1
                            ? "outline"
                            : "solid"
                        }
                        style={{ height: "2rem", width: "100%" }}
                        onClick={() => {
                          handleInvite(u);
                        }}
                      >
                        <IonText style={{ fontSize: "0.9rem" }}>
                          {invitedUsers.findIndex(
                            (i) => i.userId === u.userId
                          ) === -1
                            ? "Add"
                            : "Added"}
                        </IonText>
                      </IonButton>
                    </IonCol>
                  )}
                </IonRow>
              );
            })}
          </IonGrid>
        ) : (
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
                  className='ion-margin-vertical ion-margin-end'
                  key={u.userId}
                >
                  <IonCol className='ion-align-item-center' size='2.5'>
                    <IonRow className='ion-justify-content-center'>
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
                          invitedUsers.findIndex(
                            (i) => i.userId === u.userId
                          ) === -1
                            ? "outline"
                            : "solid"
                        }
                        style={{ height: "2rem", width: "100%" }}
                        onClick={() => {
                          handleInvite(u);
                        }}
                      >
                        <IonText style={{ fontSize: "0.9rem" }}>
                          {invitedUsers.findIndex(
                            (i) => i.userId === u.userId
                          ) === -1
                            ? "Add"
                            : "Added"}
                        </IonText>
                      </IonButton>
                    </IonCol>
                  )}
                </IonRow>
              );
            })}
          </IonGrid>
        )}
        <IonToast
          isOpen={copied}
          mode='ios'
          onDidDismiss={() => setCopied(false)}
          message={"Copied to clipboard :)"}
          duration={1500}
        />
      </IonContent>
      {challengeId !== "" && (
        <IonFooter>
          <IonToolbar>
            <IonRow
              className='ion-justify-content-center'
              style={{ marginTop: "0.5rem", marginBottom: "0.5rem" }}
            >
              <div
                style={{
                  display: "flex",
                  flex: 1,
                  marginLeft: "2rem",
                  marginRight: "2rem",
                  maxWidth: 300,
                  borderRadius: "0.5rem",
                  background: "#ffffff",
                  paddingLeft: "0.75rem",
                  paddingRight: "0.75rem",
                  boxShadow: "rgba(149, 149, 149, 0.2) 0px 2px 10px 0px",
                }}
              >
                <IonInput
                  value={`https://wallofshame.io/share/link=${challengeId}`}
                />
              </div>
            </IonRow>

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
                  maxWidth: 300,
                }}
                onClick={() => {
                  navigator.clipboard.writeText(
                    `https://wallofshame.io/share/link=${challengeId}`
                  );
                  setCopied(true);
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
      )}
    </IonModal>
  );
};

export default AddParticipantsModal;
