import React, { useEffect, useState } from "react";
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonBadge,
} from "@ionic/react";
import { Route, Redirect, useLocation } from "react-router";
import {
  personOutline,
  storefrontOutline,
  telescopeOutline,
} from "ionicons/icons";
import challengeIcon from "../../assets/icons/challenge-icon.svg";
import shameIcon from "../../assets/icons/shame-icon.svg";
import "./Tabs.scss";
import Challenges from "../../pages/challenges";
import WallOfShame from "../../pages/wallOfShame";
import Profile from "../../pages/profile";
import CreateChallenge from "../../pages/challenges/create";
import ChallengeDetails from "../../pages/challenges/details";
import EditProfile from "../../pages/profile/edit";
import Settings from "../../pages/profile/settings";
import Explore from "../../pages/explore";
import Store from "../../pages/store";
import Invitations from "../../pages/challenges/invitations";
import OtherProfile from "../../pages/profile/other";
import Friends from "../../pages/profile/friends";
import { useWindowSize } from "../../utils/WindowUtils";
import PastChallenges from "../../pages/profile/challenges";
import { useUser } from "../../contexts/UserContext";
import { UserList } from "../../interfaces/models/Users";
import Landing from "../../pages/share";

const redirectToChallenges = (): React.ReactNode => (
  <Redirect to={"/challenges"} />
);

const Tabs: React.FC = () => {
  const { isDesktop } = useWindowSize();
  const { getFriendRequests, shouldRefreshUser } = useUser();

  const location = useLocation();

  const [requests, setRequests] = useState<UserList[]>([]);

  const fetchData = async () => {
    try {
      const requestsData = await getFriendRequests();
      setRequests(requestsData);
    } catch (error) {}
  };

  useEffect(() => {
    // Fetch requests
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldRefreshUser]);

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <IonTabs>
      <IonRouterOutlet animated={false}>
        <Route exact path='/share/link/:id' component={Landing} />
        <Route exact path='/challenges'>
          <Challenges />
        </Route>
        <Route exact path='/challenges/invitations'>
          <Invitations />
        </Route>
        <Route exact path='/challenges/create'>
          <CreateChallenge />
        </Route>
        <Route exact path='/challenges/:id/details'>
          <ChallengeDetails />
        </Route>
        <Route exact path='/explore'>
          <Explore />
        </Route>
        <Route exact path='/explore/challenges/:id/details'>
          <ChallengeDetails />
        </Route>
        <Route exact path='/wall-of-shame'>
          <WallOfShame />
        </Route>
        <Route exact path='/store'>
          <Store />
        </Route>
        <Route exact path='/profile'>
          <Profile />
        </Route>
        <Route exact path='/profile/edit'>
          <EditProfile />
        </Route>
        <Route exact path='/profile/settings'>
          <Settings />
        </Route>
        <Route exact path='/profile/user/:id'>
          <OtherProfile />
        </Route>
        <Route exact path='/profile/friends'>
          <Friends />
        </Route>
        <Route exact path='/profile/challenge-history'>
          <PastChallenges />
        </Route>
        <Route exact path='/profile/challenge-history/:id/details'>
          <ChallengeDetails />
        </Route>
        <Route render={redirectToChallenges} />
      </IonRouterOutlet>
      <IonTabBar
        slot='bottom'
        className='mobile-nav-tabs'
        id='mobile-nav-tabs'
        hidden={
          isDesktop ||
          (location.pathname !== "/challenges" &&
            location.pathname !== "/explore" &&
            location.pathname !== "/wall-of-shame" &&
            location.pathname !== "/store" &&
            location.pathname !== "/profile")
        }
      >
        <IonTabButton tab='challenges' href='/challenges'>
          <IonIcon icon={challengeIcon} />
        </IonTabButton>
        <IonTabButton tab='explore' href='/explore'>
          <IonIcon icon={telescopeOutline} />
        </IonTabButton>
        <IonTabButton tab='wall-of-shame' href='/wall-of-shame'>
          <IonIcon icon={shameIcon} />
        </IonTabButton>
        <IonTabButton tab='store' href='/store'>
          <IonIcon icon={storefrontOutline} />
        </IonTabButton>
        <IonTabButton tab='profile' href='/profile'>
          <IonIcon icon={personOutline} />
          {requests.length > 0 && (
            <IonBadge
              mode='ios'
              color='danger'
              style={{
                position: "absolute",
                top: "0.5rem",
                right: "0.4rem",
                width: "0.85rem",
                height: "0.85rem",
              }}
            >
              &nbsp;
            </IonBadge>
          )}
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
