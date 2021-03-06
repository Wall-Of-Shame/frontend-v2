import {
  ChallengeData,
  ChallengeList,
  ChallengePost,
  PowerupDto,
} from "../interfaces/models/Challenges";
import { PowerUpPostType } from "../interfaces/models/Store";
import { VoteList } from "../interfaces/models/Votes";
import APIService from "../services/APIService";

const getChallenges = async (): Promise<ChallengeList> => {
  try {
    const response = await APIService.get("challenges");
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getChallenge = async (id: string): Promise<ChallengeData | null> => {
  try {
    const response = await APIService.get(`challenges/${id}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const createChallenge = async (data: ChallengePost): Promise<string> => {
  try {
    const response = await APIService.post("challenges", data);
    return response.data.challengeId;
  } catch (error) {
    return Promise.reject(error);
  }
};

const updateChallenge = async (
  challengeId: string,
  data: ChallengePost
): Promise<void> => {
  try {
    await APIService.patch(`challenges/${challengeId}`, data);
  } catch (error) {
    return Promise.reject(error);
  }
};

const acceptChallenge = async (challengeId: string): Promise<void> => {
  try {
    await APIService.post(`challenges/${challengeId}/accept`);
  } catch (error) {
    return Promise.reject(error);
  }
};

const rejectChallenge = async (challengeId: string): Promise<void> => {
  try {
    await APIService.post(`challenges/${challengeId}/reject`);
  } catch (error) {
    return Promise.reject(error);
  }
};

const applyPowerUp = async (
  type: PowerUpPostType,
  targetUserId: string | undefined,
  challengeId: string
): Promise<void> => {
  try {
    const data: PowerupDto = {
      type,
      targetUserId,
    };
    await APIService.post(`challenges/${challengeId}/powerups`, data);
  } catch (error) {
    return Promise.reject(error);
  }
};

const completeChallenge = async (challengeId: string): Promise<void> => {
  try {
    await APIService.post(`challenges/${challengeId}/complete`);
  } catch (error) {
    return Promise.reject(error);
  }
};

const releaseResults = async (
  challengeId: string,
  vetoedParticipants: string[]
): Promise<void> => {
  try {
    await APIService.post(`challenges/${challengeId}/vetoResults`, {
      vetoedParticipants,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const getVotes = async (challengeId: string): Promise<VoteList> => {
  try {
    const response = await APIService.get(`challenges/${challengeId}/votes`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const voteForParticipant = async (
  challengeId: string,
  victimId: string
): Promise<void> => {
  try {
    await APIService.post(`challenges/${challengeId}/votes`, {
      victimId,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

const uploadProof = async (
  challengeId: string,
  data: string
): Promise<string | null> => {
  try {
    const response = await APIService.post(`challenges/${challengeId}/proofs`, {
      data: data,
    });
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getExplore = async (): Promise<ChallengeList> => {
  try {
    const response = await APIService.get(`challenges?operation=explore`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const searchChallenge = async (
  searchText: string
): Promise<ChallengeData[]> => {
  try {
    const response = await APIService.get(
      `challenges?operation=search&query=${searchText}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getChallenges,
  getChallenge,
  createChallenge,
  updateChallenge,
  acceptChallenge,
  rejectChallenge,
  applyPowerUp,
  completeChallenge,
  releaseResults,
  getVotes,
  voteForParticipant,
  uploadProof,
  getExplore,
  searchChallenge,
};
