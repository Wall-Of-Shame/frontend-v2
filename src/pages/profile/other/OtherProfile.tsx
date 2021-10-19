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
  IonPage,
  IonRow,
  IonText,
  IonToolbar,
  IonCardHeader,
  IonCardTitle,
  IonFabButton,
  IonBadge,
  IonSearchbar,
  IonSkeletonText,
} from "@ionic/react";
import { useEffect } from "react";
import { chevronBackOutline } from "ionicons/icons";
import { Avatar, UserList } from "../../../interfaces/models/Users";
import { Redirect, useHistory, useLocation } from "react-router";
import { PieChart } from "react-minimal-pie-chart";
import { hideTabs, showTabs } from "../../../utils/TabsUtils";
import "./OtherProfile.scss";
import { useUser } from "../../../contexts/UserContext";
import AvatarImg from "../../../components/avatar";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/RootReducer";
import { ChallengeDux } from "../../../reducers/ChallengeDux";
import { ChallengeData } from "../../../interfaces/models/Challenges";
import { format, parseISO } from "date-fns";
import FeedbackModal from "../../../components/feedback";
import Alert from "../../../components/alert";
import lodash from "lodash";

export interface OtherProfileState {
  profile: UserList | undefined;
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

const OtherProfile: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { user, getUserProfile } = useUser();
  const pathname = window.location.pathname;
  const splitted = pathname.split("/");
  const id = splitted[splitted.length - 1];
  const selectChallenges = (state: RootState): ChallengeDux => state.challenges;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [completed, setCompleted] = useState<ChallengeData[]>(
    useSelector(selectChallenges).history
  );
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const [state, setState] = useReducer(
    (s: OtherProfileState, a: Partial<OtherProfileState>) => ({
      ...s,
      ...a,
    }),
    {
      profile: undefined,
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

  const fetchData = async () => {
    setState({ isLoading: true });
    try {
      // TODO: fetch other user

      const data = await getUserProfile(id);
      setState({ profile: data });
    } catch (error) {
      setState({
        isLoading: false,
        showAlert: true,
        alertHeader: "Ooooops",
        alertMessage: "Our server is taking a break, come back later please :)",
        okHandler: () => {
          history.goBack();
        },
      });
    }
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

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  if (id === user?.userId) {
    return <Redirect to='/profile' />;
  }

  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar
          className='profile-toolbar'
          style={{ paddingTop: "0.5rem" }}
        >
          <IonFabButton
            color='light'
            mode='ios'
            slot='start'
            style={{
              margin: "0.5rem",
              width: "2.75rem",
              height: "2.75rem",
            }}
            onClick={() => {
              history.goBack();
            }}
          >
            <IonIcon icon={chevronBackOutline} />
          </IonFabButton>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonRow
          className='ion-align-items-center ion-margin'
          style={{ marginTop: "2.5rem" }}
        >
          <IonCol>
            <IonRow className='ion-justify-content-center'>
              <IonAvatar id='profile-avatar'>
                {state.profile?.avatar ? (
                  <AvatarImg avatar={state.profile.avatar} />
                ) : (
                  <IonSkeletonText animated />
                )}
              </IonAvatar>
            </IonRow>
          </IonCol>
        </IonRow>
        <IonRow className='ion-justify-content-center'>
          {state.profile?.name ? (
            <IonText
              style={{
                fontSize: "1.5rem",
                fontWeight: 600,
                marginTop: "0.5rem",
                marginLeft: "0.5rem",
                marginRight: "0.5rem",
              }}
            >
              {state.profile.name}
            </IonText>
          ) : (
            <IonSkeletonText
              animated
              style={{ width: "25%", height: "1rem" }}
            />
          )}
        </IonRow>
        <IonRow className='ion-justify-content-center'>
          {state.profile?.username ? (
            <IonText
              style={{
                fontSize: "1.2rem",
                fontWeight: 500,
                margin: "0.5rem",
              }}
              color='medium'
            >
              {`@${state.profile?.username ?? ""}`}
            </IonText>
          ) : (
            <IonSkeletonText
              animated
              style={{ width: "25%", height: "1rem" }}
            />
          )}
        </IonRow>

        <IonRow className='ion-justify-content-center'>
          <IonCol sizeXs='12' sizeMd='8' sizeLg='6'>
            <IonCard mode='ios' style={{ marginBottom: "2rem" }}>
              {(state.profile?.completedChallengeCount ?? 0) +
                (state.profile?.failedChallengeCount ?? 0) +
                (state.profile?.vetoedChallengeCount ?? 0) >
                0 && (
                <IonRow className='ion-justify-content-center'>
                  <PieChart
                    style={{
                      width: "12rem",
                      height: "12rem",
                      marginTop: "2rem",
                    }}
                    startAngle={-90}
                    lineWidth={50}
                    data={[
                      {
                        title: "Completed",
                        value: state.profile?.completedChallengeCount ?? 0,
                        color: "#6C7BFF",
                      },
                      {
                        title: "Failures",
                        value: state.profile?.failedChallengeCount ?? 0,
                        color: "#C7CCFF",
                      },
                      {
                        title: "Cheats",
                        value: state.profile?.vetoedChallengeCount ?? 0,
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
                      {state.profile?.completedChallengeCount ? (
                        <IonRow className='ion-justify-content-center ion-align-items-center'>
                          <IonText
                            style={{
                              fontSize: "1.5rem",
                              fontWeight: 600,
                              marginRight: "0.5rem",
                              color: "#000000",
                            }}
                          >
                            {state.profile?.completedChallengeCount ?? 0}
                          </IonText>
                          <IonText
                            style={{ fontSize: "0.9rem", fontWeight: 400 }}
                          >
                            {`Challenge${
                              state.profile?.completedChallengeCount !== 1
                                ? "s"
                                : ""
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
                      ) : (
                        <IonSkeletonText
                          animated
                          style={{
                            width: "100%",
                            height: "1rem",
                            margin: "0.5rem",
                          }}
                        />
                      )}
                      {state.profile?.failedChallengeCount ? (
                        <IonRow className='ion-justify-content-center ion-align-items-center'>
                          <IonText
                            style={{
                              fontSize: "1.5rem",
                              fontWeight: 600,
                              marginRight: "0.5rem",
                              color: "#000000",
                            }}
                          >
                            {state.profile?.failedChallengeCount ?? 0}
                          </IonText>
                          <IonText
                            style={{ fontSize: "0.9rem", fontWeight: 400 }}
                          >
                            {`Shameful Failure${
                              state.profile?.failedChallengeCount !== 1
                                ? "s"
                                : ""
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
                      ) : (
                        <IonSkeletonText
                          animated
                          style={{
                            width: "100%",
                            height: "1rem",
                            margin: "0.5rem",
                          }}
                        />
                      )}
                      {state.profile?.vetoedChallengeCount ? (
                        <IonRow className='ion-justify-content-center ion-align-items-center'>
                          <IonText
                            style={{
                              fontSize: "1.5rem",
                              fontWeight: 600,
                              marginRight: "0.5rem",
                              color: "#000000",
                            }}
                          >
                            {state.profile?.vetoedChallengeCount ?? 0}
                          </IonText>
                          <IonText
                            style={{ fontSize: "0.9rem", fontWeight: 400 }}
                          >
                            {`Shameless Cheat${
                              state.profile?.vetoedChallengeCount !== 1
                                ? "s"
                                : ""
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
                      ) : (
                        <IonSkeletonText
                          animated
                          style={{
                            width: "100%",
                            height: "1rem",
                            margin: "0.5rem",
                          }}
                        />
                      )}
                    </IonCardContent>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonCard>
          </IonCol>
        </IonRow>
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

export default OtherProfile;
