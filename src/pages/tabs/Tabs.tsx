import React from "react";
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from "@ionic/react";
import { Route, Redirect } from "react-router";
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

const redirectToChallenges = (): React.ReactNode => (
  <Redirect to={"/challenges"} />
);

const Tabs: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet animated={false}>
        <Route exact path='/challenges'>
          <Challenges />
        </Route>
        <Route exact path='/challenges/create'>
          <CreateChallenge />
        </Route>
        <Route exact path='/challenges/:id/details'>
          <ChallengeDetails />
        </Route>
        <Route exact path='/wall-of-shame'>
          <WallOfShame />
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
        <Route render={redirectToChallenges} />
      </IonRouterOutlet>
      <IonTabBar slot='bottom' className='nav-tabs'>
        <IonTabButton tab='challenges' href='/challenges'>
          <IonIcon icon={challengeIcon} />
          <IonLabel>Challenges</IonLabel>
        </IonTabButton>
        <IonTabButton tab='explore' href='/explore'>
          <IonIcon icon={flashlightOutline} />
          <IonLabel>Explore</IonLabel>
        </IonTabButton>
        <IonTabButton tab='wall-of-shame' href='/wall-of-shame'>
          <IonIcon icon={shameIcon} />
          <IonLabel>Wall</IonLabel>
        </IonTabButton>
        <IonTabButton tab='store' href='/store'>
          <IonIcon icon={storefrontOutline} />
          <IonLabel>Store</IonLabel>
        </IonTabButton>
        <IonTabButton tab='profile' href='/profile'>
          <IonIcon icon={personOutline} />
          <IonLabel>Profile</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default Tabs;
