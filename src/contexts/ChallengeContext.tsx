import React, { useState } from "react";
import { useDispatch } from "react-redux";
import ChallengeContextInterface from "../interfaces/contexts/ChallengeContext";
import {
  ChallengeData,
  ChallengeList,
  ChallengePost,
} from "../interfaces/models/Challenges";
import { PowerUpType } from "../interfaces/models/Store";
import { VoteList } from "../interfaces/models/Votes";
import {
  setHistory,
  setOngoing,
  setPendingResponse,
  setPendingStart,
  setVotes,
  setFeatured,
  setOthers,
  setVotingPeriod,
} from "../reducers/ChallengeDux";
import ChallengeService from "../services/ChallengeService";
import { adaptPowerUpType } from "../utils/StoreUtils";

const ChallengeContext = React.createContext<
  ChallengeContextInterface | undefined
>(undefined);

const ChallengeProvider: React.FC = (props) => {
  const dispatch = useDispatch();
  const [shouldRefreshChallenges, setShouldRefreshChallenges] = useState(false);

  const getAllChallenges = async (): Promise<ChallengeList> => {
    try {
      const response = await ChallengeService.getChallenges();
      dispatch(
        setOngoing({
          challenges: response.ongoing,
          lastRetrieved: Date.now(),
        })
      );
      dispatch(
        setPendingResponse({
          challenges: response.pendingResponse,
          lastRetrieved: Date.now(),
        })
      );
      dispatch(
        setPendingStart({
          challenges: response.pendingStart,
          lastRetrieved: Date.now(),
        })
      );
      dispatch(
        setVotingPeriod({
          challenges: response.votingPeriod,
          lastRetrieved: Date.now(),
        })
      );
      dispatch(
        setHistory({
          challenges: response.history,
          lastRetrieved: Date.now(),
        })
      );
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getChallenge = async (id: string): Promise<ChallengeData | null> => {
    try {
      const response = await ChallengeService.getChallenge(id);
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const notifyShouldRefreshChallenges = (shouldRefresh: boolean) => {
    setShouldRefreshChallenges(shouldRefresh);
  };

  const createChallenge = async (data: ChallengePost): Promise<void> => {
    try {
      await ChallengeService.createChallenge(data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const updateChallenge = async (
    id: string,
    data: ChallengePost
  ): Promise<void> => {
    try {
      await ChallengeService.updateChallenge(id, data);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const acceptChallenge = async (id: string): Promise<void> => {
    try {
      await ChallengeService.acceptChallenge(id);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const rejectChallenge = async (id: string): Promise<void> => {
    try {
      await ChallengeService.rejectChallenge(id);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const applyPowerUp = async (
    type: PowerUpType,
    targetUserId: string | undefined,
    challengeId: string
  ): Promise<void> => {
    const adaptedType = adaptPowerUpType(type);
    try {
      await ChallengeService.applyPowerUp(
        adaptedType,
        targetUserId,
        challengeId
      );
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const completeChallenge = async (id: string): Promise<void> => {
    try {
      await ChallengeService.completeChallenge(id);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const releaseResults = async (
    id: string,
    vetoedParticipants: string[]
  ): Promise<void> => {
    try {
      await ChallengeService.releaseResults(id, vetoedParticipants);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const uploadProof = async (id: string, data: any): Promise<string | null> => {
    try {
      const url = await ChallengeService.uploadProof(id, data);
      return url;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getVotes = async (challengeId: string): Promise<VoteList> => {
    try {
      const data = await ChallengeService.getVotes(challengeId);
      dispatch(
        setVotes({
          votes: data,
          lastRetrieved: Date.now(),
        })
      );
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const voteForParticipant = async (
    challengeId: string,
    victimId: string
  ): Promise<void> => {
    try {
      await ChallengeService.voteForParticipant(challengeId, victimId);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getExplore = async (): Promise<ChallengeList> => {
    try {
      const response = await ChallengeService.getExplore();
      dispatch(
        setFeatured({
          challenges: response.featured,
          lastRetrieved: Date.now(),
        })
      );
      dispatch(
        setOthers({
          challenges: response.others,
          lastRetrieved: Date.now(),
        })
      );
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const searchChallenge = async (
    searchText: string
  ): Promise<ChallengeData[]> => {
    try {
      const response = await ChallengeService.searchChallenge(searchText);
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return (
    <ChallengeContext.Provider
      value={{
        getAllChallenges,
        getChallenge,
        shouldRefreshChallenges,
        notifyShouldRefreshChallenges,
        createChallenge,
        updateChallenge,
        acceptChallenge,
        rejectChallenge,
        applyPowerUp,
        completeChallenge,
        getVotes,
        voteForParticipant,
        releaseResults,
        uploadProof,
        getExplore,
        searchChallenge,
      }}
      {...props}
    />
  );
};

const useChallenge = (): ChallengeContextInterface => {
  const context = React.useContext(ChallengeContext);
  if (context === undefined) {
    throw new Error(`useChallenge must be used within a ChallengeProvider`);
  }
  return context;
};

export { ChallengeProvider, useChallenge };
