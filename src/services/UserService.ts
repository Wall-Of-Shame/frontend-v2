import { Avatar, Settings, UserList } from "../interfaces/models/Users";
import APIService from "../services/APIService";
import AuthService from "./AuthService";

const updateProfile = async (
  name: string,
  username: string,
  settings: Settings,
  avatar: Avatar
): Promise<void> => {
  const data = {
    name,
    username,
    settings,
    avatar,
  };
  try {
    await APIService.patch("self", data);
    await AuthService.getUser();
  } catch (error) {
    return Promise.reject(error);
  }
};

const searchUser = async (searchText: string): Promise<UserList[]> => {
  try {
    const response = await APIService.get(
      `users/?operation=search&query=${searchText}`
    );
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getUserProfile = async (userId: string): Promise<UserList> => {
  try {
    const response = await APIService.get(`users/${userId}`);
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const addFriend = async (userId: string): Promise<void> => {
  try {
    await APIService.post("requests", { userId: userId });
  } catch (error) {
    return Promise.reject(error);
  }
};

const getFriends = async (): Promise<UserList[]> => {
  try {
    const response = await APIService.get("friends");
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const getFriendRequests = async (): Promise<UserList[]> => {
  try {
    const response = await APIService.get("requests");
    return response.data;
  } catch (error) {
    return Promise.reject(error);
  }
};

const acceptRequest = async (userId: string): Promise<void> => {
  try {
    await APIService.post("requests/accept", { userId: userId });
  } catch (error) {
    return Promise.reject(error);
  }
};

const rejectRequest = async (userId: string): Promise<void> => {
  try {
    await APIService.post("requests/reject", { userId: userId });
  } catch (error) {
    return Promise.reject(error);
  }
};

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

const sendFeedback = async (
  email: string,
  description: string,
  screenshot: string | undefined
): Promise<void> => {
  try {
    await APIService.post("feedback", {
      email,
      description,
      screenshot,
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

// eslint-disable-next-line import/no-anonymous-default-export
export default {
  updateProfile,
  searchUser,
  getUserProfile,
  addFriend,
  getFriendRequests,
  getFriends,
  acceptRequest,
  rejectRequest,
  getFriendsRankings,
  getGlobalRankings,
  sendFeedback,
};
