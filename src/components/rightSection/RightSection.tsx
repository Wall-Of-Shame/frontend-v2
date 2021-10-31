import React, { useEffect, useState } from "react";
import {
  IonMenu,
  IonContent,
  IonItem,
  IonCard,
  IonAvatar,
  IonText,
  IonRow,
  IonButton,
  IonCol,
} from "@ionic/react";
import "./RightSection.scss";
import { useSocket } from "../../contexts/SocketContext";
import { Shame } from "../../interfaces/models/Challenges";
import { intervalToDuration, parseISO } from "date-fns";
import AvatarImg from "../avatar";
import { formatWallTime } from "../../utils/TimeUtils";
import { useHistory } from "react-router";
import PrivacyModal from "../privacyModal";

const RightSection = () => {
  const { connect } = useSocket();
  const history = useHistory();
  const [shames, setShames] = useState<Shame[]>([]);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  const connectToSocket = async () => {
    const globalSocket = await connect();
    globalSocket?.emit("shameListGet", (data: Shame[]) => {
      setShames(data);
    });
    globalSocket?.on("shameListUpdate", (data: Shame[]) => {
      setShames((prevState) => [...data, ...prevState]);
    });
  };

  useEffect(() => {
    connectToSocket();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonMenu
      contentId='right-section-menu'
      className='right-section'
      side='end'
    >
      <IonContent forceOverscroll={false} id='right-section-menu'>
        <IonRow
          className='ion-align-items-center'
          style={{ paddingLeft: "1.5rem" }}
        >
          <IonCol>
            <IonRow className='ion-justify-content-start'>
              <IonText style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
                LIVE UPDATES
              </IonText>
            </IonRow>
          </IonCol>
          <IonCol>
            <IonRow className='ion-justify-content-end'>
              <IonButton
                fill='clear'
                mode='ios'
                onClick={() => {
                  history.push("/wall-of-shame");
                }}
              >
                Show all
              </IonButton>
            </IonRow>
          </IonCol>
        </IonRow>
        {shames.slice(0, 5).map((s, index) => {
          const duration = intervalToDuration({
            start: parseISO(s.time),
            end: Date.now(),
          });
          return (
            <IonCard
              key={`${s.id}-side-${index}`}
              className='shame-notification'
            >
              <IonItem lines='none'>
                <IonAvatar slot='start'>
                  <AvatarImg avatar={s.avatar} />
                </IonAvatar>
                <IonText>
                  <strong>{s.name} </strong>
                  {s.type === "cheat" ? "cheated in: " : "failed to: "}
                  <strong>{s.title} </strong>
                  <br />
                  {formatWallTime(duration)}
                  {" ago"}
                </IonText>
              </IonItem>
            </IonCard>
          );
        })}
        <IonRow
          className='ion-padding-top ion-align-items-center'
          style={{ paddingLeft: "1.5rem" }}
        >
          <IonButton
            mode='ios'
            color='transparent'
            className='ion-no-padding'
            style={{ height: "2rem" }}
            onClick={() => {
              window.open("https://wallofshame-landing.netlify.app", "_blank");
            }}
          >
            <IonText
              color='medium'
              style={{ fontSize: "0.9rem", color: "#5a5a5a" }}
            >
              About
            </IonText>
          </IonButton>
          <IonText style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}>
            &bull;
          </IonText>
          <IonButton
            mode='ios'
            color='transparent'
            className='ion-no-padding'
            style={{ height: "2rem" }}
            onClick={() => setShowPrivacyModal(true)}
          >
            <IonText style={{ fontSize: "0.9rem", color: "#5a5a5a" }}>
              Privacy
            </IonText>
          </IonButton>
        </IonRow>
        <IonRow style={{ paddingLeft: "1.5rem" }}>
          <IonText style={{ fontSize: "0.9rem" }}>
            &copy; 2021 Wall of Shame
          </IonText>
        </IonRow>
        <PrivacyModal
          color='main-blue'
          showModal={showPrivacyModal}
          setShowModal={setShowPrivacyModal}
        />
      </IonContent>
    </IonMenu>
  );
};

export default RightSection;
