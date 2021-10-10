import React, { useState } from "react";
import {
  IonAvatar,
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
  IonFabButton,
} from "@ionic/react";
import { useEffect } from "react";
import {
  ellipsisVertical,
  createOutline,
  settingsOutline,
  logOutOutline,
  hammerOutline,
  bugOutline,
} from "ionicons/icons";
import { Avatar } from "../../interfaces/models/Users";
import { useHistory, useLocation } from "react-router";
import { PieChart } from "react-minimal-pie-chart";
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
import FeedbackModal from "../../components/feedback";

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
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

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
                    <IonCol size='12'>
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
                        <IonRow
                          style={{ marginTop: "0.5rem" }}
                          className='ion-align-items-center'
                        >
                          <IonAvatar
                            className='avatar'
                            key={c.owner.userId}
                            style={{ marginRight: "0.5rem" }}
                          >
                            <AvatarImg avatar={c.owner.avatar as Avatar} />
                          </IonAvatar>
                          <IonText
                            style={{
                              fontSize: "0.8rem",
                            }}
                          >
                            Created by {c.owner.name ?? "Anonymous"}
                          </IonText>
                        </IonRow>
                      </IonCardContent>
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
            onClick={() => {
              setShowPopover({ showPopover: false, event: undefined });
              setShowFeedbackModal(true);
            }}
          >
            <IonIcon
              slot='start'
              icon={bugOutline}
              style={{ fontSize: "1.5rem" }}
            />
            <IonLabel>Feedback</IonLabel>
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
      <IonHeader className='ion-no-border'>
        <IonToolbar className='profile-toolbar'>
          <IonFabButton
            color='light'
            mode='ios'
            slot='end'
            style={{
              margin: "0.5rem",
              width: "3rem",
              height: "3rem",
            }}
            onClick={(e: any) => {
              e.persist();
              setShowPopover({ showPopover: true, event: e });
            }}
          >
            <IonIcon icon={ellipsisVertical} />
          </IonFabButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        {/*<div
          className='fault-line'
          style={{
            position: "absolute",
            top: 0,
            width: "100%",
            height: "11rem",
            backgroundColor: "#C0D1FF",
          }}
        />*/}
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

        <IonCard mode='ios' style={{ marginBottom: "2rem" }}>
          <IonRow className='ion-justify-content-center'>
            <PieChart
              style={{ width: "12rem", height: "12rem", marginTop: "2rem" }}
              startAngle={-90}
              lineWidth={50}
              data={[
                {
                  title: "Completed",
                  value: user?.completedChallengeCount ?? 0,
                  color: "#6C7BFF",
                },
                {
                  title: "Failures",
                  value: user?.failedChallengeCount ?? 0,
                  color: "#C7CCFF",
                },
                {
                  title: "Cheats",
                  value: user?.vetoedChallengeCount ?? 0,
                  color: "#F0F1FD",
                },
              ]}
              label={({ dataEntry }) => `${Math.round(dataEntry.percentage)}%`}
              labelPosition={75}
              labelStyle={{
                fontSize: "0.5rem",
              }}
            />
          </IonRow>
          <IonGrid className='ion-no-padding'>
            <IonRow className='ion-align-items-center'>
              <IonCol size='12'>
                <IonCardContent>
                  <IonRow className='ion-justify-content-center ion-align-items-center'>
                    <IonText
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        marginRight: "0.5rem",
                        color: "#000000",
                      }}
                    >
                      {user?.completedChallengeCount ?? 0}
                    </IonText>
                    <IonText style={{ fontSize: "0.9rem", fontWeight: 400 }}>
                      {`Challenge${
                        user?.completedChallengeCount !== 1 ? "s" : ""
                      } Completed`}
                    </IonText>
                  </IonRow>
                  <IonRow className='ion-justify-content-center ion-align-items-center'>
                    <IonText
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        marginRight: "0.5rem",
                        color: "#000000",
                      }}
                    >
                      {user?.failedChallengeCount ?? 0}
                    </IonText>
                    <IonText style={{ fontSize: "0.9rem", fontWeight: 400 }}>
                      {`Shameful Failure${
                        user?.failedChallengeCount !== 1 ? "s" : ""
                      }`}
                    </IonText>
                  </IonRow>
                  <IonRow className='ion-justify-content-center ion-align-items-center'>
                    <IonText
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                        marginRight: "0.5rem",
                        color: "#000000",
                      }}
                    >
                      {user?.vetoedChallengeCount ?? 0}
                    </IonText>
                    <IonText style={{ fontSize: "0.9rem", fontWeight: 400 }}>
                      {`Shameless Cheat${
                        user?.vetoedChallengeCount !== 1 ? "s" : ""
                      }`}
                    </IonText>
                  </IonRow>
                </IonCardContent>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonCard>
        <IonRow className='ion-padding-horizontal ion-justify-content-center'>
          <IonText style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
            Past challenges
          </IonText>
        </IonRow>
        {renderChallengeHistory()}
        <FeedbackModal
          showModal={showFeedbackModal}
          setShowModal={setShowFeedbackModal}
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
