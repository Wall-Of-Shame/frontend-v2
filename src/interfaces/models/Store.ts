export type PowerUpType = "Protec" | "U2";

export interface PowerUp {
  type: PowerUpType;
  price: number;
  description: string;
}
