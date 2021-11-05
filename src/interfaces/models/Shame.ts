export type EffectType = "TOMATO" | "EGG" | "POOP" | "SOO" | "BEN";

export interface ThrowItemPost {
  effect: EffectType;
  challengeId: string;
  targetUserId: string;
  count: number;
}
