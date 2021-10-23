import {
  IonDatetime,
  IonGrid,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
  IonRow,
  IonText,
  IonTextarea,
} from "@ionic/react";
import { useEffect } from "react";
import {
  addYears,
  format,
  formatDuration,
  formatISO,
  intervalToDuration,
  isAfter,
  isBefore,
  parseISO,
} from "date-fns";
import "./EditChallenge.scss";
import { ChallengePost } from "../../../interfaces/models/Challenges";
import { hideTabs } from "../../../utils/TabsUtils";
import { EditChallengeState } from "../details/ChallengeDetails";

export type editCallbackParam = (data: ChallengePost) => void;

interface EditChallengeProps {
  state: EditChallengeState;
  setState: React.Dispatch<Partial<EditChallengeState>>;
  hasError: boolean;
}

const EditChallenge: React.FC<EditChallengeProps> = (
  props: EditChallengeProps
) => {
  const { state, setState, hasError } = props;

  useEffect(() => {
    hideTabs();
  }, []);

  return (
    <>
      <IonGrid style={{ marginTop: "2rem" }}>
        <IonRow className='ion-padding-bottom ion-padding-horizontal'>
          <IonText>
            Anyone who doesn't finish the challenge in time will be thrown to
            the wall
          </IonText>
        </IonRow>
      </IonGrid>
      <IonGrid>
        <IonRow className='ion-padding'>
          <IonText
            style={{ fontWeight: "600" }}
            color={hasError && state.title.length <= 0 ? "danger" : "primary"}
          >
            What's the challenge called?*
          </IonText>
        </IonRow>
        <IonRow className='ion-padding-horizontal'>
          <div
            style={{
              width: "100%",
              borderRadius: "0.5rem",
              background: "#ffffff",
              paddingLeft: "0.75rem",
              paddingRight: "0.75rem",
              boxShadow: "rgba(149, 149, 149, 0.2) 0px 2px 10px 0px",
            }}
          >
            <IonInput
              value={state.title}
              placeholder='Enter title'
              maxlength={50}
              autoCorrect='on'
              onIonChange={(event) => {
                setState({ title: event.detail.value ?? "" });
              }}
            />
          </div>
        </IonRow>
        <IonRow
          className='ion-padding-horizontal ion-justify-content-end'
          style={{ marginTop: "0.5rem" }}
        >
          <IonText style={{ fontSize: "14px", color: "#adadad" }}>
            {`${state.title.length}/50`}
          </IonText>
        </IonRow>
      </IonGrid>
      <IonGrid>
        <IonRow className='ion-padding'>
          <IonText
            style={{ fontWeight: "600" }}
            color={
              hasError && state.description.length <= 0 ? "danger" : "primary"
            }
          >
            What do they need to do?*
          </IonText>
        </IonRow>
        <IonRow className='ion-padding-horizontal'>
          <div
            style={{
              width: "100%",
              borderRadius: "0.5rem",
              background: "#ffffff",
              paddingLeft: "0.75rem",
              paddingRight: "0.75rem",
              boxShadow: "rgba(149, 149, 149, 0.2) 0px 2px 10px 0px",
            }}
          >
            <IonTextarea
              value={state.description}
              rows={4}
              maxlength={200}
              autoCorrect='on'
              placeholder='Enter challenge description'
              onIonChange={(event) => {
                setState({ description: event.detail.value ?? "" });
              }}
            />
          </div>
        </IonRow>
        <IonRow
          className='ion-padding-horizontal ion-justify-content-end'
          style={{ marginTop: "0.5rem" }}
        >
          <IonText style={{ fontSize: "14px", color: "#adadad" }}>
            {`${state.description.length}/200`}
          </IonText>
        </IonRow>
      </IonGrid>
      <IonGrid>
        <IonRow className='ion-padding'>
          <IonText
            style={{ fontWeight: "bold" }}
            color={
              hasError && isBefore(parseISO(state.endAt), Date.now())
                ? "danger"
                : "primary"
            }
          >
            When does the challenge start and end?
          </IonText>
        </IonRow>
        <IonList>
          <IonItem lines='none'>
            <IonLabel
              color={
                !(
                  isAfter(parseISO(state.startAt), Date.now()) &&
                  isAfter(parseISO(state.endAt), parseISO(state.startAt))
                )
                  ? "danger"
                  : "primary"
              }
            >
              Starts at
            </IonLabel>
            <IonDatetime
              displayFormat='D MMM YYYY HH:mm'
              min={formatISO(Date.now()).slice(0, -6)}
              max={formatISO(addYears(Date.now(), 1)).slice(0, -6)}
              value={state.startAt}
              placeholder={format(Date.now(), "d MMM yyyy HH:mm")}
              onIonChange={(e) => setState({ startAt: e.detail.value! })}
            ></IonDatetime>
          </IonItem>
          <IonItem lines='none'>
            <IonLabel
              color={
                !(
                  isAfter(parseISO(state.endAt), Date.now()) &&
                  isAfter(parseISO(state.endAt), parseISO(state.startAt))
                )
                  ? "danger"
                  : "primary"
              }
            >
              Ends at
            </IonLabel>
            <IonDatetime
              displayFormat='D MMM YYYY HH:mm'
              min={formatISO(Date.now()).slice(0, -6)}
              max={formatISO(addYears(Date.now(), 10)).slice(0, -6)}
              value={state.endAt}
              placeholder={format(Date.now(), "d MMM yyyy HH:mm")}
              onIonChange={(e) => setState({ endAt: e.detail.value! })}
            ></IonDatetime>
          </IonItem>
        </IonList>
        <IonRow
          className='ion-padding-horizontal ion-justify-content-end ion-text-end'
          style={{ marginTop: "0.5rem" }}
        >
          <IonText style={{ fontSize: "14px", color: "#adadad" }}>
            {`Duration: ${formatDuration(
              intervalToDuration({
                start: parseISO(state.startAt),
                end: parseISO(state.endAt),
              })
            )}`}
          </IonText>
        </IonRow>
        {hasError && isAfter(parseISO(state.startAt), parseISO(state.endAt)) && (
          <IonRow
            className='ion-padding-horizontal'
            style={{ marginTop: "0.5rem", marginBottom: "1rem" }}
          >
            <IonText color='danger'>
              The end time cannot be before start time
            </IonText>
          </IonRow>
        )}
        {hasError && isAfter(Date.now(), parseISO(state.startAt)) && (
          <IonRow
            className='ion-padding-horizontal'
            style={{ marginTop: "0.5rem", marginBottom: "1rem" }}
          >
            <IonText color='danger'>
              The start time cannot be in the past
            </IonText>
          </IonRow>
        )}
      </IonGrid>
    </>
  );
};

export default EditChallenge;
