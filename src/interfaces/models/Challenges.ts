import { PowerUpPostType } from "./Store";
import { AvatarAnimal, AvatarColor, UserList } from "./Users";

export interface ChallengeId {
  challengeId: string;
}

export type ChallengeType = "LAST_TO_COMPLETE" | "NOT_COMPLETED";

export type ChallengeInviteType = "PRIVATE" | "PUBLIC";

// Input schema for the `POST /challenges` route.
export interface ChallengePost {
  title: string;
  description?: string;
  startAt: string;
  endAt: string;
  type: ChallengeType;
  inviteType: ChallengeInviteType;
  participants: string[];
}

// Return schema for the `GET /challenges/:challengeId` route.
export interface ChallengeData {
  challengeId: string;
  title: string;
  imageURL?: string;
  isFeatured?: boolean;
  description?: string;
  startAt: string | null;
  endAt: string;
  participantCount: number;
  type: ChallengeType;
  inviteType: ChallengeInviteType;
  hasReleasedResult: boolean;
  owner: DeepPartialUserMini;
  participants: {
    accepted: {
      completed: UserMini[];
      notCompleted: UserMini[];
      protected: UserMini[];
    };
    pending: UserMini[];
  };
}

// Return schema for the `GET /challenges` route
export interface ChallengeList {
  ongoing: ChallengeData[];
  pendingResponse: ChallengeData[];
  pendingStart: ChallengeData[];
  votingPeriod: ChallengeData[];
  history: ChallengeData[];
  featured: ChallengeData[];
  others: ChallengeData[];
}

// Input schema for the `PATCH /challenges/:challengeId` route
export interface ChallengePatch {
  title?: string;
  description?: string;
  startAt?: string;
  endAt?: string;
  type?: ChallengeType;
  participants?: string[];
}

export interface PublicChallengeList {
  featured: ChallengeData[];
  others: ChallengeData[];
}

export interface PowerupDto {
  type: PowerUpPostType;
  targetUserId?: string | undefined;
}

// Internal type. They do not match to any route specifically, but rather used to construct them.
export type UserMini = Pick<
  UserList,
  "userId" | "username" | "name" | "avatar"
> & {
  completedAt?: string;
  evidenceLink?: string;
  hasBeenVetoed: boolean;
};
// Deep partial of UserMini
// This is to support the corner case of user being able to create a challenge without having a username/name/avatar
// They should be prompted to add one asap
type DeepPartialUserMini = Pick<UserMini, "userId"> &
  Partial<Pick<UserMini, "username" | "name">> & {
    [P in keyof Pick<UserList, "avatar">]: Partial<Pick<UserList, "avatar">[P]>;
  };

export interface Shame {
  id: `${string}:${string}`; // userId + challengeId
  name: string;
  title: string;
  type: "shame" | "cheat";
  time: string;
  avatar: {
    animal: AvatarAnimal;
    color: AvatarColor;
    background: string;
  };
  effect: {
    tomato: number;
    egg: number;
    poop: number;
    ben: number;
    soo: number;
  };
}

export interface Message {
  messageId: string;
  name: string;
  userId: string;
  content: string;
  time: string;
}
