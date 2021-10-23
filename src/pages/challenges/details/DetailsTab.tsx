import {
  format,
  intervalToDuration,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import React from "react";
import { Redirect } from "react-router";
import { ChallengeData } from "../../../interfaces/models/Challenges";
import ActiveChallengeImg from "../../../components/activeChallengeImg";
import PendingChallengeImg from "../../../components/pendingChallengeImg";
import { useUser } from "../../../contexts/UserContext";
import { IonCard, IonGrid, IonRow, IonText } from "@ionic/react";
import "./ChallengeDetails.scss";
import highground from "../../../assets/onboarding/highground.png";
import Countdown from "./CountDown";

interface DetailsTabProps {
  challenge: ChallengeData;
  countdown: Duration | null;
}

const DetailsTab: React.FC<DetailsTabProps> = (props: DetailsTabProps) => {
  const { challenge, countdown } = props;
  const { user } = useUser()!;

  const startsIn = Math.round(
    (parseISO(challenge.startAt!).getTime() - new Date().getTime()) / 1000
  );

  const renderImage = () => {
    if (challenge === null) {
      return <Redirect to={"challenges"} />;
    }

    if (isAfter(Date.now(), parseISO(challenge.endAt!))) {
      return (
        <IonRow className='ion-justify-content-center'>
          <img
            className='completed-challenge-img'
            src={highground}
            alt='Challenge Completed!'
          ></img>
        </IonRow>
      );
    } else if (
      isAfter(Date.now(), parseISO(challenge.startAt!)) &&
      isBefore(Date.now(), parseISO(challenge.endAt!))
    ) {
      // render active challenge
      return (
        <div style={{ marginTop: "2rem" }}>
          <ActiveChallengeImg
            notCompleted={challenge.participants.accepted.notCompleted}
          />
        </div>
      );
    } else if (!isAfter(Date.now(), parseISO(challenge.startAt!))) {
      // render waiting challenge
      return (
        <div style={{ marginTop: "2rem" }}>
          <PendingChallengeImg
            waitingToStart={challenge.participants.accepted.notCompleted}
          />
        </div>
      );
    }

    return <></>;
  };

  const renderStatus = () => {
    if (challenge === null) {
      return <Redirect to={"challenges"} />;
    }

    if (isAfter(Date.now(), parseISO(challenge.endAt!))) {
      return (
        <>
          {challenge.participants.accepted.completed.findIndex(
            (p) => p.userId === user?.userId
          ) !== -1 ? (
            <IonCard
              className='ion-align-items-center ion-justify-content-center'
              style={{ margin: "1rem" }}
            >
              <IonRow
                className='ion-justify-content-center'
                style={{ marginTop: "1.5rem" }}
              >
                <IonText
                  color='dark'
                  style={{ fontSize: "1rem", fontWeight: "bold" }}
                >
                  You spent a total of
                </IonText>
              </IonRow>
              <div style={{ margin: "0.5rem" }} />
              <Countdown
                countdown={intervalToDuration({
                  start: parseISO(challenge.startAt!),
                  end: parseISO(
                    challenge.participants.accepted.completed.find(
                      (p) => p.userId === user?.userId
                    )?.completedAt!
                  ),
                })}
              />
              <div style={{ margin: "1rem" }} />
            </IonCard>
          ) : (
            <IonCard
              className='ion-align-items-center ion-justify-content-center'
              style={{
                marginLeft: "1rem",
                marginRight: "1rem",
                marginBottom: "1rem",
                marginTop: "2rem",
              }}
            >
              <IonRow
                className='ion-justify-content-center'
                style={{ marginTop: "1.5rem" }}
              >
                <IonText
                  color='dark'
                  style={{ fontSize: "1rem", fontWeight: "bold" }}
                >
                  Challenge has ended
                </IonText>
              </IonRow>
              <div style={{ margin: "0.5rem" }} />
              <Countdown countdown={countdown} />
              <div style={{ margin: "1rem" }} />
            </IonCard>
          )}
        </>
      );
    } else if (
      isAfter(Date.now(), parseISO(challenge.startAt!)) &&
      isBefore(Date.now(), parseISO(challenge.endAt!))
    ) {
      // render active challenge
      return (
        <>
          {challenge.participants.accepted.completed.findIndex(
            (p) => p.userId === user?.userId
          ) === -1 ? (
            <IonCard
              className='ion-align-items-center ion-justify-content-center'
              style={{
                marginLeft: "1rem",
                marginRight: "1rem",
                marginBottom: "1rem",
                marginTop: "2rem",
              }}
            >
              <IonRow
                className='ion-justify-content-center'
                style={{ marginTop: "1.5rem" }}
              >
                <IonText
                  color='dark'
                  style={{ fontSize: "1rem", fontWeight: "bold" }}
                >
                  Challenge ends in
                </IonText>
              </IonRow>
              <div style={{ margin: "0.5rem" }} />
              <Countdown countdown={countdown} />
              <div style={{ margin: "1rem" }} />
            </IonCard>
          ) : (
            challenge.participants.accepted.completed.findIndex(
              (p) => p.userId === user?.userId
            ) !== -1 && (
              <IonCard
                className='ion-align-items-center ion-justify-content-center'
                style={{ margin: "1rem" }}
              >
                <IonRow
                  className='ion-justify-content-center'
                  style={{ marginTop: "1.5rem" }}
                >
                  <IonText
                    color='dark'
                    style={{ fontSize: "1rem", fontWeight: "bold" }}
                  >
                    You spent a total of
                  </IonText>
                </IonRow>
                <div style={{ margin: "0.5rem" }} />
                <Countdown
                  countdown={intervalToDuration({
                    start: parseISO(challenge.startAt!),
                    end: parseISO(
                      challenge.participants.accepted.completed.find(
                        (p) => p.userId === user?.userId
                      )?.completedAt!
                    ),
                  })}
                />
                <div style={{ margin: "1rem" }} />
              </IonCard>
            )
          )}
        </>
      );
    } else if (!isAfter(Date.now(), parseISO(challenge.startAt!))) {
      // render waiting challenge
      return (
        <IonGrid
          className='ion-no-padding'
          style={{
            paddingLeft: "0.2rem",
            paddingRight: "0.2rem",
            maxWidth: "calc(480px - 0.4rem)",
          }}
        >
          {startsIn > 0 && startsIn < 86400 && (
            <IonCard
              className='ion-align-items-center ion-justify-content-center'
              style={{ margin: "1rem" }}
            >
              <IonRow
                className='ion-justify-content-center'
                style={{ marginTop: "1.5rem" }}
              >
                <IonText
                  color='dark'
                  style={{ fontSize: "1rem", fontWeight: "bold" }}
                >
                  Challenge starts in
                </IonText>
              </IonRow>
              <div style={{ margin: "0.5rem" }} />
              <Countdown
                countdown={intervalToDuration({
                  start: Date.now(),
                  end: parseISO(challenge.startAt!),
                })}
              />
              <div style={{ margin: "1rem" }} />
            </IonCard>
          )}
        </IonGrid>
      );
    }

    return <></>;
  };

  return (
    <div>
      {challenge.participants.accepted.notCompleted.length > 0 && renderImage()}
      {renderStatus()}
      <IonGrid style={{ marginBottom: "0.5rem" }}>
        <IonRow className='ion-padding'>
          <IonText style={{ fontWeight: "bold" }}>
            What do we need to do?
          </IonText>
        </IonRow>
        <IonRow
          className='ion-padding-horizontal ion-padding-bottom'
          style={{ marginBottom: "1rem" }}
        >
          <IonText>{challenge.description}</IonText>
        </IonRow>
        <IonRow className='ion-padding-horizontal ion-padding-bottom'>
          <IonText style={{ fontWeight: "bold" }}>
            This challenge starts at
          </IonText>
        </IonRow>
        <IonRow
          className='ion-padding-horizontal ion-padding-bottom'
          style={{ marginBottom: "1rem" }}
        >
          <IonText>
            {format(parseISO(challenge.startAt!), "EEEE, dd MMM yyyy, HH:mm")}
          </IonText>
        </IonRow>
        <IonRow className='ion-padding-horizontal ion-padding-bottom'>
          <IonText style={{ fontWeight: "bold" }}>
            Complete the challenge by
          </IonText>
        </IonRow>
        <IonRow className='ion-padding-horizontal ion-padding-bottom'>
          <IonText>
            {format(parseISO(challenge.endAt), "EEEE, dd MMM yyyy, HH:mm")}
          </IonText>
        </IonRow>
      </IonGrid>
    </div>
  );
};

export default DetailsTab;
