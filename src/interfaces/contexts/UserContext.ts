import { PurchasePost } from "../models/Store";
import { Avatar, Settings, UserData, UserList } from "../models/Users";

export default interface UserContextInterface {
  user: UserData | null;
  updateProfile(
    name: string,
    username: string,
    settings: Settings,
    avatar: Avatar
  ): Promise<void>;
  searchUser(searchText: string): Promise<UserList[]>;
  getUserProfile(userId: string): Promise<UserList>;
  getFriendsRankings(): Promise<UserList[]>;
  getGlobalRankings(): Promise<UserList[]>;
  purchaseItem(order: PurchasePost): Promise<void>;
  sendFeedback(
    email: string,
    description: string,
    screenshot: string
  ): Promise<void>;
}
