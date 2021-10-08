import { Socket } from "socket.io-client";

export default interface SocketContextInterface {
  connect: () => Promise<Socket>;
  disconnect: () => Promise<void>;
  socket: Socket | undefined;
}
