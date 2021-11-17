import React from "react";

import WallContextInterface from "../interfaces/contexts/WallContext";
import { UserList } from "../interfaces/models/Users";
import WallService from "../services/WallService";

const WallContext = React.createContext<WallContextInterface | undefined>(
  undefined
);

// Allows user data to be accessible from everywhere
const WallProvider: React.FunctionComponent = (props) => {
  const getFriendsRankings = async (): Promise<UserList[]> => {
    try {
      const data = await WallService.getFriendsRankings();
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  const getGlobalRankings = async (): Promise<UserList[]> => {
    try {
      const data = await WallService.getGlobalRankings();
      return data;
    } catch (error) {
      return Promise.reject(error);
    }
  };

  return (
    <WallContext.Provider
      value={{
        getFriendsRankings,
        getGlobalRankings,
      }}
      {...props}
    />
  );
};

const useWall = (): WallContextInterface => {
  const context = React.useContext(WallContext);
  if (context === undefined) {
    throw new Error("useWall must be used within a WallProvider");
  }
  return context;
};

export { WallProvider, useWall };
