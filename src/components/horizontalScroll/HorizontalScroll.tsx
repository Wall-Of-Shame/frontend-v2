import { IonAvatar, IonCol, IonRow, IonText } from "@ionic/react";
import { UserList } from "../../interfaces/models/Users";
import { trimDisplayName } from "../../utils/ProfileUtils";
import AvatarImg from "../avatar";
import "./HorizontalScroll.scss";

interface HorizontalScrollProps {
  users: UserList[];
}

const Stories = (props: HorizontalScrollProps) => {
  const { users } = props;

  return (
    <div>
      <ul className='horizontal-list'>
        {users.map((u) => {
          return (
            <li className='horizontal-item' key={`${u.userId}-horizontal`}>
              <IonCol>
                <IonRow className='ion-justify-content-center'>
                  <IonAvatar>
                    <AvatarImg avatar={u.avatar} />
                  </IonAvatar>
                </IonRow>
                <IonRow className='ion-justify-content-center'>
                  <IonText
                    style={{
                      fontSize: "0.75rem",
                      marginTop: "0.5rem",
                    }}
                  >
                    {trimDisplayName(u.name, 7)}
                  </IonText>
                </IonRow>
              </IonCol>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default Stories;
