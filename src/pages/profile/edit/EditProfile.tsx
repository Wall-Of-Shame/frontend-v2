import {
  IonAvatar,
  IonButton,
  IonContent,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./EditProfile.scss";
import { useCallback, useEffect, useReducer } from "react";
import lodash from "lodash";
import { checkmark, dice, arrowBack } from "ionicons/icons";
import {
  Avatar,
  AvatarAnimal,
  AvatarColor,
} from "../../../interfaces/models/Users";
import { useUser } from "../../../contexts/UserContext";
import LoadingSpinner from "../../../components/loadingSpinner";
import Alert from "../../../components/alert";
import { useHistory } from "react-router";
import { hideTabs } from "../../../utils/TabsUtils";
import AvatarImg from "../../../components/avatar";
import { useWindowSize } from "../../../utils/WindowUtils";

export interface EditProfileState {
  displayName: string;
  username: string;
  avatar: Avatar;
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

const EditProfile: React.FC = () => {
  const history = useHistory();
  const { user, updateProfile } = useUser();
  const { isDesktop } = useWindowSize();

  const animals = ["CAT", "DOG", "RABBIT"];
  const colors = ["PRIMARY", "SECONDARY", "TERTIARY"];
  const background = ["#cbe8e0", "#c9b2e1", "#c2d5eb"];

  const [state, setState] = useReducer(
    (s: EditProfileState, a: Partial<EditProfileState>) => ({
      ...s,
      ...a,
    }),
    {
      displayName: user?.name ?? "",
      username: user?.username ?? "",
      avatar: user?.avatar ?? {
        animal: "CAT",
        color: "PRIMARY",
        background: "#cbe8e0",
      },
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
  const debouncedRandomize = useCallback(
    lodash.debounce(() => {
      handleRandomize();
    }, 150),
    []
  );

  const handleRandomize = () => {
    const randomAnimal = animals[
      Math.floor(Math.random() * animals.length)
    ] as AvatarAnimal;
    const randomColor = colors[
      Math.floor(Math.random() * colors.length)
    ] as AvatarColor;
    const randomBackground =
      background[Math.floor(Math.random() * background.length)];
    setState({
      avatar: {
        animal: randomAnimal,
        color: randomColor,
        background: randomBackground,
      },
    });
  };

  const verifyInputs = (): boolean => {
    return state.displayName.length > 0 && state.username.length > 0;
  };

  const handleSubmit = async () => {
    setState({ isLoading: true });
    updateProfile(
      state.displayName,
      state.username,
      user?.settings ?? {
        deadlineReminder: true,
        invitations: true,
      },
      state.avatar
    )
      .then(() => {
        setState({
          isLoading: false,
        });
        window.location.href = "profile";
      })
      .catch((error) => {
        setState({
          isLoading: false,
          showAlert: true,
          alertHeader: "Ooooops",
          alertMessage:
            "Our server is taking a break, come back later please :)",
        });
      });
  };

  useEffect(() => {
    hideTabs();
  }, []);

  return (
    <IonPage style={{ background: "#ffffff" }}>
      <IonHeader className='ion-no-border'>
        <IonToolbar
          color='main-blue'
          mode='md'
          style={{ paddingTop: "0.5rem" }}
        >
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
            <IonIcon icon={arrowBack} />
          </IonFabButton>
          <IonTitle
            size='large'
            color='white'
            style={{
              fontWeight: "800",
            }}
          >
            Edit profile
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
            disabled={!verifyInputs()}
            onClick={handleSubmit}
          >
            <IonIcon icon={checkmark} />
          </IonFabButton>
        </IonToolbar>
        {!isDesktop && <div className='profile-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
        <IonRow
          className='ion-justify-content-center'
          style={{ marginTop: "3.5rem", marginBottom: "0.5rem" }}
        >
          <IonAvatar className='edit-profile-avatar ion-margin-bottom'>
            <AvatarImg avatar={state.avatar} />
          </IonAvatar>
        </IonRow>
        <IonRow className='ion-justify-content-center'>
          <IonButton
            mode='ios'
            shape='round'
            color='medium'
            fill='outline'
            onClick={debouncedRandomize}
          >
            <IonIcon
              color='dark'
              icon={dice}
              style={{ marginRight: "0.5rem" }}
            />
            <IonText color='dark'>Gimme another one</IonText>
          </IonButton>
        </IonRow>
        <IonGrid className='ion-padding-horizontal'>
          <IonList className='ion-padding-vertical'>
            <IonItem lines='full' className='ion-margin-bottom'>
              <IonLabel color='primary' position='floating'>
                Display name
              </IonLabel>
              <IonInput
                name='display_name'
                type='text'
                value={state.displayName}
                required
                onIonChange={(event: CustomEvent) => {
                  setState({ displayName: event.detail.value });
                }}
              />
            </IonItem>
            <IonItem lines='full'>
              <IonLabel color='primary' position='floating'>
                Username
              </IonLabel>
              <IonInput
                name='username'
                type='text'
                value={state.username}
                required
                onIonChange={(event: CustomEvent) => {
                  setState({ username: event.detail.value });
                }}
              />
            </IonItem>
          </IonList>
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
    </IonPage>
  );
};

export default EditProfile;
