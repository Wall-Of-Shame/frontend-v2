import React from "react";

import { AuthProvider } from "./AuthContext";
import { CacheProvider } from "./CacheContext";
import { ChallengeProvider } from "./ChallengeContext";
import { SocketProvider } from "./SocketContext";
import { UserProvider } from "./UserContext";

// eslint-disable-next-line react/prop-types
const AppProviders: React.FC = ({ children }) => {
  return (
    <CacheProvider>
      <SocketProvider>
        <AuthProvider>
          <UserProvider>
            <ChallengeProvider>{children}</ChallengeProvider>
          </UserProvider>
        </AuthProvider>
      </SocketProvider>
    </CacheProvider>
  );
};

export default AppProviders;
