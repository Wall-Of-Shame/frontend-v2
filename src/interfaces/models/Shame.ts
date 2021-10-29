export type EffectType = "TOMATO" | "EGG" | "POOP";

export interface ThrowItemPost {
  effect: EffectType;
  challengeId: string;
  targetUserId: string;
  count: number;
}
