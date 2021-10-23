import React from "react";

import UserContextInterface from "../interfaces/contexts/UserContext";
import { PurchasePost } from "../interfaces/models/Store";
import { Avatar, Settings, UserList } from "../interfaces/models/Users";
import UserService from "../services/UserService";

import { useAuth } from "./AuthContext";

const UserContext = React.createContext<UserContextInterface | undefined>(
  undefined
);

// Allows user data to be accessible from everywhere
const UserProvider: React.FunctionComponent = (props) => {
  const { data } = useAuth();

  const updateProfile = async (
    name: string,
    username: string,
    settings: Settings,
    avatar: Avatar
  ): Promise<void> => {
    try {
      await UserService.updateProfile(name, username, settings, avatar);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const searchUser = async (searchText: string): Promise<UserList[]> => {
    try {
      const response = await UserService.searchUser(searchText);
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getUserProfile = async (userId: string): Promise<UserList> => {
    try {
      const response = await UserService.getUserProfile(userId);
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const addFriend = async (userId: string): Promise<void> => {
    try {
      await UserService.addFriend(userId);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getFriendRequests = async (): Promise<UserList[]> => {
    try {
      const response = await UserService.getFriendRequests();
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getFriends = async (): Promise<UserList[]> => {
    try {
      const response = await UserService.getFriends();
      return response;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const acceptRequest = async (userId: string): Promise<void> => {
    try {
      await UserService.acceptRequest(userId);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const rejectRequest = async (userId: string): Promise<void> => {
    try {
      await UserService.rejectRequest(userId);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getFriendsRankings = async (): Promise<UserList[]> => {
    try {
      const data = await UserService.getFriendsRankings();
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getGlobalRankings = async (): Promise<UserList[]> => {
    try {
      const data = await UserService.getGlobalRankings();
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const purchaseItem = async (order: PurchasePost): Promise<void> => {
    try {
      await UserService.purchaseItem(order);
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
      await UserService.sendFeedback(email, description, screenshot);
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return (
    <UserContext.Provider
      value={{
        user: data,
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
        purchaseItem,
        sendFeedback,
      }}
      {...props}
    />
  );
};

const useUser = (): UserContextInterface => {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUser };
