import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonToolbar,
} from "@ionic/react";
import { arrowBackOutline, chevronForward } from "ionicons/icons";
import { useEffect, useState } from "react";
import { ChallengeData } from "../../../interfaces/models/Challenges";
import { hideTabs } from "../../../utils/TabsUtils";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/RootReducer";
import { ChallengeDux } from "../../../reducers/ChallengeDux";
import AvatarImg from "../../../components/avatar";

const Invitations: React.FC = () => {
  const history = useHistory();

  const selectChallenges = (state: RootState): ChallengeDux => state.challenges;

  const [pendingResponse, setPendingResponse] = useState<ChallengeData[]>(
    useSelector(selectChallenges).pendingResponse
  );

  useEffect(() => {
    hideTabs();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot='start'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              color='dark'
              onClick={() => {
                history.goBack();
              }}
            >
              <IonIcon icon={arrowBackOutline} size='large' />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {pendingResponse.length > 0 && (
          <>
            <IonRow className='ion-padding-horizontal ion-margin-top'>
              <IonText style={{ color: "gray" }}>Pending Invitations</IonText>
            </IonRow>
            {pendingResponse?.map((c) => {
              const acceptedCount = c.participants.accepted.completed.concat(
                c.participants.accepted.notCompleted
              ).length;
              return (
                <IonCard
                  mode='ios'
                  button
                  key={c.challengeId}
                  onClick={() => {
                    history.push(`challenges/${c.challengeId}/details`, c);
                  }}
                >
                  <IonGrid className='ion-no-padding'>
                    <IonRow className='ion-align-items-center'>
                      <IonCol size='11'>
                        <IonCardHeader style={{ paddingBottom: "0.75rem" }}>
                          <IonCardTitle style={{ fontSize: "1.2rem" }}>
                            {c.title}
                          </IonCardTitle>
                        </IonCardHeader>
                        <IonCardContent>
                          <IonRow>
                            <IonText
                              style={{
                                fontSize: "0.8rem",
                                fontWeight: "bold",
                                marginBottom: "0.25rem",
                              }}
                            >
                              Waiting for your response
                            </IonText>
                          </IonRow>
                          <IonRow style={{ marginTop: "0.5rem" }}>
                            <IonText style={{ fontSize: "0.8rem" }}>
                              {acceptedCount} participant
                              {acceptedCount === 1 ? "" : "s"}
                            </IonText>
                          </IonRow>
                          <IonRow
                            style={{ paddingTop: "0.5rem" }}
                            className='ion-align-items-center'
                          >
                            {c.participants.accepted.completed
                              .concat(c.participants.accepted.notCompleted)
                              .map((p) => {
                                return (
                                  <IonAvatar
                                    className='avatar'
                                    key={p.userId}
                                    style={{ marginRight: "0.25rem" }}
                                  >
                                    <AvatarImg avatar={p.avatar} />
                                  </IonAvatar>
                                );
                              })}
                          </IonRow>
                        </IonCardContent>
                      </IonCol>
                      <IonCol size='1'>
                        <IonIcon
                          icon={chevronForward}
                          style={{ fontSize: "1.5rem" }}
                        />
                      </IonCol>
                    </IonRow>
                  </IonGrid>
                </IonCard>
              );
            })}
          </>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Invitations;
