import { UserData } from "../../../interfaces/models/Users";
import "./ChallengePageImg.scss";
import hasActiveBg from "../../../assets/challenge/has-active.gif";
import noActiveBg from "../../../assets/challenge/no-active.png";
import { waitingAnimalMap, bg } from "../../../assets/pendingChallenge";
import { activeAnimalMap } from "../../../assets/activeChallenge";

interface ChallengePageImgProps {
  user: UserData | null;
  active: Boolean;
}

const ChallengePageImg: React.FunctionComponent<ChallengePageImgProps> = (
  props: ChallengePageImgProps
) => {
  const { user, active } = props;

  if (!user?.avatar.animal || !user?.avatar.background || !user?.avatar.color) {
    return <div style={{ margin: "1rem" }}></div>;
  }

  if (user) {
    if (active) {
      return (
        <div className='bg-challenge-div'>
          <div className='bg-challenge'>
            <img src={hasActiveBg} alt='background'></img>
          </div>
          <div
            style={{
              transform: `translate(80%, 30%)`,
              zIndex: 1,
              position: "absolute",
              width: "25vw",
              maxWidth: "150px",
            }}
          >
            <img
              src={activeAnimalMap[user.avatar.animal][user.avatar.color]}
              alt={user.avatar.animal.toString()}
            ></img>
          </div>
        </div>
      );
    } else {
      return (
        <div className='bg-challenge-div'>
          <div className='bg-challenge'>
            <img src={noActiveBg} alt='background'></img>
          </div>
          <div
            style={{
              transform: `translate(55%, -5%)`,
              zIndex: 1,
              position: "absolute",
              width: "25vw",
              maxWidth: "150px",
            }}
          >
            <img
              src={waitingAnimalMap[user.avatar.animal][user.avatar.color]}
              alt={user.avatar.animal.toString()}
            ></img>
          </div>
        </div>
      );
    }
  } else {
    return <></>;
  }
};

export default ChallengePageImg;
