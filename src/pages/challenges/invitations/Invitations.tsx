import {
  IonAvatar,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCol,
  IonContent,
  IonFabButton,
  IonGrid,
  IonHeader,
  IonIcon,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { arrowBack, chevronForward } from "ionicons/icons";
import { useEffect } from "react";
import { hideTabs } from "../../../utils/TabsUtils";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/RootReducer";
import { ChallengeDux } from "../../../reducers/ChallengeDux";
import AvatarImg from "../../../components/avatar";
import Container from "../../../components/container";
import "../Challenges.scss";
import { useWindowSize } from "../../../utils/WindowUtils";

const Invitations: React.FC = () => {
  const history = useHistory();
  const { isDesktop } = useWindowSize();

  const selectChallenges = (state: RootState): ChallengeDux => state.challenges;

  const pendingResponse = useSelector(selectChallenges).pendingResponse;

  useEffect(() => {
    hideTabs();
  }, []);

  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar
          color='main-beige'
          style={{ paddingTop: "0.5rem", paddingBottom: "0.25rem" }}
        >
          <IonButtons slot='start'>
            <IonFabButton
              className='placeholder-fab'
              color='main-beige'
              mode='ios'
              slot='start'
              style={{
                margin: "0.5rem",
                width: "2.75rem",
                height: "2.75rem",
              }}
              onClick={() => {
                history.push("/challenges");
              }}
            >
              <IonIcon icon={arrowBack} />
            </IonFabButton>
          </IonButtons>
          <IonTitle
            size='large'
            color='white'
            style={{
              fontWeight: "800",
            }}
          >
            Pending Invitations
          </IonTitle>
        </IonToolbar>
        {!isDesktop && <div className='challenges-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
        {pendingResponse.length > 0 ? (
          <>
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
                    window.localStorage.setItem(
                      "referer",
                      "challenges/invitations"
                    );
                    history.push(`/challenges/${c.challengeId}/details`, c);
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
        ) : (
          <Container>{"There's nothing here >_<"}</Container>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Invitations;
