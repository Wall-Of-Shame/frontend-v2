import {
  IonAvatar,
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
  IonImg,
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { format, formatDistanceToNowStrict, isAfter, parseISO } from "date-fns";
import { search } from "ionicons/icons";
import { useEffect, useState } from "react";
import { useHistory, useLocation } from "react-router";
import AvatarImg from "../../components/avatar";
import { Avatar } from "../../interfaces/models/Users";
import { showTabs, hideTabs } from "../../utils/TabsUtils";
import { useWindowSize } from "../../utils/WindowUtils";
import { useChallenge } from "../../contexts/ChallengeContext";
import "./Explore.scss";
import { useSelector } from "react-redux";
import { RootState } from "../../reducers/RootReducer";
import { ChallengeDux } from "../../reducers/ChallengeDux";
import { ChallengeData } from "../../interfaces/models/Challenges";
import { useUser } from "../../contexts/UserContext";

const Explore: React.FC = () => {
  const location = useLocation();
  const history = useHistory();
  const { isDesktop } = useWindowSize();
  const { user } = useUser();
  const { getExplore } = useChallenge();
  const selectChallenges = (state: RootState): ChallengeDux => state.challenges;

  const [featured, setFeatured] = useState<ChallengeData[]>(
    useSelector(selectChallenges).featured
  );

  const [others, setOthers] = useState<ChallengeData[]>(
    useSelector(selectChallenges).others
  );

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchData = async () => {
    try {
      const exploreChallenges = await getExplore();
      console.log(exploreChallenges);
      setFeatured(exploreChallenges.featured);
      setOthers(exploreChallenges.others);
    } catch (error) {
      console.log(error);
    }
  };

  const renderFeaturedChallenges = () => {
    if (featured && featured.length > 0) {
      return (
        <div>
          {isDesktop ? (
            <ul className='featured-horizontal-list'>
              {featured.map((c) => {
                const hasStarted = isAfter(parseISO(c.startAt!), new Date());
                return (
                  <li
                    className='featured-horizontal-item'
                    key={`${c.challengeId}-horizontal`}
                  >
                    <IonCard
                      mode='ios'
                      button
                      key={c.challengeId}
                      onClick={() => {
                        window.localStorage.setItem("referer", "explore");
                        history.push(
                          `/explore/challenges/${c.challengeId}/details`,
                          c
                        );
                      }}
                    >
                      {/* Image height: 200, width: 220 */}
                      <IonImg
                        src={c.imageURL}
                        style={{ height: 200, width: 220 }}
                      />
                      <IonCardHeader style={{ paddingTop: "1rem" }}>
                        <IonText
                          style={{
                            fontSize: "1rem",
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          {c.title}
                        </IonText>
                      </IonCardHeader>
                      <IonCardContent>
                        {`${
                          hasStarted ? "Started" : "Starts"
                        } ${formatDistanceToNowStrict(parseISO(c.startAt!), {
                          addSuffix: true,
                        })}`}
                      </IonCardContent>
                    </IonCard>
                  </li>
                );
              })}
            </ul>
          ) : (
            <ul className='featured-horizontal-list mobile'>
              {featured.map((c) => {
                const hasStarted = isAfter(parseISO(c.startAt!), new Date());
                return (
                  <li
                    className='featured-horizontal-item'
                    key={`${c.challengeId}-horizontal`}
                  >
                    <IonCard
                      mode='ios'
                      button
                      key={c.challengeId}
                      onClick={() => {
                        window.localStorage.setItem("referer", "explore");
                        history.push(
                          `/explore/challenges/${c.challengeId}/details`,
                          c
                        );
                      }}
                    >
                      <IonImg
                        src={c.imageURL}
                        style={{ height: 200, width: 220 }}
                      />
                      <IonCardHeader style={{ paddingTop: "1rem" }}>
                        <IonText
                          style={{
                            fontSize: "1rem",
                            fontWeight: "bold",
                            color: "black",
                          }}
                        >
                          {c.title}
                        </IonText>
                      </IonCardHeader>
                      <IonCardContent className='card-start-time'>
                        {`${
                          hasStarted ? "Started" : "Starts"
                        } ${formatDistanceToNowStrict(parseISO(c.startAt!), {
                          addSuffix: true,
                        })}`}
                      </IonCardContent>
                    </IonCard>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      );
    } else {
      return (
        <IonRow className='ion-padding'>
          {"Currently there are no featured challenges!"}
        </IonRow>
      );
    }
  };

  const renderOtherChallenges = () => {
    if (others && others.length > 0) {
      return (
        <>
          {others?.map((c) => {
            const acceptedCount = c.participants.accepted.completed.concat(
              c.participants.accepted.notCompleted
            ).length;
            return (
              <IonCard
                mode='ios'
                button
                key={c.challengeId}
                onClick={() => {
                  window.localStorage.setItem("referer", "explore");
                  history.push(
                    `/explore/challenges/${c.challengeId}/details`,
                    c
                  );
                }}
              >
                <IonGrid className='ion-no-padding'>
                  <IonRow className='ion-align-items-center'>
                    <IonCol size='12'>
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
                            }}
                          >
                            {`Starts on: ${format(
                              parseISO(c.startAt!),
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
                            Created by{" "}
                            {c.owner.userId === user?.userId
                              ? "You"
                              : c.owner.name ?? "Anonymous"}
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
        <IonRow className='ion-padding'>
          {"Currently there are no trending challenges!"}
        </IonRow>
      );
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

  return (
    <IonPage style={{ background: "#ffffff" }}>
      <IonHeader className='ion-no-border'>
        <IonToolbar
          color='main-blue'
          mode='md'
          className='explore-header'
          style={{ paddingTop: "0.5rem", paddingBottom: "0.25rem" }}
        >
          <IonTitle
            size='large'
            color='white'
            style={{
              fontWeight: "800",
              fontSize: isDesktop ? "1.5rem" : "2rem",
            }}
          >
            Explore
          </IonTitle>
          <IonFabButton
            className='placeholder-fab'
            color='main-blue'
            mode='ios'
            slot='end'
            style={{
              margin: "0.5rem",
              width: "2.75rem",
              height: "2.75rem",
            }}
            routerLink='/explore/search'
          >
            <IonIcon icon={search} style={{ fontSize: "1.5rem" }} />
          </IonFabButton>
        </IonToolbar>
        {!isDesktop && <div className='explore-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid style={{ marginTop: "2rem" }}>
          <IonRow className='ion-padding-horizontal ion-padding-top ion-align-items-center'>
            <IonText
              style={{ fontSize: "20px", fontWeight: "bold" }}
              color='primary'
            >
              Featured challenges
            </IonText>
          </IonRow>
          {renderFeaturedChallenges()}

          <IonRow className='ion-padding-horizontal ion-padding-top ion-align-items-center'>
            <IonText
              style={{ fontSize: "20px", fontWeight: "bold" }}
              color='primary'
            >
              Trending challenges
            </IonText>
          </IonRow>
          {renderOtherChallenges()}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Explore;
