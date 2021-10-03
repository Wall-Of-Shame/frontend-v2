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
} from "@ionic/react";
import { useEffect } from "react";
import {
  ellipsisVertical,
  createOutline,
  settingsOutline,
  logOutOutline,
} from "ionicons/icons";
import { useHistory, useLocation } from "react-router";
import { useAuth } from "../../contexts/AuthContext";
import { hideTabs, showTabs } from "../../utils/TabsUtils";
import "./Profile.scss";
import { useUser } from "../../contexts/UserContext";
import AvatarImg from "../../components/avatar";

const Profile: React.FC = () => {
  const { logout } = useAuth();
  const { user } = useUser();
  const location = useLocation();
  const history = useHistory();
  const [popoverState, setShowPopover] = useState({
    showPopover: false,
    event: undefined,
  });

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
            style={{ marginTop: "0.5rem" }}
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
            style={{ marginBottom: "0.5rem" }}
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

      <IonHeader>
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
        <IonGrid>
          <IonRow
            className='ion-align-items-center'
            style={{ marginTop: "1rem" }}
          >
            <IonCol size='4'>
              <IonRow className='ion-justify-content-center ion-no-padding'>
                <IonAvatar id='profile-avatar'>
                  <AvatarImg avatar={user?.avatar ?? null} />
                </IonAvatar>
              </IonRow>
            </IonCol>
            <IonCol size='8'>
              <IonRow>
                <IonText
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: 600,
                    paddingBottom: "0.5rem",
                    marginRight: "0.5rem",
                  }}
                >
                  {user?.name ?? "Display name not set"}
                </IonText>
              </IonRow>
              <IonRow>
                <IonText
                  style={{
                    fontSize: "1.2rem",
                    fontWeight: 600,
                    marginRight: "0.5rem",
                  }}
                >
                  {`@${user?.username ?? "Username not set"}`}
                </IonText>
              </IonRow>
            </IonCol>
          </IonRow>
        </IonGrid>

        <IonGrid style={{ paddingBottom: "2rem" }}>
          <IonRow className='ion-align-items-center'>
            <IonCol>
              <IonCard
                mode='ios'
                className='profile-statistic ion-text-center'
                color='quaternary'
              >
                <IonCardContent>
                  <IonRow className='ion-justify-content-center ion-align-items-center'>
                    <IonText
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                      }}
                    >
                      {user?.completedChallengeCount ?? 0}
                    </IonText>
                    <IonText style={{ fontSize: "1rem", fontWeight: 400 }}>
                      &nbsp;&nbsp;Challenge
                      {user?.completedChallengeCount !== 1 && "s"} Completed
                    </IonText>
                  </IonRow>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow className='ion-align-items-center'>
            <IonCol>
              <IonCard
                mode='ios'
                className='profile-statistic ion-text-center'
                color='tertiary'
              >
                <IonCardContent>
                  <IonRow className='ion-justify-content-center ion-align-items-center'>
                    <IonText
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                      }}
                    >
                      {user?.failedChallengeCount ?? 0}
                    </IonText>
                    <IonText style={{ fontSize: "1rem", fontWeight: 400 }}>
                      &nbsp;&nbsp;Shameful Failure
                      {user?.failedChallengeCount !== 1 && "s"}
                    </IonText>
                  </IonRow>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
          <IonRow className='ion-align-items-center'>
            <IonCol>
              <IonCard
                mode='ios'
                className='profile-statistic ion-text-center'
                color='quinary'
              >
                <IonCardContent>
                  <IonRow className='ion-justify-content-center ion-align-items-center'>
                    <IonText
                      style={{
                        fontSize: "1.5rem",
                        fontWeight: 600,
                      }}
                    >
                      {user?.vetoedChallengeCount ?? 0}
                    </IonText>
                    <IonText style={{ fontSize: "1rem", fontWeight: 400 }}>
                      &nbsp;&nbsp;Shameless Cheat
                      {user?.vetoedChallengeCount !== 1 && "s"}
                    </IonText>
                  </IonRow>
                </IonCardContent>
              </IonCard>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Profile;
