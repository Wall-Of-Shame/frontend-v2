import React, { useCallback, useReducer, useState } from "react";
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
  IonBadge,
  IonSearchbar,
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
import Alert from "../../components/alert";
import { useCache } from "../../contexts/CacheContext";
import lodash from "lodash";

export interface ProfileState {
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

const Profile: React.FC = () => {
  const { logout } = useAuth();
  const { user } = useUser();
  const { isLatestVersion } = useCache();
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

  const [state, setState] = useReducer(
    (s: ProfileState, a: Partial<ProfileState>) => ({
      ...s,
      ...a,
    }),
    {
      isLoading: false,
      showAlert: false,
      alertHeader: "",
      alertMessage: "",
      hasConfirm: false,
      confirmHandler: () => {},
      cancelHandler: () => {},
      okHandler: undefined,
    }
  );

  const [searchText, setSearchText] = useState("");
  const [debouncedSearchText, setDebouncedSearchText] = useState("");

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    lodash.debounce((e) => {
      handleSearch(e);
    }, 250),
    []
  );

  const handleSearch = async (searchText: string) => {
    setDebouncedSearchText(searchText);
  };

  useEffect(() => {
    if (
      location.pathname === "/challenges" ||
      location.pathname === "/explore" ||
      location.pathname === "/wall-of-shame" ||
      location.pathname === "/store" ||
      location.pathname === "/profile"
    ) {
      showTabs();
    } else {
      hideTabs();
    }
  }, [location.pathname]);

  const renderChallengeHistory = () => {
    const filteredChallenges = completed?.filter(
      (c) =>
        c.title.toLowerCase().indexOf(debouncedSearchText.toLowerCase()) !== -1
    );
    if (filteredChallenges && filteredChallenges.length > 0) {
      return (
        <>
          {filteredChallenges.map((c) => {
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
        <IonRow
          className='ion-padding ion-justify-content-center'
          style={{ marginBottom: "0.5rem" }}
        >
          <IonText color='medium'>{"There's nothing here >_<"}</IonText>
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
              setState({
                showAlert: true,
                alertHeader: "Coming soon :)",
                alertMessage: "Thank you for using Wall of Shame",
              });
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
            {!isLatestVersion && (
              <IonBadge
                color='danger'
                slot='end'
                mode='ios'
                style={{
                  width: "1rem",
                  height: "1rem",
                }}
              >
                &nbsp;
              </IonBadge>
            )}
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
          {(user?.completedChallengeCount ?? 0) +
            (user?.failedChallengeCount ?? 0) +
            (user?.vetoedChallengeCount ?? 0) >
            0 && (
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
                label={({ dataEntry }) => {
                  const percentage = Math.round(dataEntry.percentage);
                  if (percentage > 0) {
                    return `${Math.round(dataEntry.percentage)}%`;
                  }
                  return "";
                }}
                labelPosition={75}
                labelStyle={{
                  fontSize: "0.5rem",
                }}
              />
            </IonRow>
          )}
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
                    <IonBadge
                      mode='ios'
                      style={{
                        marginLeft: "0.5rem",
                        width: "1rem",
                        height: "1rem",
                        backgroundColor: "#6C7BFF",
                      }}
                    >
                      &nbsp;
                    </IonBadge>
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
                    <IonBadge
                      mode='ios'
                      style={{
                        marginLeft: "0.5rem",
                        width: "1rem",
                        height: "1rem",
                        backgroundColor: "#C7CCFF",
                      }}
                    >
                      &nbsp;
                    </IonBadge>
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
                    <IonBadge
                      mode='ios'
                      style={{
                        marginLeft: "0.5rem",
                        width: "1rem",
                        height: "1rem",
                        backgroundColor: "#F0F1FD",
                      }}
                    >
                      &nbsp;
                    </IonBadge>
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
        <IonRow style={{ paddingLeft: "0.25rem", paddingRight: "0.25rem" }}>
          <IonSearchbar
            mode='ios'
            key='modal-search'
            value={searchText}
            onIonChange={(e) => {
              setSearchText(e.detail.value ?? "");
              debouncedSearch(e.detail.value ?? "");
            }}
            debounce={0}
            placeholder='Search for a challenge'
            showCancelButton='never'
            className='ion-margin-top users-search'
            showClearButton='always'
          ></IonSearchbar>
        </IonRow>
        {renderChallengeHistory()}
        <FeedbackModal
          showModal={showFeedbackModal}
          setShowModal={setShowFeedbackModal}
        />
        <Alert
          showAlert={state.showAlert}
          closeAlert={(): void => {
            setState({
              showAlert: false,
            });
          }}
          alertHeader={state.alertHeader}
          alertMessage={state.alertMessage}
          hasConfirm={state.hasConfirm}
          confirmHandler={state.confirmHandler}
          cancelHandler={state.cancelHandler}
          okHandler={state.okHandler}
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
