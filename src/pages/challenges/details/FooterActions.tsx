import { IonRow, IonCol, IonText, IonButton } from "@ionic/react";
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
  handleReleaseResults: () => Promise<void>;
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
    handleReleaseResults,
    alertCallback,
  } = props;
  const { user } = useUser();

  if (challenge.hasReleasedResult) {
    return (
      <IonRow
        className='ion-justify-content-center'
        style={{ margin: "0.5rem" }}
      >
        <IonButton
          mode='ios'
          shape='round'
          color='secondary'
          expand='block'
          fill='solid'
          onClick={viewVoteCallback}
        >
          <IonText style={{ marginLeft: "2rem", marginRight: "2rem" }}>
            View voting results
          </IonText>
        </IonButton>
      </IonRow>
    );
  }
  if (isAfter(Date.now(), parseISO(challenge.endAt!))) {
    return (
      <>
        {user?.userId === challenge.owner.userId ? (
          <IonRow
            className='ion-justify-content-around'
            style={{ margin: "0.5rem" }}
          >
            <IonButton
              mode='ios'
              shape='round'
              color='secondary'
              expand='block'
              fill='solid'
              onClick={viewVoteCallback}
            >
              <IonText style={{ marginLeft: "1.5rem", marginRight: "1.5rem" }}>
                Vote out cheaters
              </IonText>
            </IonButton>
            <IonButton
              mode='ios'
              shape='round'
              color='senary'
              expand='block'
              fill='solid'
              onClick={() => {
                alertCallback(
                  true,
                  "Are you sure?",
                  "This will confirm the challenge and voting results and banish those who failed the challenge or cheated to the Wall of Shame :')",
                  handleReleaseResults
                );
              }}
            >
              <IonText style={{ marginLeft: "1.5rem", marginRight: "1.5rem" }}>
                Release Results
              </IonText>
            </IonButton>
          </IonRow>
        ) : (
          <IonRow
            className='ion-justify-content-center'
            style={{ margin: "0.5rem" }}
          >
            <IonButton
              mode='ios'
              shape='round'
              color='secondary'
              expand='block'
              fill='solid'
              onClick={viewVoteCallback}
            >
              <IonText style={{ marginLeft: "2rem", marginRight: "2rem" }}>
                Vote out cheaters
              </IonText>
            </IonButton>
          </IonRow>
        )}
      </>
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
      <IonRow
        className='ion-justify-content-around'
        style={{ margin: "0.5rem" }}
      >
        <IonButton
          mode='ios'
          shape='round'
          color='secondary'
          expand='block'
          fill='solid'
          onClick={uploadProofCallback}
        >
          <IonText style={{ marginLeft: "2rem", marginRight: "2rem" }}>
            {evidenceLink !== "" ? "Re-upload proof" : "Upload proof"}
          </IonText>
        </IonButton>
      </IonRow>
    );
  }

  if (isAfter(Date.now(), parseISO(challenge.startAt!))) {
    return (
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
    );
  }

  if (user?.userId === challenge.owner.userId) {
    return (
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
    );
  }

  if (
    challenge.participants.pending.findIndex(
      (p) => p.userId === user?.userId
    ) !== -1
  ) {
    return (
      <IonRow
        className='ion-justify-content-around'
        style={{ margin: "0.5rem" }}
      >
        <IonCol>
          <IonButton
            mode='ios'
            shape='round'
            color='danger'
            expand='block'
            fill='solid'
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
        <IonCol>
          <IonButton
            mode='ios'
            shape='round'
            color='secondary'
            fill='solid'
            expand='block'
            style={{ marginBottom: "0.5rem" }}
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
    );
  }

  return (
    <IonRow className='ion-justify-content-center' style={{ margin: "0.5rem" }}>
      <IonButton shape='round' color='main-beige' disabled mode='ios'>
        <IonText style={{ marginLeft: "2rem", marginRight: "2rem" }}>
          Waiting to start
        </IonText>
      </IonButton>
    </IonRow>
  );
};

export default FooterActions;
