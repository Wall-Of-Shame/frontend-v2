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
  IonPage,
  IonRow,
  IonText,
  IonToolbar,
  IonSearchbar,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { useCallback, useEffect, useState } from "react";
import { hideTabs } from "../../../utils/TabsUtils";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { RootState } from "../../../reducers/RootReducer";
import { ChallengeDux } from "../../../reducers/ChallengeDux";
import Container from "../../../components/container";
import "../Explore.scss";
import { useWindowSize } from "../../../utils/WindowUtils";
import lodash from "lodash";

const Search: React.FC = () => {
  const history = useHistory();
  const { isDesktop } = useWindowSize();

  const [searchText, setSearchText] = useState("");
  const [challenges, setChallenges] = useState([]);

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
      // const response = await searchUser(searchText);
      // setMatchedUsers(response);
    } catch (error) {}
  };

  useEffect(() => {
    hideTabs();
  }, []);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="main-blue" style={{ paddingTop: "0.5rem" }}>
          <IonButtons slot="start">
            <IonFabButton
              className="placeholder-fab"
              color="clear"
              mode="ios"
              slot="start"
              style={{
                margin: "0.5rem",
                width: "2.75rem",
                height: "2.75rem",
              }}
              onClick={() => {
                history.goBack();
              }}
            >
              <IonIcon icon={arrowBack} />
            </IonFabButton>
          </IonButtons>
          <IonSearchbar
            mode="ios"
            key="modal-search"
            value={searchText}
            onIonChange={(e) => {
              setSearchText(e.detail.value ?? "");
              debouncedSearch(e.detail.value ?? "");
            }}
            debounce={0}
            placeholder="Search for a challenge"
            showCancelButton="never"
            className="ion-margin-top explore-search users-search"
            showClearButton="always"
          ></IonSearchbar>
        </IonToolbar>
        {!isDesktop && <div className="explore-header-curve" />}
      </IonHeader>

      <IonContent fullscreen>
        <Container>{"There's nothing here >_<"}</Container>
      </IonContent>
    </IonPage>
  );
};

export default Search;
