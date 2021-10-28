import {
  IonButton,
  IonCard,
  IonCol,
  IonContent,
  IonIcon,
  IonLabel,
  IonModal,
  IonRow,
  IonText,
} from "@ionic/react";
import { close } from "ionicons/icons";
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

interface ShameModalProps {
  shame: Shame | null;
  handleShame: (key: string, tool: ShameTool) => void;
  overlaysPositions: OverlayMap;
  clearOverlays: () => void;
  showModal: boolean;
  setShowModal: (showModal: boolean) => void;
}

const ShameModal: React.FC<ShameModalProps> = (props: ShameModalProps) => {
  const {
    shame,
    handleShame,
    overlaysPositions,
    clearOverlays,
    showModal,
    setShowModal,
  } = props;
  const { width } = useWindowSize();

  if (shame === null) {
    return <></>;
  }

  const duration = intervalToDuration({
    start: parseISO(shame.time),
    end: Date.now(),
  });

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
      onDidDismiss={() => setShowModal(false)}
      backdropDismiss={true}
    >
      <IonContent fullscreen scrollY={false}>
        <IonButton
          color='light'
          shape='round'
          mode='ios'
          className='ion-no-padding'
          onClick={() => {
            clearOverlays();
            setShowModal(false);
          }}
          style={{
            position: "absolute",
            top: "0.25rem",
            left: "0.5rem",
            width: "2.5rem",
            height: "2.5rem",
            zIndex: 20000,
          }}
        >
          <IonIcon icon={close} size='large' color='main-yellow' />
        </IonButton>
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
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "break-spaces",
                        wordBreak: "break-all",
                      }}
                    >
                      {shame.name}{" "}
                    </IonText>
                    {shame.type === "cheat" ? "cheated in:" : "failed to:"}
                  </h6>
                  <h4
                    style={{
                      fontWeight: "bold",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "break-spaces",
                      wordBreak: "break-all",
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
                {`🍅 12 🍳 9 💩 5`}
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
            style={{ paddingTop: "1.75rem" }}
          >
            <IonRow>
              <IonText>Tap a tool below to shame</IonText>
            </IonRow>
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
                    }}
                  />
                </IonRow>
              </IonCol>
            </IonRow>
          </IonRow>
        </Container>
      </IonContent>
    </IonModal>
  );
};

export default ShameModal;
