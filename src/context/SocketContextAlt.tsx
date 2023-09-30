import { createContext, useContext } from "react";
import { io } from "socket.io-client";
import { defaultConfig } from "../hooks/useAppConfig";

const configTour = process.env.REACT_APP_TOUR ?? "Howest MCT";
const SocketContext = createContext(null);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
    const conf = defaultConfig;
    let socketUrl = conf.socketUri;
    const socket = io(socketUrl); // replace with your socket server url
    console.log("Connecting to the socket: ", socketUrl);
    console.log("Starting tour: ", configTour);

  
    return (
      <SocketContext.Provider value={socket}>
        {children}
      </SocketContext.Provider>
    );
  }
  