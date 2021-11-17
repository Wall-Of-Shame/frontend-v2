import React, { useState } from "react";

import UserContextInterface from "../interfaces/contexts/UserContext";
import { Avatar, Settings, UserList } from "../interfaces/models/Users";
import UserService from "../services/UserService";

import { useAuth } from "./AuthContext";

const UserContext = React.createContext<UserContextInterface | undefined>(
  undefined
);

// Allows user data to be accessible from everywhere
const UserProvider: React.FunctionComponent = (props) => {
  const { data } = useAuth();

  const [shouldRefreshUser, setShouldRefreshUser] = useState(false);

  const notifyShouldRefreshUser = (shouldRefresh: boolean) => {
    setShouldRefreshUser(shouldRefresh);
  };

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
        shouldRefreshUser,
        notifyShouldRefreshUser,
        updateProfile,
        searchUser,
        getUserProfile,
        addFriend,
        getFriendRequests,
        getFriends,
        acceptRequest,
        rejectRequest,
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
