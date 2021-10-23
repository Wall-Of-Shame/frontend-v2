import { PowerUpPostType, PowerUpType } from "../interfaces/models/Store";

export const adaptPowerUpType = (type: PowerUpType): PowerUpPostType => {
  switch (type) {
    case "Protec":
      return "PROTEC";
    case "U2":
      return "GRIEF";
  }
};
