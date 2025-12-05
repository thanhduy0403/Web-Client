import { createContext, useContext, useEffect } from "react";
import socket from "../socket";

const SocketContext = createContext();
export const SocketProvider = ({ children }) => {
  useEffect(() => {
    socket.emit("join_client");
    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
