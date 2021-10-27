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
import { arrowBack } from "ionicons/icons";
import { Avatar } from "../../../interfaces/models/Users";
import { useHistory, useLocation } from "react-router";
import { VariableSizeList as VirtualList } from "react-window";
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

interface PastChallengesState {
  isLoading: boolean;
  showAlert: boolean;
  alertHeader: string;
  alertMessage: string;
  hasConfirm: boolean;
  confirmHandler: () => void;
  cancelHandler: () => void;
  okHandler?: () => void;
}

interface VirtualListProps {
  index: number;
  style: any;
}

const PastChallenges: React.FC = () => {
  const { isDesktop, width, height } = useWindowSize();
  const location = useLocation();
  const history = useHistory();
  const selectChallenges = (state: RootState): ChallengeDux => state.challenges;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [completed, setCompleted] = useState<ChallengeData[]>(
    useSelector(selectChallenges).history
  );
  const [filteredChallenges, setFilteredChallenges] = useState<ChallengeData[]>(
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
    const filteredData = completed?.filter(
      (c) =>
        c.title.toLowerCase().indexOf(debouncedSearchText.toLowerCase()) !== -1
    );
    setFilteredChallenges(filteredData);
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

  const Row = (props: VirtualListProps) => {
    const { style, index } = props;
    if (index === filteredChallenges.length) {
      return (
        <div style={style}>
          <div style={{ margin: "0.5rem" }}></div>
        </div>
      );
    }

    const c = filteredChallenges[index];
    return (
      <div style={style}>
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
                      <div
                        style={{
                          width: width! > 576 ? 536 : width! - 75,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {c.title}
                      </div>
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
      </div>
    );
  };

  const renderChallengeHistory = () => {
    const filteredChallenges = completed?.filter(
      (c) =>
        c.title.toLowerCase().indexOf(debouncedSearchText.toLowerCase()) !== -1
    );
    if (filteredChallenges && filteredChallenges.length > 0) {
      return (
        <VirtualList
          height={isDesktop ? height! - 184 : height! - 140}
          width={width! > 576 ? 576 : width!}
          itemCount={filteredChallenges.length + 1}
          itemSize={(index) => {
            if (index === filteredChallenges.length) {
              return 24;
            }
            return 156;
          }}
          style={{ zIndex: 1 }}
        >
          {Row}
        </VirtualList>
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
          style={{ paddingTop: "0.5rem", paddingBottom: "0.5rem" }}
        >
          <IonFabButton
            className='placeholder-fab'
            color='main-blue'
            mode='ios'
            slot='start'
            style={{
              marginTop: "0.25rem",
              marginLeft: "0.5rem",
              marginRight: "0.5rem",
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
              marginTop: "0.25rem",
              fontWeight: "800",
            }}
          >
            Past challenges
          </IonTitle>
        </IonToolbar>
        {!isDesktop && <div className='profile-header-curve' />}
      </IonHeader>

      <IonContent fullscreen scrollY={false}>
        <IonRow
          style={{
            marginTop: "1rem",
            paddingLeft: "0.25rem",
            paddingRight: "0.25rem",
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
            className='ion-margin-top challenges-search'
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
