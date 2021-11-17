import React from "react";

import { AuthProvider } from "./AuthContext";
import { ChallengeProvider } from "./ChallengeContext";
import { SocketProvider } from "./SocketContext";
import { UserProvider } from "./UserContext";
import { CacheProvider } from "./CacheContext";
import { StoreProvider } from "./StoreContext";

// eslint-disable-next-line react/prop-types
const AppProviders: React.FC = ({ children }) => {
  return (
    <CacheProvider>
      <SocketProvider>
        <AuthProvider>
          <UserProvider>
            <ChallengeProvider>
              <StoreProvider>{children}</StoreProvider>
            </ChallengeProvider>
          </UserProvider>
        </AuthProvider>
      </SocketProvider>
    </CacheProvider>
  );
};

export default AppProviders;
