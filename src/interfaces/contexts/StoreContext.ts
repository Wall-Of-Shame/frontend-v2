import { PurchasePost } from "../models/Store";

export default interface UserContextInterface {
  purchaseItem(order: PurchasePost): Promise<void>;
}
