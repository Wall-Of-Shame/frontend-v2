import { UserList } from "../models/Users";

export default interface WallContextInterface {
  getFriendsRankings(): Promise<UserList[]>;
  getGlobalRankings(): Promise<UserList[]>;
}
