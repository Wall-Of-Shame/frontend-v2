import { IonGrid, IonRow, IonCol, IonText } from "@ionic/react";
import React from "react";

interface CountdownProps {
  countdown: Duration | null;
}

const Countdown: React.FC<CountdownProps> = (props: CountdownProps) => {
  const { countdown } = props;

  if (
    (countdown?.years === undefined || countdown?.years === 0) &&
    (countdown?.months === undefined || countdown?.months === 0)
  ) {
    return (
      <IonGrid style={{ marginBottom: "0.5rem" }}>
        <IonRow className='ion-padding-horizontal'>
          <IonCol size='3'>
            <IonRow className='ion-justify-content-center'>
              <IonText style={{ fontWeight: "800", fontSize: "2rem" }}>
                {countdown?.days ?? "-"}
              </IonText>
            </IonRow>
          </IonCol>
          <IonCol size='3'>
            <IonRow className='ion-justify-content-center'>
              <IonText style={{ fontWeight: "800", fontSize: "2rem" }}>
                {countdown?.hours ?? "-"}
              </IonText>
            </IonRow>
          </IonCol>
          <IonCol size='3'>
            <IonRow className='ion-justify-content-center'>
              <IonText style={{ fontWeight: "800", fontSize: "2rem" }}>
                {countdown?.minutes ?? "-"}
              </IonText>
            </IonRow>
          </IonCol>
          <IonCol size='3'>
            <IonRow className='ion-justify-content-center'>
              <IonText style={{ fontWeight: "800", fontSize: "2rem" }}>
                {countdown?.seconds ?? "-"}
              </IonText>
            </IonRow>
          </IonCol>
        </IonRow>
        <IonRow className='ion-padding-horizontal ion-padding-bottom'>
          <IonCol size='3'>
            <IonRow className='ion-justify-content-center'>Days</IonRow>
          </IonCol>
          <IonCol size='3'>
            <IonRow className='ion-justify-content-center'>Hours</IonRow>
          </IonCol>
          <IonCol size='3'>
            <IonRow className='ion-justify-content-center'>Minutes</IonRow>
          </IonCol>
          <IonCol size='3'>
            <IonRow className='ion-justify-content-center'>Seconds</IonRow>
          </IonCol>
        </IonRow>
      </IonGrid>
    );
  }

  return (
    <IonGrid style={{ marginBottom: "0.5rem" }}>
      <IonRow className='ion-padding-horizontal'>
        <IonCol size='4'>
          <IonRow className='ion-justify-content-center'>
            <IonText style={{ fontWeight: "800", fontSize: "2rem" }}>
              {countdown?.years ?? "-"}
            </IonText>
          </IonRow>
        </IonCol>
        <IonCol size='4'>
          <IonRow className='ion-justify-content-center'>
            <IonText style={{ fontWeight: "800", fontSize: "2rem" }}>
              {countdown?.months ?? "-"}
            </IonText>
          </IonRow>
        </IonCol>
        <IonCol size='4'>
          <IonRow className='ion-justify-content-center'>
            <IonText style={{ fontWeight: "800", fontSize: "2rem" }}>
              {countdown?.days ?? "-"}
            </IonText>
          </IonRow>
        </IonCol>
      </IonRow>
      <IonRow className='ion-padding-horizontal ion-padding-bottom'>
        <IonCol size='4'>
          <IonRow className='ion-justify-content-center'>Years</IonRow>
        </IonCol>
        <IonCol size='4'>
          <IonRow className='ion-justify-content-center'>Months</IonRow>
        </IonCol>
        <IonCol size='4'>
          <IonRow className='ion-justify-content-center'>Days</IonRow>
        </IonCol>
      </IonRow>
      <IonRow className='ion-padding-horizontal'>
        <IonCol size='4'>
          <IonRow className='ion-justify-content-center'>
            <IonText style={{ fontWeight: "800", fontSize: "2rem" }}>
              {countdown?.hours ?? "-"}
            </IonText>
          </IonRow>
        </IonCol>
        <IonCol size='4'>
          <IonRow className='ion-justify-content-center'>
            <IonText style={{ fontWeight: "800", fontSize: "2rem" }}>
              {countdown?.minutes ?? "-"}
            </IonText>
          </IonRow>
        </IonCol>
        <IonCol size='4'>
          <IonRow className='ion-justify-content-center'>
            <IonText style={{ fontWeight: "800", fontSize: "2rem" }}>
              {countdown?.seconds ?? "-"}
            </IonText>
          </IonRow>
        </IonCol>
      </IonRow>
      <IonRow className='ion-padding-horizontal ion-padding-bottom'>
        <IonCol size='4'>
          <IonRow className='ion-justify-content-center'>Hours</IonRow>
        </IonCol>
        <IonCol size='4'>
          <IonRow className='ion-justify-content-center'>Minutes</IonRow>
        </IonCol>
        <IonCol size='4'>
          <IonRow className='ion-justify-content-center'>Seconds</IonRow>
        </IonCol>
      </IonRow>
    </IonGrid>
  );
};

export default Countdown;
