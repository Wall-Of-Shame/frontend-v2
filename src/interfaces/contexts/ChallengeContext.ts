import {
  ChallengeData,
  ChallengeList,
  ChallengePost,
} from "../models/Challenges";
import { PowerUpType } from "../models/Store";
import { VoteList } from "../models/Votes";

export default interface ChallengeContextInterface {
  getAllChallenges(): Promise<ChallengeList>;
  getChallenge(id: string): Promise<ChallengeData | null>;
  shouldRefreshChallenges: boolean;
  notifyShouldRefreshChallenges(shouldRefresh: boolean): void;
  createChallenge(data: ChallengePost): Promise<string>;
  updateChallenge(id: string, data: ChallengePost): Promise<void>;
  acceptChallenge(id: string): Promise<void>;
  rejectChallenge(id: string): Promise<void>;
  applyPowerUp(
    type: PowerUpType,
    targetUserId: string | undefined,
    challengeId: string
  ): Promise<void>;
  completeChallenge(id: string): Promise<void>;
  releaseResults(id: string, vetoedParticipants: string[]): Promise<void>;
  getVotes(challengeId: string): Promise<VoteList>;
  voteForParticipant(challengeId: string, victimId: string): Promise<void>;
  uploadProof(id: string, data: any): Promise<string | null>;
  getExplore(): Promise<ChallengeList>;
  searchChallenge(searchText: string): Promise<ChallengeData[]>;
}
