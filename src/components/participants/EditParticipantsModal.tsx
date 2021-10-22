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
  IonButtons,
  IonTitle,
} from "@ionic/react";
import "./EditParticipantsModal.scss";
import { useCallback, useState } from "react";
import { useUser } from "../../contexts/UserContext";
import { addOutline, checkmark, close, removeOutline } from "ionicons/icons";
import { UserMini } from "../../interfaces/models/Challenges";
import AvatarImg from "../avatar";
import lodash from "lodash";

interface EditParticipantsModalProps {
  accepted: UserMini[];
  pending: UserMini[];
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  completionCallback: (invitedUsers: UserMini[]) => void;
}

const EditParticipantsModal: React.FC<EditParticipantsModalProps> = (props) => {
  const { pending, showModal, setShowModal, completionCallback } = props;
  const { searchUser } = useUser();
  const [searchText, setSearchText] = useState("");
  const [matchedUsers, setMatchedUsers] = useState<UserMini[]>([]);
  const [invitedUsers, setInvitedUsers] = useState<UserMini[]>(pending);

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
      setMatchedUsers(
        response.map((u) => {
          return {
            name: u.name,
            username: u.username,
            avatar: u.avatar,
            hasBeenVetoed: false,
            userId: u.userId,
          };
        })
      );
    } catch (error) {}
  };

  const handleInvite = (user: UserMini) => {
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
      cssClass='edit-participants-modal'
      isOpen={showModal}
      mode='ios'
      onDidDismiss={() => setShowModal(false)}
      backdropDismiss={true}
    >
      <IonHeader className='ion-no-border'>
        <IonToolbar color='main-beige' mode='md' className='store-header'>
          <IonButtons slot='start'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              onClick={() => setShowModal(false)}
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
      <IonContent fullscreen scrollY={false}>
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
                      invitedUsers.indexOf(u) !== -1 ? "quinary" : "quaternary"
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
                maxWidth: 300,
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

export default EditParticipantsModal;
