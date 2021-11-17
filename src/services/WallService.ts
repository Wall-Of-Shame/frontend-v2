import { UserList } from "../interfaces/models/Users";
import APIService from "../services/APIService";

const getFriendsRankings = async (): Promise<UserList[]> => {
  try {
    const response = await APIService.get(`users/?operation=wallFriends`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getGlobalRankings = async (): Promise<UserList[]> => {
  try {
    const response = await APIService.get(`users/?operation=wallGlobal`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  getFriendsRankings,
  getGlobalRankings,
};
