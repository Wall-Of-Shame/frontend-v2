import React, { useState } from "react";
import {
  IonAvatar,
  IonButton,
  IonButtons,
  IonCard,
  IonCardContent,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonPage,
  IonRow,
  IonText,
  IonToolbar,
  IonPopover,
  isPlatform,
  IonCardHeader,
  IonCardTitle,
} from "@ionic/react";
import { useEffect } from "react";
import {
  ellipsisVertical,
  createOutline,
  settingsOutline,
  logOutOutline,
  chevronForward,
  hammerOutline,
  bugOutline,
} from "ionicons/icons";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { hideTabs, showTabs } from "../../utils/TabsUtils";
import "./Profile.scss";
import { useUser } from "../../contexts/UserContext";
import AvatarImg from "../../components/avatar";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/RootReducer";
import { ChallengeDux } from "../../reducers/ChallengeDux";
import { ChallengeData } from "../../interfaces/models/Challenges";
import { format, parseISO } from "date-fns";
import Scrollbars from "react-custom-scrollbars";

const Profile: React.FC = () => {
  const { logout } = useAuth();
  const { user } = useUser();
  const location = useLocation();
  const history = useHistory();
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });
  const selectChallenges = (state: RootState): ChallengeDux => state.challenges;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [completed, setCompleted] = useState<ChallengeData[]>(
    useSelector(selectChallenges).history
  );

  useEffect(() => {
    if (
      location.pathname === "/challenges" ||
      location.pathname === "/wall-of-shame" ||
      location.pathname === "/profile"
    ) {
      showTabs();
    } else {
      hideTabs();
    }
  }, [location.pathname]);

  const renderChallengeHistory = () => {
    if (completed && completed.length > 0) {
      return (
        <>
          {completed?.map((c) => {
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
                        <IonRow>
                          <IonCardTitle style={{ fontSize: "1.2rem" }}>
                            {c.title}
                          </IonCardTitle>
                        </IonRow>
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
                            {`Ended on ${format(
                              parseISO(c.endAt),
                              "dd MMM yyyy, HH:mm"
                            )}`}
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
      );
    } else {
      return (
        <IonRow className='ion-padding ion-justify-content-center'>
          <IonText color='medium'>No challenges yet</IonText>
        </IonRow>
      );
    }
  };

  return (
    <IonPage>
      <IonPopover
        cssClass='popover'
        event={popoverState.event}
        isOpen={popoverState.showPopover}
        onDidDismiss={() =>
          setShowPopover({ showPopover: false, event: undefined })
        }
      >
        <IonList>
          <IonItem
            button
            detail={false}
            lines='none'
            style={{ marginTop: isPlatform("ios") ? "0.5rem" : "0rem" }}
            onClick={() => {
              setShowPopover({ showPopover: false, event: undefined });
              history.push("/profile/edit");
            }}
          >
            <IonIcon
              slot='start'
              icon={createOutline}
              style={{ fontSize: "1.5rem" }}
            />
            <IonLabel>Edit profile</IonLabel>
          </IonItem>
          <IonItem
            button
            detail={false}
            lines='none'
            className='tutorial'
            style={{ marginTop: isPlatform("ios") ? "0.5rem" : "0rem" }}
            onClick={() => {
              setShowPopover({ showPopover: false, event: undefined });
              history.push("/profile/edit");
            }}
          >
            <IonIcon
              slot='start'
              icon={hammerOutline}
              style={{ fontSize: "1.5rem" }}
            />
            <IonLabel>Tutorial</IonLabel>
          </IonItem>
          <IonItem
            button
            detail={false}
            lines='none'
            className='bug-report'
            style={{ marginTop: isPlatform("ios") ? "0.5rem" : "0rem" }}
            onClick={() => {
              setShowPopover({ showPopover: false, event: undefined });
              history.push("/profile/edit");
            }}
          >
            <IonIcon
              slot='start'
              icon={bugOutline}
              style={{ fontSize: "1.5rem" }}
            />
            <IonLabel>Report a bug</IonLabel>
          </IonItem>
          <IonItem
            button
            detail={false}
            lines='none'
            onClick={() => {
              setShowPopover({ showPopover: false, event: undefined });
              history.push("/profile/settings");
            }}
          >
            <IonIcon
              slot='start'
              icon={settingsOutline}
              style={{ fontSize: "1.5rem" }}
            />
            <IonLabel>Settings</IonLabel>
          </IonItem>
          <IonItem
            button
            detail={false}
            lines='none'
            onClick={() => {
              setShowPopover({ showPopover: false, event: undefined });
              logout();
            }}
            style={{ marginBottom: isPlatform("ios") ? "0.5rem" : "0rem" }}
          >
            <IonIcon
              slot='start'
              icon={logOutOutline}
              style={{ fontSize: "1.5rem" }}
            />
            <IonLabel>Log out</IonLabel>
          </IonItem>
        </IonList>
      </IonPopover>

      <IonHeader
        className={isPlatform("ios") ? "ion-no-border" : ""}
        translucent
      >
        <IonToolbar>
          <IonButtons slot='end'>
            <IonButton
              style={{
                margin: "0.5rem",
              }}
              color='dark'
              onClick={(e: any) => {
                e.persist();
                setShowPopover({ showPopover: true, event: e });
              }}
            >
              <IonIcon icon={ellipsisVertical} style={{ fontSize: "1.5rem" }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <Scrollbars>
          <IonRow
            className='ion-align-items-center ion-margin'
            style={{ marginTop: "2.5rem" }}
          >
            <IonCol>
              <IonRow className='ion-justify-content-center'>
                <IonAvatar id='profile-avatar'>
                  <AvatarImg avatar={user?.avatar ?? null} />
                </IonAvatar>
              </IonRow>
            </IonCol>
          </IonRow>
          <IonRow className='ion-justify-content-center'>
            <IonText
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                marginTop: "0.5rem",
                marginLeft: "0.5rem",
                marginRight: "0.5rem",
              }}
            >
              {user?.name ?? "Display name not set"}
            </IonText>
          </IonRow>
          <IonRow className='ion-justify-content-center'>
            <IonText
              style={{
                fontSize: "1.2rem",
                fontWeight: 500,
                margin: "0.5rem",
              }}
              color='medium'
            >
              {`@${user?.username ?? "Username not set"}`}
            </IonText>
          </IonRow>

          <IonGrid style={{ paddingBottom: "2rem" }}>
            <IonRow className='ion-align-items-center'>
              <IonCol size='4' className='ion-no-padding'>
                <IonCard
                  mode='ios'
                  className='profile-statistic ion-text-center'
                  color='quaternary'
                >
                  <IonCardHeader
                    className='ion-no-padding'
                    style={{
                      paddingTop: "1rem",
                      paddingBottom: "0.5rem",
                      paddingLeft: "0.5rem",
                      paddingRight: "0.5rem",
                    }}
                  >
                    <IonCardTitle>
                      <IonText
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 600,
                        }}
                      >
                        {user?.completedChallengeCount ?? 0}
                      </IonText>
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonRow className='ion-justify-content-center ion-align-items-center'>
                      <IonText style={{ fontSize: "0.9rem", fontWeight: 400 }}>
                        Challenge
                        <br />
                        {user?.completedChallengeCount !== 1 && "s"} Completed
                      </IonText>
                    </IonRow>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size='4' className='ion-no-padding'>
                <IonCard
                  mode='ios'
                  className='profile-statistic ion-text-center'
                  color='tertiary'
                >
                  <IonCardHeader
                    className='ion-no-padding'
                    style={{
                      paddingTop: "1rem",
                      paddingBottom: "0.5rem",
                      paddingLeft: "0.5rem",
                      paddingRight: "0.5rem",
                    }}
                  >
                    <IonCardTitle>
                      <IonText
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 600,
                        }}
                      >
                        {user?.failedChallengeCount ?? 0}
                      </IonText>
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonRow className='ion-justify-content-center ion-align-items-center'>
                      <IonText style={{ fontSize: "0.9rem", fontWeight: 400 }}>
                        Shameful
                        <br />
                        Failure
                        {user?.failedChallengeCount !== 1 && "s"}
                      </IonText>
                    </IonRow>
                  </IonCardContent>
                </IonCard>
              </IonCol>
              <IonCol size='4' className='ion-no-padding'>
                <IonCard
                  mode='ios'
                  className='profile-statistic ion-text-center'
                  color='quinary'
                >
                  <IonCardHeader
                    className='ion-no-padding'
                    style={{
                      paddingTop: "1rem",
                      paddingBottom: "0.5rem",
                      paddingLeft: "0.5rem",
                      paddingRight: "0.5rem",
                    }}
                  >
                    <IonCardTitle>
                      <IonText
                        style={{
                          fontSize: "1.5rem",
                          fontWeight: 600,
                        }}
                      >
                        {user?.vetoedChallengeCount ?? 0}
                      </IonText>
                    </IonCardTitle>
                  </IonCardHeader>
                  <IonCardContent>
                    <IonRow className='ion-justify-content-center ion-align-items-center'>
                      <IonText style={{ fontSize: "0.9rem", fontWeight: 400 }}>
                        Shameless
                        <br />
                        Cheat
                        {user?.vetoedChallengeCount !== 1 && "s"}
                      </IonText>
                    </IonRow>
                  </IonCardContent>
                </IonCard>
              </IonCol>
            </IonRow>
          </IonGrid>
          <IonRow className='ion-padding-horizontal ion-justify-content-center'>
            <IonText style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
              Past challenges
            </IonText>
          </IonRow>
          {renderChallengeHistory()}
        </Scrollbars>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
