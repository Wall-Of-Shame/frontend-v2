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
  IonPage,
  IonRow,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import { parseISO } from "date-fns";
import { search } from "ionicons/icons";
import { format } from "path";
import { useEffect } from "react";
import { useLocation } from "react-router";
import AvatarImg from "../../components/avatar";
import Container from "../../components/container";
import { Avatar } from "../../interfaces/models/Users";
import { showTabs, hideTabs } from "../../utils/TabsUtils";
import { useWindowSize } from "../../utils/WindowUtils";
import { useChallenge } from "../../contexts/ChallengeContext";
import "./Explore.scss";

const Explore: React.FC = () => {
  const location = useLocation();
  const { isDesktop } = useWindowSize();
  const { getAllChallenges } = useChallenge();

  // const [publicChallenge]

  // useEffect(() => {
  //   fetchData();
  // }, []);

  const renderChallenges = () => {
    return (
      <Container>
        <div>
          list of challenges here
        </div>
      </Container>
    )
  }

  // const fetchData = async () => {
  //   try {
  //     const allChallenges = await getAllChallenges();
  //     setOngoing(allChallenges.ongoing);
  //     setPendingStart(allChallenges.pendingStart);
  //     setPendingResponse(allChallenges.pendingResponse);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // };

  // const renderChallenges = () => {
  //   if (
  //     (pendingResponse && pendingResponse.length > 0) ||
  //     (pendingStart && pendingStart.length > 0)
  //   ) {
  //     return (
  //       <>
  //         {pendingResponse.length > 0 && (
  //           <>
  //             <IonRow className="ion-padding-horizontal ion-margin-top">
  //               <IonText style={{ color: "gray" }}>Pending Invitations</IonText>
  //             </IonRow>
  //             {pendingResponse?.map((c) => {
  //               const acceptedCount = c.participants.accepted.completed.concat(
  //                 c.participants.accepted.notCompleted
  //               ).length;
  //               return (
  //                 <IonCard
  //                   mode="ios"
  //                   button
  //                   key={c.challengeId}
  //                   onClick={() => {
  //                     history.push(`challenges/${c.challengeId}/details`, c);
  //                   }}
  //                 >
  //                   <IonGrid className="ion-no-padding">
  //                     <IonRow className="ion-align-items-center">
  //                       <IonCol size="12">
  //                         <IonCardHeader style={{ paddingBottom: "0.75rem" }}>
  //                           <IonCardTitle style={{ fontSize: "1.2rem" }}>
  //                             {c.title}
  //                           </IonCardTitle>
  //                         </IonCardHeader>
  //                         <IonCardContent>
  //                           <IonRow>
  //                             <IonText
  //                               style={{
  //                                 fontSize: "0.8rem",
  //                                 fontWeight: "bold",
  //                               }}
  //                             >
  //                               Waiting for your response
  //                             </IonText>
  //                           </IonRow>
  //                           <IonRow style={{ marginTop: "0.5rem" }}>
  //                             <IonText style={{ fontSize: "0.8rem" }}>
  //                               {acceptedCount} participant
  //                               {acceptedCount === 1 ? "" : "s"}
  //                             </IonText>
  //                           </IonRow>
  //                           <IonRow
  //                             style={{ marginTop: "0.5rem" }}
  //                             className="ion-align-items-center"
  //                           >
  //                             <IonAvatar
  //                               className="avatar"
  //                               key={c.owner.userId}
  //                               style={{ marginRight: "0.5rem" }}
  //                             >
  //                               <AvatarImg avatar={c.owner.avatar as Avatar} />
  //                             </IonAvatar>
  //                             <IonText
  //                               style={{
  //                                 fontSize: "0.8rem",
  //                               }}
  //                             >
  //                               Created by {c.owner.name ?? "Anonymous"}
  //                             </IonText>
  //                           </IonRow>
  //                         </IonCardContent>
  //                       </IonCol>
  //                     </IonRow>
  //                   </IonGrid>
  //                 </IonCard>
  //               );
  //             })}
  //           </>
  //         )}
  //         {pendingStart.length > 0 && (
  //           <>
  //             {pendingStart?.map((c) => {
  //               const acceptedCount = c.participants.accepted.completed.concat(
  //                 c.participants.accepted.notCompleted
  //               ).length;
  //               return (
  //                 <IonCard
  //                   mode="ios"
  //                   button
  //                   key={c.challengeId}
  //                   onClick={() => {
  //                     history.push(`challenges/${c.challengeId}/details`, c);
  //                   }}
  //                 >
  //                   <IonGrid className="ion-no-padding">
  //                     <IonRow className="ion-align-items-center">
  //                       <IonCol size="12">
  //                         <IonCardHeader style={{ paddingBottom: "0.75rem" }}>
  //                           <IonCardTitle style={{ fontSize: "1.2rem" }}>
  //                             {c.title}
  //                           </IonCardTitle>
  //                         </IonCardHeader>
  //                         <IonCardContent>
  //                           <IonRow>
  //                             <IonText
  //                               style={{
  //                                 fontSize: "0.8rem",
  //                                 fontWeight: "bold",
  //                               }}
  //                             >
  //                               {`Starts on ${format(
  //                                 parseISO(c.startAt!),
  //                                 "dd MMM yyyy, HH:mm"
  //                               )}`}
  //                             </IonText>
  //                           </IonRow>
  //                           <IonRow style={{ marginTop: "0.5rem" }}>
  //                             <IonText style={{ fontSize: "0.8rem" }}>
  //                               {acceptedCount} participant
  //                               {acceptedCount === 1 ? " has " : "s have "}
  //                               accepted
  //                             </IonText>
  //                           </IonRow>
  //                           <IonRow
  //                             style={{ marginTop: "0.5rem" }}
  //                             className="ion-align-items-center"
  //                           >
  //                             <IonAvatar
  //                               className="avatar"
  //                               key={c.owner.userId}
  //                               style={{ marginRight: "0.5rem" }}
  //                             >
  //                               <AvatarImg avatar={c.owner.avatar as Avatar} />
  //                             </IonAvatar>
  //                             <IonText
  //                               style={{
  //                                 fontSize: "0.8rem",
  //                               }}
  //                             >
  //                               Created by {c.owner.name ?? "Anonymous"}
  //                             </IonText>
  //                           </IonRow>
  //                         </IonCardContent>
  //                       </IonCol>
  //                     </IonRow>
  //                   </IonGrid>
  //                 </IonCard>
  //               );
  //             })}
  //           </>
  //         )}
  //       </>
  //     );
  //   } else {
  //     return (
  //       <IonRow
  //         className="ion-padding ion-justify-content-center"
  //         style={{ marginTop: "1.5rem" }}
  //       >
  //         {"There's nothing here >_<"}
  //       </IonRow>
  //     );
  //   }
  // };

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
      <IonHeader className="ion-no-border">
        <IonToolbar
          color="main-blue"
          mode="md"
          className="explore-header"
          style={{ paddingTop: "0.5rem", paddingBottom: "0.25rem" }}
        >
          <IonTitle
            size="large"
            color="white"
            style={{
              fontWeight: "800",
              fontSize: isDesktop ? "1.5rem" : "2rem",
            }}
          >
            Explore
          </IonTitle>
          <IonFabButton
            className="placeholder-fab"
            color="main-blue"
            mode="ios"
            slot="end"
            style={{
              margin: "0.5rem",
              width: "2.75rem",
              height: "2.75rem",
            }}
            routerLink='/explore/search'
          >
            <IonIcon
              icon={search}
              style={{ fontSize: "1.5rem" }}
            />
          </IonFabButton>
        </IonToolbar>
        {!isDesktop && <div className='explore-header-curve' />}
      </IonHeader>

      <IonContent fullscreen>
        <IonGrid style={{ marginTop: "2rem" }}>
          <IonRow className="ion-padding ion-align-items-center">
            <IonText style={{ fontWeight: "bold" }} color="primary">
              Featured challenges
            </IonText>
          </IonRow>

          <IonRow className="ion-padding ion-align-items-center">
            <IonText style={{ fontWeight: "bold" }} color="primary">
              Trending challenges
            </IonText>
          </IonRow>
          {renderChallenges()}
        </IonGrid>
        {/* <Container>Coming soon :)</Container> */}
      </IonContent>
    </IonPage>
  );
};

export default Explore;
