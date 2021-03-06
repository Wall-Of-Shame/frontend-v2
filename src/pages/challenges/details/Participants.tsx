import React from "react";

import {
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonAvatar,
  IonButton,
  IonItem,
  IonLabel,
  IonList,
} from "@ionic/react";
import { ChallengeData, UserMini } from "../../../interfaces/models/Challenges";
import { useUser } from "../../../contexts/UserContext";
import { isAfter, parseISO } from "date-fns";
import AvatarImg from "../../../components/avatar";

interface ParticipantsProps {
  challenge: ChallengeData;
  viewProofCallback: (userUnderViewing: UserMini) => void;
}

const Participants: React.FC<ParticipantsProps> = (
  props: ParticipantsProps
) => {
  const { user } = useUser();
  const { challenge, viewProofCallback } = props;
  const totalParticipantsCount =
    challenge.participants.accepted.completed.length +
    challenge.participants.accepted.notCompleted.length +
    challenge.participants.accepted.protected.length;

  if (challenge.hasReleasedResult) {
    const cheaters = challenge.participants.accepted.completed.filter(
      (p) => p.hasBeenVetoed
    );
    const nonCheaters = challenge.participants.accepted.completed.filter(
      (p) => !p.hasBeenVetoed
    );
    return (
      <IonGrid>
        <IonRow
          className='ion-align-items-center'
          style={{
            marginBottom: "0.5rem",
            marginLeft: "0.5rem",
            marginRight: "0.5rem",
          }}
        >
          <IonCol>
            <IonText style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
              {`${totalParticipantsCount} Participant${
                totalParticipantsCount !== 1 ? "s" : ""
              }`}
            </IonText>
          </IonCol>
        </IonRow>
        {nonCheaters.length > 0 && (
          <IonRow
            className='ion-align-items-center'
            style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
          >
            <IonCol>
              <IonText>
                {nonCheaters.length}{" "}
                <strong>
                  participant
                  {nonCheaters.length !== 1 ? "s" : ""}
                </strong>
                {nonCheaters.length !== 1 ? " are " : " is "}
                safe from the Wall of Shame
              </IonText>
            </IonCol>
          </IonRow>
        )}
        {nonCheaters.length > 0 && (
          <IonList>
            {nonCheaters.map((u) => {
              return (
                <IonItem key={u.userId} lines='none'>
                  <IonAvatar slot='start'>
                    <AvatarImg avatar={u.avatar} />
                  </IonAvatar>
                  <IonLabel>
                    {u.userId === user?.userId ? "You" : u.name}
                  </IonLabel>

                  {u.evidenceLink !== undefined && u.evidenceLink !== "" && (
                    <IonButton
                      mode='ios'
                      slot='end'
                      shape='round'
                      color='main-blue'
                      onClick={() => {
                        viewProofCallback(u);
                      }}
                    >
                      <IonText style={{ padding: 10 }}>Proof</IonText>
                    </IonButton>
                  )}
                </IonItem>
              );
            })}
          </IonList>
        )}
        {challenge.participants.accepted.protected.length > 0 && (
          <IonRow
            className='ion-align-items-center'
            style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
          >
            <IonCol>
              <IonText>
                {challenge.participants.accepted.protected.length} participant
                {challenge.participants.accepted.protected.length !== 1
                  ? "s have "
                  : " has "}
                used Protec
              </IonText>
            </IonCol>
          </IonRow>
        )}
        {challenge.participants.accepted.protected.length > 0 && (
          <IonList>
            {challenge.participants.accepted.protected.map((u) => {
              return (
                <IonItem key={u.userId} lines='none'>
                  <IonAvatar slot='start'>
                    <AvatarImg avatar={u.avatar} />
                  </IonAvatar>
                  <IonLabel>
                    {u.userId === user?.userId ? "You" : u.name}
                  </IonLabel>
                </IonItem>
              );
            })}
          </IonList>
        )}
        {cheaters.length > 0 && (
          <IonRow
            className='ion-align-items-center'
            style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
          >
            <IonCol>
              <IonText>
                {cheaters.length}{" "}
                <strong>
                  cheater
                  {cheaters.length !== 1 ? "s" : ""}
                </strong>
                {cheaters.length !== 1 ? " have " : " has "}
                been banished to the Wall of Shame :')
              </IonText>
            </IonCol>
          </IonRow>
        )}
        {cheaters.length > 0 && (
          <IonList>
            {cheaters.map((u) => {
              return (
                <IonItem key={u.userId} lines='none'>
                  <IonAvatar slot='start'>
                    <AvatarImg avatar={u.avatar} />
                  </IonAvatar>
                  <IonLabel>
                    {u.userId === user?.userId ? "You" : u.name}
                  </IonLabel>

                  {u.evidenceLink !== undefined && u.evidenceLink !== "" && (
                    <IonButton
                      mode='ios'
                      slot='end'
                      shape='round'
                      color='main-blue'
                      onClick={() => {
                        viewProofCallback(u);
                      }}
                    >
                      <IonText style={{ padding: 10 }}>Proof</IonText>
                    </IonButton>
                  )}
                </IonItem>
              );
            })}
          </IonList>
        )}
        {challenge.participants.accepted.notCompleted.length > 0 && (
          <IonRow
            className='ion-align-items-center'
            style={{
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
            }}
          >
            <IonCol>
              {challenge.hasReleasedResult ? (
                <IonText>
                  {challenge.participants.accepted.notCompleted.length}{" "}
                  <strong>
                    burden
                    {challenge.participants.accepted.notCompleted.length !== 1
                      ? "s"
                      : ""}
                  </strong>
                  {challenge.participants.accepted.notCompleted.length !== 1
                    ? " have "
                    : " has "}
                  been banished to the Wall of Shame :')
                </IonText>
              ) : (
                <IonText>
                  {challenge.participants.accepted.notCompleted.length}{" "}
                  participant
                  {challenge.participants.accepted.notCompleted.length !== 1
                    ? "s have "
                    : " has "}
                  failed to complete the challenge on time :')
                </IonText>
              )}
            </IonCol>
          </IonRow>
        )}
        {challenge.participants.accepted.notCompleted.length > 0 && (
          <IonList>
            {challenge.participants.accepted.notCompleted.map((u) => {
              return (
                <IonItem key={u.userId} lines='none'>
                  <IonAvatar slot='start'>
                    <AvatarImg avatar={u.avatar} />
                  </IonAvatar>
                  <IonLabel>
                    {u.userId === user?.userId ? "You" : u.name}
                  </IonLabel>
                </IonItem>
              );
            })}
          </IonList>
        )}
      </IonGrid>
    );
  }
  if (isAfter(Date.now(), parseISO(challenge.endAt!))) {
    return (
      <IonGrid>
        <IonRow
          className='ion-align-items-center'
          style={{
            marginBottom: "0.5rem",
            marginLeft: "0.5rem",
            marginRight: "0.5rem",
          }}
        >
          <IonCol>
            <IonText style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
              {`${totalParticipantsCount} Participant${
                totalParticipantsCount !== 1 ? "s" : ""
              }`}
            </IonText>
          </IonCol>
        </IonRow>
        {challenge.participants.accepted.completed.length > 0 && (
          <IonRow
            className='ion-align-items-center'
            style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
          >
            <IonCol>
              <IonText>
                {challenge.participants.accepted.completed.length} participant
                {challenge.participants.accepted.completed.length !== 1
                  ? "s are "
                  : " is "}
                safe from the Wall of Shame
              </IonText>
            </IonCol>
          </IonRow>
        )}
        {challenge.participants.accepted.completed.length > 0 && (
          <IonList>
            {challenge.participants.accepted.completed.map((u) => {
              return (
                <IonItem key={u.userId} lines='none'>
                  <IonAvatar slot='start'>
                    <AvatarImg avatar={u.avatar} />
                  </IonAvatar>
                  <IonLabel>
                    {u.userId === user?.userId ? "You" : u.name}
                  </IonLabel>
                  {u.evidenceLink !== undefined && u.evidenceLink !== "" && (
                    <IonButton
                      mode='ios'
                      slot='end'
                      shape='round'
                      color='main-blue'
                      onClick={() => {
                        viewProofCallback(u);
                      }}
                    >
                      <IonText style={{ padding: 10 }}>Proof</IonText>
                    </IonButton>
                  )}
                </IonItem>
              );
            })}
          </IonList>
        )}
        {challenge.participants.accepted.protected.length > 0 && (
          <IonRow
            className='ion-align-items-center'
            style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
          >
            <IonCol>
              <IonText>
                {challenge.participants.accepted.protected.length} participant
                {challenge.participants.accepted.protected.length !== 1
                  ? "s have "
                  : " has "}
                used Protec
              </IonText>
            </IonCol>
          </IonRow>
        )}
        {challenge.participants.accepted.protected.length > 0 && (
          <IonList>
            {challenge.participants.accepted.protected.map((u) => {
              return (
                <IonItem key={u.userId} lines='none'>
                  <IonAvatar slot='start'>
                    <AvatarImg avatar={u.avatar} />
                  </IonAvatar>
                  <IonLabel>
                    {u.userId === user?.userId ? "You" : u.name}
                  </IonLabel>
                </IonItem>
              );
            })}
          </IonList>
        )}
        {challenge.participants.accepted.notCompleted.length > 0 && (
          <IonRow
            className='ion-align-items-center'
            style={{
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
            }}
          >
            <IonCol>
              {challenge.hasReleasedResult ? (
                <IonText>
                  {challenge.participants.accepted.notCompleted.length}{" "}
                  participant
                  {challenge.participants.accepted.notCompleted.length !== 1
                    ? "s have "
                    : " has "}
                  been banished to the Wall of Shame :')
                </IonText>
              ) : (
                <IonText>
                  {challenge.participants.accepted.notCompleted.length}{" "}
                  participant
                  {challenge.participants.accepted.notCompleted.length !== 1
                    ? "s have "
                    : " has "}
                  failed to complete the challenge on time :')
                </IonText>
              )}
            </IonCol>
          </IonRow>
        )}
        {challenge.participants.accepted.notCompleted.length > 0 && (
          <IonList>
            {challenge.participants.accepted.notCompleted.map((u) => {
              return (
                <IonItem key={u.userId} lines='none'>
                  <IonAvatar slot='start'>
                    <AvatarImg avatar={u.avatar} />
                  </IonAvatar>
                  <IonLabel>
                    {u.userId === user?.userId ? "You" : u.name}
                  </IonLabel>
                </IonItem>
              );
            })}
          </IonList>
        )}
      </IonGrid>
    );
  }
  if (isAfter(Date.now(), parseISO(challenge.startAt!))) {
    return (
      <IonGrid>
        <IonRow
          className='ion-align-items-center'
          style={{
            marginBottom: "0.5rem",
            marginLeft: "0.5rem",
            marginRight: "0.5rem",
          }}
        >
          <IonCol>
            <IonText style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
              {`${totalParticipantsCount} Participant${
                totalParticipantsCount !== 1 ? "s" : ""
              }`}
            </IonText>
          </IonCol>
        </IonRow>
        {challenge.participants.accepted.completed.length > 0 && (
          <IonRow
            className='ion-align-items-center'
            style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
          >
            <IonCol>
              <IonText>
                {challenge.participants.accepted.completed.length} participant
                {challenge.participants.accepted.completed.length !== 1
                  ? "s are "
                  : " is "}
                safe from the Wall of Shame
              </IonText>
            </IonCol>
          </IonRow>
        )}
        {challenge.participants.accepted.completed.length > 0 && (
          <IonList>
            {challenge.participants.accepted.completed.map((u) => {
              return (
                <IonItem key={u.userId} lines='none'>
                  <IonAvatar slot='start'>
                    <AvatarImg avatar={u.avatar} />
                  </IonAvatar>
                  <IonLabel>
                    {u.userId === user?.userId ? "You" : u.name}
                  </IonLabel>
                  {u.evidenceLink !== undefined && u.evidenceLink !== "" && (
                    <IonButton
                      mode='ios'
                      slot='end'
                      shape='round'
                      color='main-blue'
                      onClick={() => {
                        viewProofCallback(u);
                      }}
                    >
                      <IonText style={{ padding: 10 }}>Proof</IonText>
                    </IonButton>
                  )}
                </IonItem>
              );
            })}
          </IonList>
        )}
        {challenge.participants.accepted.protected.length > 0 && (
          <IonRow
            className='ion-align-items-center'
            style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
          >
            <IonCol>
              <IonText>
                {challenge.participants.accepted.protected.length} participant
                {challenge.participants.accepted.protected.length !== 1
                  ? "s have "
                  : " has "}
                used Protec
              </IonText>
            </IonCol>
          </IonRow>
        )}
        {challenge.participants.accepted.protected.length > 0 && (
          <IonList>
            {challenge.participants.accepted.protected.map((u) => {
              return (
                <IonItem key={u.userId} lines='none'>
                  <IonAvatar slot='start'>
                    <AvatarImg avatar={u.avatar} />
                  </IonAvatar>
                  <IonLabel>
                    {u.userId === user?.userId ? "You" : u.name}
                  </IonLabel>
                </IonItem>
              );
            })}
          </IonList>
        )}
        {challenge.participants.accepted.notCompleted.length > 0 && (
          <IonRow
            className='ion-align-items-center'
            style={{
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
            }}
          >
            <IonCol>
              <IonText>
                {challenge.participants.accepted.notCompleted.length}{" "}
                participant
                {challenge.participants.accepted.notCompleted.length !== 1
                  ? "s are "
                  : " is "}
                still trying their best
              </IonText>
            </IonCol>
          </IonRow>
        )}
        {challenge.participants.accepted.notCompleted.length > 0 && (
          <IonList>
            {challenge.participants.accepted.notCompleted.map((u) => {
              return (
                <IonItem key={u.userId} lines='none'>
                  <IonAvatar slot='start'>
                    <AvatarImg avatar={u.avatar} />
                  </IonAvatar>
                  <IonLabel>
                    {u.userId === user?.userId ? "You" : u.name}
                  </IonLabel>
                </IonItem>
              );
            })}
          </IonList>
        )}
      </IonGrid>
    );
  }
  return (
    <IonGrid>
      <IonRow
        className='ion-align-items-center'
        style={{
          marginBottom: "0.5rem",
          marginLeft: "0.5rem",
          marginRight: "0.5rem",
        }}
      >
        <IonCol>
          <IonText style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
            {`${totalParticipantsCount} Participant${
              totalParticipantsCount !== 1 ? "s" : ""
            }`}
          </IonText>
        </IonCol>
      </IonRow>
      {challenge.participants.accepted.protected.length > 0 && (
        <IonRow
          className='ion-align-items-center'
          style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
        >
          <IonCol>
            <IonText>
              {challenge.participants.accepted.protected.length} participant
              {challenge.participants.accepted.protected.length !== 1
                ? "s have "
                : " has "}
              used Protec
            </IonText>
          </IonCol>
        </IonRow>
      )}
      {challenge.participants.accepted.protected.length > 0 && (
        <IonList>
          {challenge.participants.accepted.protected.map((u) => {
            return (
              <IonItem key={u.userId} lines='none'>
                <IonAvatar slot='start'>
                  <AvatarImg avatar={u.avatar} />
                </IonAvatar>
                <IonLabel>
                  {u.userId === user?.userId ? "You" : u.name}
                </IonLabel>
              </IonItem>
            );
          })}
        </IonList>
      )}
      {challenge.participants.accepted.notCompleted.length > 0 && (
        <IonRow
          className='ion-align-items-center'
          style={{ marginLeft: "0.5rem", marginRight: "0.5rem" }}
        >
          <IonCol>
            <IonText>
              {challenge.participants.accepted.notCompleted.length} participant
              {challenge.participants.accepted.notCompleted.length !== 1
                ? "s are "
                : " is "}
              ready to start the challenge
            </IonText>
          </IonCol>
        </IonRow>
      )}
      {challenge.participants.accepted.notCompleted.length > 0 && (
        <IonList>
          {challenge.participants.accepted.notCompleted.map((u) => {
            return (
              <IonItem key={u.userId} lines='none'>
                <IonAvatar slot='start'>
                  <AvatarImg avatar={u.avatar} />
                </IonAvatar>
                <IonLabel>
                  {u.userId === user?.userId ? "You" : u.name}
                </IonLabel>
              </IonItem>
            );
          })}
        </IonList>
      )}
      {challenge.participants.pending.length > 0 && (
        <IonRow
          className='ion-align-items-center'
          style={{
            marginLeft: "0.5rem",
            marginRight: "0.5rem",
          }}
        >
          <IonCol>
            <IonText>
              {challenge.participants.pending.length} burden
              {challenge.participants.pending.length !== 1 ? "s are " : " is "}
              still questioning life
            </IonText>
          </IonCol>
        </IonRow>
      )}
      {challenge.participants.pending.length > 0 && (
        <IonList>
          {challenge.participants.pending.map((u) => {
            return (
              <IonItem key={u.userId} lines='none'>
                <IonAvatar slot='start'>
                  <AvatarImg avatar={u.avatar} />
                </IonAvatar>
                <IonLabel>
                  {u.userId === user?.userId ? "You" : u.name}
                </IonLabel>
              </IonItem>
            );
          })}
        </IonList>
      )}
    </IonGrid>
  );
};

export default Participants;
