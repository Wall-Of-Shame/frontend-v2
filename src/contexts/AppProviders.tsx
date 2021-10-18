import React from "react";

import { AuthProvider } from "./AuthContext";
import { ChallengeProvider } from "./ChallengeContext";
import { SocketProvider } from "./SocketContext";
import { UserProvider } from "./UserContext";

// eslint-disable-next-line react/prop-types
const AppProviders: React.FC = ({ children }) => {
  return (
    <SocketProvider>
      <AuthProvider>
        <UserProvider>
          <ChallengeProvider>{children}</ChallengeProvider>
        </UserProvider>
      </AuthProvider>
    </SocketProvider>
  );
};

export default AppProviders;
