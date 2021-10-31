import {
  IonAvatar,
  IonButtons,
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
  IonRow,
  IonText,
  IonToolbar,
  IonSearchbar,
  IonPage,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
import { hideTabs } from "../../../utils/TabsUtils";
import { useHistory } from "react-router";
import { useChallenge } from "../../../contexts/ChallengeContext";
import "../Explore.scss";
import { useWindowSize } from "../../../utils/WindowUtils";
import lodash from "lodash";
import { ChallengeData } from "../../../interfaces/models/Challenges";
import { format, parseISO } from "date-fns";
import AvatarImg from "../../../components/avatar";
import { Avatar } from "../../../interfaces/models/Users";

const Search: React.FC = () => {
  const history = useHistory();
  const { isDesktop } = useWindowSize();

  const { searchChallenge } = useChallenge();

  const [searchText, setSearchText] = useState("");
  const [challenges, setChallenges] = useState<ChallengeData[]>([]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    lodash.debounce((e) => {
      handleSearch(e);
    }, 250),
    []
  );

  const handleSearch = async (searchText: string) => {
    if (searchText.length <= 0) {
      setChallenges([]);
      return;
    }
    try {
      const response = await searchChallenge(searchText);
      setChallenges(response);
    } catch (error) {}
  };

  const renderChallenges = () => {
    if (challenges && challenges.length > 0) {
      return (
        <>
          {challenges?.map((c) => {
            const acceptedCount = c.participants.accepted.completed.concat(
              c.participants.accepted.notCompleted
            ).length;
            return (
              <IonCard
                mode='ios'
                button
                key={c.challengeId}
                onClick={() => {
                  window.localStorage.setItem("referer", "explore/search");
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
    }
  };

  useEffect(() => {
    hideTabs();
  }, []);

  return (
    <IonPage>
      <IonHeader className='ion-no-border'>
        <IonToolbar
          color='main-blue'
          style={{ paddingTop: "0.5rem", paddingBottom: "0.25rem" }}
        >
          <IonButtons slot='start'>
            <IonFabButton
              className='placeholder-fab'
              color='clear'
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
          </IonButtons>
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
            className='ion-margin-top explore-search users-search'
            showClearButton='always'
          ></IonSearchbar>
        </IonToolbar>
        {!isDesktop && <div className='explore-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid style={{ marginTop: "2rem" }}>
          <IonRow className='ion-padding-horizontal ion-padding-top ion-align-items-center'>
            <IonText
              style={{ fontSize: "16px", fontWeight: "bold" }}
              color='primary'
            >
              {`${challenges.length} result${
                challenges.length > 1 || challenges.length === 0 ? "s" : ""
              } found`}
            </IonText>
          </IonRow>
          {renderChallenges()}
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Search;
