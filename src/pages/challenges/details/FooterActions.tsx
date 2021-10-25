import {
  IonRow,
  IonCol,
  IonText,
  IonButton,
  IonFooter,
  IonToolbar,
} from "@ionic/react";
import { isAfter, parseISO } from "date-fns";
import React from "react";
import { useUser } from "../../../contexts/UserContext";
import { ChallengeData } from "../../../interfaces/models/Challenges";

interface FooterActionsProps {
  challenge: ChallengeData;
  viewVoteCallback: () => void;
  uploadProofCallback: () => void;
  handleAccept: () => Promise<void>;
  handleReject: () => Promise<void>;
  handleComplete: () => Promise<void>;
  alertCallback: (
    hasConfirm: boolean,
    alertHeader: string,
    alertMessage: string,
    confirmHandler: () => Promise<void>
  ) => void;
}

const FooterActions: React.FC<FooterActionsProps> = (
  props: FooterActionsProps
) => {
  const {
    challenge,
    viewVoteCallback,
    uploadProofCallback,
    handleAccept,
    handleReject,
    handleComplete,
    alertCallback,
  } = props;
  const { user } = useUser();

  const allParticipants = challenge.participants.accepted.completed
    .concat(challenge.participants.accepted.notCompleted)
    .concat(challenge.participants.accepted.protected);
  const noCompleted = challenge.participants.accepted.completed.length === 0;
  const oneManChallenge =
    challenge.participants.accepted.completed.length === 1
      ? challenge.participants.accepted.completed[0].userId === user?.userId
      : false;

  if (challenge.hasReleasedResult) {
    if (noCompleted || oneManChallenge) {
      return <></>;
    }
    return (
      <IonFooter translucent={true} key='details'>
        <IonToolbar>
          <IonRow
            className='ion-justify-content-center'
            style={{ margin: "0.5rem" }}
          >
            <IonButton
              mode='ios'
              shape='round'
              color='main-beige'
              expand='block'
              fill='solid'
              onClick={viewVoteCallback}
            >
              <IonText style={{ marginLeft: "2rem", marginRight: "2rem" }}>
                View voting results
              </IonText>
            </IonButton>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    );
  }
  if (isAfter(Date.now(), parseISO(challenge.endAt!))) {
    if (noCompleted || oneManChallenge) {
      return <></>;
    }
    return (
      <IonFooter translucent={true} key='details'>
        <IonToolbar>
          <IonRow
            className='ion-justify-content-center'
            style={{ margin: "0.5rem" }}
          >
            <IonButton
              mode='ios'
              shape='round'
              color='main-blue'
              expand='block'
              fill='solid'
              onClick={viewVoteCallback}
              style={{
                display: "flex",
                flex: 1,
                marginLeft: "2rem",
                marginRight: "2rem",
                maxWidth: 300,
              }}
            >
              <IonText style={{ marginLeft: "2rem", marginRight: "2rem" }}>
                Vote out cheaters
              </IonText>
            </IonButton>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    );
  }
  if (
    challenge.participants.accepted.completed.findIndex(
      (p) => p.userId === user?.userId
    ) !== -1
  ) {
    const viewingUser = challenge.participants.accepted.completed.find(
      (p) => p.userId === user?.userId
    );
    const evidenceLink = viewingUser?.evidenceLink ?? "";
    return (
      <IonFooter translucent={true} key='details'>
        <IonToolbar>
          <IonRow
            className='ion-justify-content-around'
            style={{ margin: "0.5rem" }}
          >
            <IonButton
              mode='ios'
              shape='round'
              color='accent-beige'
              expand='block'
              fill='solid'
              onClick={uploadProofCallback}
            >
              <IonText style={{ marginLeft: "2rem", marginRight: "2rem" }}>
                {evidenceLink !== "" ? "Re-upload proof" : "Upload proof"}
              </IonText>
            </IonButton>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    );
  }

  if (isAfter(Date.now(), parseISO(challenge.startAt!))) {
    return (
      <IonFooter translucent={true} key='details'>
        <IonToolbar>
          <IonRow
            className='ion-justify-content-around'
            style={{ margin: "0.5rem" }}
          >
            <IonButton
              mode='ios'
              shape='round'
              color='main-beige'
              expand='block'
              fill='solid'
              onClick={handleComplete}
            >
              <IonText style={{ marginLeft: "2rem", marginRight: "2rem" }}>
                I've completed the challenge
              </IonText>
            </IonButton>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    );
  }

  if (user?.userId === challenge.owner.userId) {
    return (
      <IonFooter translucent={true} key='details'>
        <IonToolbar>
          <IonRow
            className='ion-justify-content-center'
            style={{ margin: "0.5rem" }}
          >
            <IonButton shape='round' color='main-beige' mode='ios' disabled>
              <IonText style={{ marginLeft: "1.5rem", marginRight: "1.5rem" }}>
                Waiting to start
              </IonText>
            </IonButton>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    );
  }

  if (
    challenge.participants.pending.findIndex(
      (p) => p.userId === user?.userId
    ) !== -1
  ) {
    return (
      <IonFooter translucent={true} key='details'>
        <IonToolbar>
          <IonRow
            className='ion-justify-content-around'
            style={{ margin: "0.5rem" }}
          >
            <IonCol className='ion-no-padding'>
              <IonButton
                mode='ios'
                shape='round'
                color='danger'
                expand='block'
                fill='solid'
                style={{ paddingRight: "0.25rem" }}
                onClick={() => {
                  alertCallback(
                    true,
                    "Are you sure?",
                    "Once rejected, you will no longer be able to access this challenge 😱",
                    handleReject
                  );
                }}
              >
                <IonText>Nope</IonText>
              </IonButton>
            </IonCol>
            <IonCol className='ion-no-padding'>
              <IonButton
                mode='ios'
                shape='round'
                color='main-beige'
                fill='solid'
                expand='block'
                style={{ paddingLeft: "0.25rem" }}
                onClick={() => {
                  alertCallback(
                    true,
                    "Are you sure?",
                    "Once accepted, you will need to complete the challenge or get thrown onto the Wall of Shame 🙈",
                    handleAccept
                  );
                }}
              >
                <IonText>I'm ready!</IonText>
              </IonButton>
            </IonCol>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    );
  }

  if (
    challenge.inviteType === "PUBLIC" &&
    allParticipants.findIndex((p) => p.userId === user?.userId) === -1
  ) {
    return (
      <IonFooter translucent={true} key='details'>
        <IonToolbar>
          <IonRow
            className='ion-justify-content-center'
            style={{ margin: "0.5rem" }}
          >
            <IonButton
              shape='round'
              color='main-beige'
              mode='ios'
              onClick={() => {
                alertCallback(
                  true,
                  "Are you sure?",
                  "Once accepted, you will need to complete the challenge or get thrown onto the Wall of Shame 🙈",
                  handleAccept
                );
              }}
            >
              <IonText style={{ marginLeft: "2rem", marginRight: "2rem" }}>
                Join challenge
              </IonText>
            </IonButton>
          </IonRow>
        </IonToolbar>
      </IonFooter>
    );
  }

  return (
    <IonFooter translucent={true} key='details'>
      <IonToolbar>
        <IonRow
          className='ion-justify-content-center'
          style={{ margin: "0.5rem" }}
        >
          <IonButton shape='round' color='main-beige' disabled mode='ios'>
            <IonText style={{ marginLeft: "2rem", marginRight: "2rem" }}>
              Waiting to start
            </IonText>
          </IonButton>
        </IonRow>
      </IonToolbar>
    </IonFooter>
  );
};

export default FooterActions;
