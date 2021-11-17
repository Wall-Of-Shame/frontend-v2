import React from "react";

import { AuthProvider } from "./AuthContext";
import { ChallengeProvider } from "./ChallengeContext";
import { SocketProvider } from "./SocketContext";
import { UserProvider } from "./UserContext";
import { CacheProvider } from "./CacheContext";
import { StoreProvider } from "./StoreContext";
import { WallProvider } from "./WallContext";

// eslint-disable-next-line react/prop-types
const AppProviders: React.FC = ({ children }) => {
  return (
    <CacheProvider>
      <SocketProvider>
        <AuthProvider>
          <UserProvider>
            <ChallengeProvider>
              <WallProvider>
                <StoreProvider>{children}</StoreProvider>
              </WallProvider>
            </ChallengeProvider>
          </UserProvider>
        </AuthProvider>
      </SocketProvider>
    </CacheProvider>
  );
};

export default AppProviders;
