import {
  IonButton,
  IonButtons,
  IonCard,
  IonCol,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonLabel,
  IonModal,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrowBack, waterOutline } from "ionicons/icons";
import { motion, AnimatePresence } from "framer-motion";
import "./ShameModal.scss";
import eggIcon from "../../../assets/icons/egg.svg";
import tomatoIcon from "../../../assets/icons/tomato.svg";
import poopIcon from "../../../assets/icons/poop.svg";
import { egg, poop, tomato } from "../../../assets/overlay";
import { Shame } from "../../../interfaces/models/Challenges";
import AvatarImg from "../../../components/avatar";
import { formatWallTime } from "../../../utils/TimeUtils";
import { intervalToDuration, parseISO } from "date-fns";
import { OverlayMap, ShameTool } from "../WallOfShame";
import { useWindowSize } from "../../../utils/WindowUtils";
import Container from "../../../components/container";
import { useState } from "react";
import { ThrowItemPost } from "../../../interfaces/models/Shame";
import { formatEffectCount } from "../../../utils/ShameUtils";

interface ShameModalProps {
  shame: Shame | null;
  handleShame: (key: string, tool: ShameTool) => void;
  overlaysPositions: OverlayMap;
  clearOverlays: () => void;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
  shameCallback: (shames: ThrowItemPost[]) => void;
}

const ShameModal: React.FC<ShameModalProps> = (props: ShameModalProps) => {
  const {
    shame,
    handleShame,
    overlaysPositions,
    clearOverlays,
    showModal,
    setShowModal,
    shameCallback,
  } = props;
  const { width } = useWindowSize();

  const [tomatoCount, setTomatoCount] = useState(0);
  const [eggCount, setEggCount] = useState(0);
  const [poopCount, setPoopCount] = useState(0);

  if (shame === null) {
    return <></>;
  }

  const duration = intervalToDuration({
    start: parseISO(shame.time),
    end: Date.now(),
  });

  const handleDismiss = () => {
    const splitted = shame.id.split(":");
    if (splitted.length < 2) {
      clearOverlays();
      setShowModal(false);
      return;
    }
    let shames: ThrowItemPost[] = [];
    if (tomatoCount > 0) {
      shames.push({
        effect: "TOMATO",
        challengeId: splitted[1],
        targetUserId: splitted[0],
        count: tomatoCount,
      });
    }
    if (eggCount > 0) {
      shames.push({
        effect: "EGG",
        challengeId: splitted[1],
        targetUserId: splitted[0],
        count: eggCount,
      });
    }
    if (poopCount > 0) {
      shames.push({
        effect: "POOP",
        challengeId: splitted[1],
        targetUserId: splitted[0],
        count: poopCount,
      });
    }
    if (shames.length > 0) {
      shameCallback(shames);
    }
    setTomatoCount(0);
    setEggCount(0);
    setPoopCount(0);
    clearOverlays();
    setShowModal(false);
  };

  return (
    <IonModal
      cssClass={
        shame.name.length < 8 && shame.title.length < 15
          ? "shame-modal-shortest"
          : shame.name.length >= 8 && shame.title.length < 15
          ? "shame-modal-short"
          : "shame-modal"
      }
      mode='ios'
      isOpen={showModal}
      onDidDismiss={handleDismiss}
      backdropDismiss={true}
    >
      <IonHeader className='ion-no-border'>
        <IonToolbar color='main-yellow' mode='md' className='wall-header'>
          <IonButtons slot='start'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              onClick={handleDismiss}
            >
              <IonIcon
                icon={arrowBack}
                color='white'
                style={{ fontSize: "1.5rem" }}
              />
            </IonButton>
          </IonButtons>
          <IonTitle size='large' color='white'>
            Shame
          </IonTitle>
          <IonButton
            className='placeholder-fab ion-align-items-center'
            color='main-yellow'
            mode='ios'
            shape='round'
            slot='end'
            disabled
            style={{
              margin: "0.5rem",
              height: "2.75rem",
            }}
          ></IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen scrollY={false}>
        <Container>
          <IonRow
            className='ion-justify-content-center'
            style={{ marginTop: "1.5rem" }}
          >
            <IonCard
              className='ion-no-margin ion-text-center wall-of-shame-poster'
              mode='ios'
              style={{ width: width! < 576 ? width! / 2 - 26.5 : "172.7px" }}
            >
              <IonRow className='ion-justify-content-center ion-padding-horizontal ion-padding-top'>
                <div style={{ width: "6rem", height: "6rem" }}>
                  <AvatarImg avatar={shame.avatar} />
                </div>
              </IonRow>
              <IonRow className='ion-justify-content-center ion-padding'>
                <IonLabel>
                  <h6>
                    <IonText
                      style={{
                        fontWeight: "bold",
                        whiteSpace: "break-spaces",
                        wordBreak: "break-word",
                      }}
                    >
                      {shame.name}{" "}
                    </IonText>
                    {shame.type === "cheat" ? "cheated in:" : "failed to:"}
                  </h6>
                  <h4
                    style={{
                      fontWeight: "bold",
                      whiteSpace: "break-spaces",
                      wordBreak: "break-word",
                    }}
                  >
                    {shame.title}
                  </h4>
                  <h6>
                    {formatWallTime(duration)}
                    {" ago"}
                  </h6>
                </IonLabel>
              </IonRow>
              <IonRow
                className='ion-justify-content-center'
                style={{ paddingBottom: "0.5rem" }}
              >
                {`🍅${formatEffectCount(
                  (shame.effect.tomato ?? 0) + tomatoCount
                )}`}
                &nbsp;
                {` 🍳${formatEffectCount((shame.effect.egg ?? 0) + eggCount)}`}
                &nbsp;
                {` 💩${formatEffectCount(
                  (shame.effect.poop ?? 0) + poopCount
                )}`}
              </IonRow>
              <AnimatePresence>
                {!!overlaysPositions[shame.id] &&
                  overlaysPositions[shame.id].length > 0 &&
                  overlaysPositions[shame.id].map((overlay) => {
                    return (
                      <motion.img
                        key={`${shame.id}-${overlay.type}-${overlay.id}`}
                        initial={{
                          opacity: 0,
                          y: 100,
                        }}
                        animate={{
                          opacity:
                            overlay.type === "tomato"
                              ? 0.7
                              : overlay.type === "egg"
                              ? 0.9
                              : 0.7,
                          scale: 1,
                          y: 0,
                        }}
                        exit={{
                          opacity: 0,
                          y: 100,
                          transition: {
                            duration: 2,
                          },
                        }}
                        src={
                          overlay.type === "tomato"
                            ? tomato
                            : overlay.type === "egg"
                            ? egg
                            : poop
                        }
                        style={{
                          position: "absolute",
                          top: `calc(${overlay.top}% - 2.5rem)`,
                          left: `calc(${overlay.left}% - 2.5rem)`,
                          width: "5rem",
                          height: "5rem",
                        }}
                        alt=''
                      />
                    );
                  })}
              </AnimatePresence>
            </IonCard>
          </IonRow>
          <IonRow
            className='ion-justify-content-center'
            style={{ paddingTop: "2.5rem" }}
          >
            <IonRow>
              <IonText>Tap a tool below to shame</IonText>
            </IonRow>
          </IonRow>
          <IonRow
            className='ion-justify-content-center'
            style={{ paddingTop: "1.5rem" }}
          >
            <IonRow
              style={{
                maxWidth: "15rem",
                marginTop: "0.5rem",
              }}
            >
              <IonCol>
                <IonRow className='throwing-icon'>
                  <IonIcon
                    src={tomatoIcon}
                    style={{ fontSize: "3rem", marginRight: "0.5rem" }}
                    onClick={() => {
                      handleShame(shame.id, "tomato");
                      setTomatoCount(tomatoCount + 1);
                    }}
                  />
                </IonRow>
              </IonCol>
              <IonCol>
                <IonRow className='throwing-icon'>
                  <IonIcon
                    src={eggIcon}
                    style={{ fontSize: "3rem" }}
                    onClick={() => {
                      handleShame(shame.id, "egg");
                      setEggCount(eggCount + 1);
                    }}
                  />
                </IonRow>
              </IonCol>
              <IonCol>
                <IonRow className='throwing-icon'>
                  <IonIcon
                    src={poopIcon}
                    style={{ fontSize: "3rem", marginLeft: "0.5rem" }}
                    onClick={() => {
                      handleShame(shame.id, "poop");
                      setPoopCount(poopCount + 1);
                    }}
                  />
                </IonRow>
              </IonCol>
            </IonRow>
          </IonRow>
        </Container>
        <IonFab vertical='bottom' horizontal='end' slot='fixed'>
          <IonFabButton
            color='main-yellow'
            onClick={() => {
              clearOverlays();
            }}
            mode='ios'
          >
            <IonIcon icon={waterOutline} />
          </IonFabButton>
        </IonFab>
      </IonContent>
    </IonModal>
  );
};

export default ShameModal;
