import React from "react";
import io from "socket.io-client";
import { Socket } from "socket.io-client";
import SocketContextInterface from "../interfaces/contexts/SocketContext";
import TokenUtils from "../utils/TokenUtils";

const SocketContext = React.createContext<SocketContextInterface | undefined>(
  undefined
);

// Allows user data to be accessible from everywhere
const SocketProvider: React.FunctionComponent = (props) => {
  let socket: Socket | undefined;

  const connect = async (): Promise<Socket> => {
    console.log(socket);
    if (!socket) {
      const newSocket = io("ws://localhost:3001/", {
        withCredentials: true,
        transports: ["websocket", "polling"],
        reconnection: true,
        auth: {
          token: `${TokenUtils.getToken()!}`,
        },
      });
      socket = newSocket;
      return socket;
    }
    return socket;
  };

  const disconnect = async (): Promise<void> => {
    socket?.close();
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        connect,
        disconnect,
      }}
      {...props}
    />
  );
};

const useSocket = (): SocketContextInterface => {
  const context = React.useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};

export { SocketProvider, useSocket };
