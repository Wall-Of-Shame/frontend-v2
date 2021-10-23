import React from "react";
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
} from "@ionic/react";
import { Route, Redirect, useLocation } from "react-router";
import {
  personOutline,
  storefrontOutline,
  flashlightOutline,
} from "ionicons/icons";
import challengeIcon from "../../assets/icons/challenge-icon.svg";
import shameIcon from "../../assets/icons/shame-icon.svg";
import "./Tabs.scss";
import Challenges from "../challenges";
import WallOfShame from "../wallOfShame";
import Profile from "../profile";
import CreateChallenge from "../challenges/create";
import ChallengeDetails from "../challenges/details";
import EditProfile from "../profile/edit";
import Settings from "../profile/settings";
import Explore from "../explore";
import Search from "../explore/search";
import Store from "../store";
import Invitations from "../challenges/invitations";
import OtherProfile from "../profile/other";
import Friends from "../profile/friends";
import { useWindowSize } from "../../utils/WindowUtils";
import PastChallenges from "../profile/challenges";

const redirectToChallenges = (): React.ReactNode => (
  <Redirect to={"/challenges"} />
);

const Tabs: React.FC = () => {
  const { isDesktop } = useWindowSize();

  const location = useLocation();

  return (
    <IonTabs>
      <IonRouterOutlet animated={false}>
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
        <Route exact path='/explore/search'>
          <Search />
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
        <Route exact path='/challenge-history'>
          <PastChallenges />
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
          <IonIcon icon={flashlightOutline} />
        </IonTabButton>
        <IonTabButton tab='wall-of-shame' href='/wall-of-shame'>
          <IonIcon icon={shameIcon} />
        </IonTabButton>
        <IonTabButton tab='store' href='/store'>
          <IonIcon icon={storefrontOutline} />
        </IonTabButton>
        <IonTabButton tab='profile' href='/profile'>
          <IonIcon icon={personOutline} />
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
