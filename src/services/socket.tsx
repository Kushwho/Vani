import { io, Socket } from "socket.io-client";

// Define the socket port type as a constant
const socketPort: number = 5001;

// Create the socket instance and type it as Socket
export const socket: Socket = io("localhost:5001", {
  secure: true,
  port: socketPort,
});

