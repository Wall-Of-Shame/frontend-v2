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
  IonSearchbar,
  IonTitle,
} from "@ionic/react";
import { useEffect } from "react";
import { arrowBack, ellipsisVertical } from "ionicons/icons";
import { Avatar } from "../../../interfaces/models/Users";
import { useHistory, useLocation } from "react-router";
import { hideTabs, showTabs } from "../../../utils/TabsUtils";
import "./PastChallenges.scss";
import AvatarImg from "../../../components/avatar";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/RootReducer";
import { ChallengeDux } from "../../../reducers/ChallengeDux";
import { ChallengeData } from "../../../interfaces/models/Challenges";
import { format, parseISO } from "date-fns";
import Alert from "../../../components/alert";
import lodash from "lodash";
import { useWindowSize } from "../../../utils/WindowUtils";
import Container from "../../../components/container";

export interface PastChallengesState {
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

const PastChallenges: React.FC = () => {
  const { isDesktop } = useWindowSize();
  const location = useLocation();
  const history = useHistory();
  const selectChallenges = (state: RootState): ChallengeDux => state.challenges;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [completed, setCompleted] = useState<ChallengeData[]>(
    useSelector(selectChallenges).history
  );

  const [state, setState] = useReducer(
    (s: PastChallengesState, a: Partial<PastChallengesState>) => ({
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
        <Container>
          <IonText color='medium'>{"There's nothing here >_<"}</IonText>
        </Container>
      );
    }
  };

  return (
    <IonPage style={{ background: "#ffffff" }}>
      <IonHeader className='ion-no-border'>
        <IonToolbar
          color='main-blue'
          mode='md'
          className='store-header'
          style={{ paddingTop: "0.5rem", paddingBottom: "0.25rem" }}
        >
          <IonFabButton
            className='placeholder-fab'
            color='main-blue'
            mode='ios'
            slot='start'
            style={{
              margin: "0.5rem",
              width: "2.75rem",
              height: "2.75rem",
            }}
            onClick={() => history.goBack()}
          >
            <IonIcon icon={arrowBack} />
          </IonFabButton>
          <IonTitle
            size='large'
            color='white'
            style={{
              fontWeight: "800",
            }}
          >
            Past challenges
          </IonTitle>
        </IonToolbar>
        {!isDesktop && <div className='profile-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
        <IonRow
          style={{
            paddingLeft: "0.25rem",
            paddingRight: "0.25rem",
            marginTop: "0.5rem",
          }}
        >
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

export default PastChallenges;
