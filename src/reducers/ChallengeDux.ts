import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChallengeData } from "../interfaces/models/Challenges";
import { VoteList } from "../interfaces/models/Votes";

export interface ChallengeDux {
  ongoing: ChallengeData[];
  pendingResponse: ChallengeData[];
  pendingStart: ChallengeData[];
  votingPeriod: ChallengeData[];
  history: ChallengeData[];
  votes: VoteList;
  featured: ChallengeData[];
  others: ChallengeData[];
  lastRetrieved: Date | number | null;
}

const initialState: ChallengeDux = {
  ongoing: [],
  pendingResponse: [],
  pendingStart: [],
  votingPeriod: [],
  history: [],
  votes: [],
  featured: [],
  others: [],
  lastRetrieved: null,
};

const challenges = createSlice({
  name: "challenges",
  initialState,
  reducers: {
    setOngoing: (
      state,
      action: PayloadAction<{
        challenges: ChallengeData[];
        lastRetrieved: Date | number;
      }>
    ): void => {
      state.ongoing = action.payload.challenges;
      state.lastRetrieved = action.payload.lastRetrieved;
    },
    setPendingResponse: (
      state,
      action: PayloadAction<{
        challenges: ChallengeData[];
        lastRetrieved: Date | number;
      }>
    ): void => {
      state.pendingResponse = action.payload.challenges;
      state.lastRetrieved = action.payload.lastRetrieved;
    },
    setPendingStart: (
      state,
      action: PayloadAction<{
        challenges: ChallengeData[];
        lastRetrieved: Date | number;
      }>
    ): void => {
      state.pendingStart = action.payload.challenges;
      state.lastRetrieved = action.payload.lastRetrieved;
    },
    setVotingPeriod: (
      state,
      action: PayloadAction<{
        challenges: ChallengeData[];
        lastRetrieved: Date | number;
      }>
    ): void => {
      state.votingPeriod = action.payload.challenges;
      state.lastRetrieved = action.payload.lastRetrieved;
    },
    setHistory: (
      state,
      action: PayloadAction<{
        challenges: ChallengeData[];
        lastRetrieved: Date | number;
      }>
    ): void => {
      state.history = action.payload.challenges;
      state.lastRetrieved = action.payload.lastRetrieved;
    },
    setVotes: (
      state,
      action: PayloadAction<{
        votes: VoteList;
        lastRetrieved: Date | number;
      }>
    ): void => {
      state.votes = action.payload.votes;
      state.lastRetrieved = action.payload.lastRetrieved;
    },
    setFeatured: (
      state,
      action: PayloadAction<{
        challenges: ChallengeData[];
        lastRetrieved: Date | number;
      }>
    ): void => {
      state.featured = action.payload.challenges;
      state.lastRetrieved = action.payload.lastRetrieved;
    },
    setOthers: (
      state,
      action: PayloadAction<{
        challenges: ChallengeData[];
        lastRetrieved: Date | number;
      }>
    ): void => {
      state.others = action.payload.challenges;
      state.lastRetrieved = action.payload.lastRetrieved;
    },
    clearChallenges: (state): void => {
      state.ongoing = [];
      state.pendingResponse = [];
      state.pendingStart = [];
      state.votingPeriod = [];
      state.history = [];
      state.featured = [];
      state.votes = [];
      state.others = [];
      state.lastRetrieved = null;
    },
  },
});

export const {
  setOngoing,
  setPendingResponse,
  setPendingStart,
  setVotingPeriod,
  setHistory,
  setVotes,
  setFeatured,
  setOthers,
  clearChallenges,
} = challenges.actions;

export default challenges.reducer;
