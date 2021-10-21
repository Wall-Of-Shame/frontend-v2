export type PowerUpType = "Protec" | "U2";

export interface PowerUp {
  type: PowerUpType;
  price: number;
  description: string;
}

export type PowerUpPostType = "PROTEC" | "GRIEF";

export interface PurchasePost {
  powerup: PowerUpPostType;
  count: number;
}

// For internal reference only
export const CHALLENGE_COMPLETION_AWARD = 100;

export const POWER_UP_PRICE = {
  GRIEF: 500,
  PROTEC: 750,
};
