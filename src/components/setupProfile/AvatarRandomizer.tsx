import {
  IonAvatar,
  IonButton,
  IonContent,
  IonFab,
  IonIcon,
  IonRow,
  IonText,
} from "@ionic/react";
import "./ProfileSetUpModal.scss";
import "./AvatarRandomizer.scss";
import Container from "../container";
import "../../theme/transitions.scss";
import { ProfileSetUpModalState } from "./ProfileSetUpModal";
import { arrowBackOutline, dice } from "ionicons/icons";
import { AvatarAnimal, AvatarColor } from "../../interfaces/models/Users";
import AvatarImg from "../avatar";
import lodash from "lodash";
import { useCallback } from "react";

interface AvatarRandomizerProps {
  state: ProfileSetUpModalState;
  setState: React.Dispatch<Partial<ProfileSetUpModalState>>;
  completionCallback: () => void;
  prevPage: () => void;
}

const AvatarRandomizer: React.FC<AvatarRandomizerProps> = (
  props: AvatarRandomizerProps
) => {
  const { state, setState, completionCallback, prevPage } = props;
  const animals = ["CAT", "DOG", "RABBIT"];
  const colors = ["PRIMARY", "SECONDARY", "TERTIARY"];
  const background = ["#cbe8e0", "#c9b2e1", "#c2d5eb"];

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

  return (
    <IonContent fullscreen>
      <IonFab
        horizontal='start'
        vertical='top'
        style={{ marginTop: "1rem", marginLeft: "0.5rem" }}
      >
        <IonIcon icon={arrowBackOutline} size='large' onClick={prevPage} />
      </IonFab>
      <Container>
        <IonRow slot='start'>
          <IonText
            style={{
              fontSize: "32px",
              fontWeight: "bold",
              marginLeft: "1rem",
            }}
          >
            Roll for an avatar!
          </IonText>
        </IonRow>
        <IonRow slot='start' style={{ textAlign: "left", margin: "1rem" }}>
          <IonText>
            This lil guy will be representing you in your journey of
            self-discovery
          </IonText>
        </IonRow>
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
              icon={dice}
              color='dark'
              style={{ marginRight: "0.5rem" }}
            />
            <IonText color='dark'>Gimme another one</IonText>
          </IonButton>
        </IonRow>
        <IonRow className='ion-justify-content-center'>
          <IonButton
            mode='ios'
            fill='solid'
            shape='round'
            color='main-blue'
            className='ion-padding-horizontal'
            style={{
              display: "flex",
              margin: "1rem",
              marginTop: "3rem",
            }}
            onClick={completionCallback}
          >
            <IonText
              color='white'
              style={{ marginLeft: "2rem", marginRight: "2rem" }}
            >
              Done
            </IonText>
          </IonButton>
        </IonRow>
      </Container>
    </IonContent>
  );
};

export default AvatarRandomizer;
