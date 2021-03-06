import { waitingAnimalMap, bg } from "../../assets/pendingChallenge";
import { UserMini } from "../../interfaces/models/Challenges";
import "./PendingChallengeImg.scss";

interface PendingChallengeImgProps {
  waitingToStart: UserMini[];
}

const PendingChallengeImg: React.FunctionComponent<PendingChallengeImgProps> = (
  props: PendingChallengeImgProps
) => {
  const { waitingToStart } = props;
  const waitingToStartSliced = waitingToStart.slice(0, 5);

  return (
    <div className='bg-pending-div'>
      <div className='bg-pending'>
        <img src={bg} alt='background'></img>
      </div>
      {waitingToStartSliced.map((u, index) => {
        return (
          <div
            style={{
              width: "15%",
              transform: `translate(${-120 + 85 * index}%, 65%)`,
              zIndex: index,
              position: "absolute",
              maxWidth: "80px",
            }}
            key={index}
          >
            <img
              src={waitingAnimalMap[u.avatar.animal][u.avatar.color]}
              alt={u.avatar.animal.toString()}
            ></img>
          </div>
        );
      })}
    </div>
  );
};

export default PendingChallengeImg;
