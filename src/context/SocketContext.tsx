import { createContext, useContext } from "react";
import { io } from "socket.io-client";
import { iAppConfig } from "../hooks/useAppConfig";

const SocketContext = createContext(null);

export function useSocket() {
  return useContext(SocketContext);
}

const defaultConfig: iAppConfig = {
  socketUri: 'https://mcttemisocket.azurewebsites.net',
  apiUri: 'https://temi.azurewebsites.net',
  tour: "Howest MCT",
  empty: false
}


export function SocketProvider({ children }) {
    let savedConfig: iAppConfig;
    if (localStorage != null ) {
      const localConfig = localStorage.getItem('appConfig');
      if (localConfig) {
        console.log("Found some existing config: " + localConfig);
        savedConfig = JSON.parse(localConfig);
      } else {
        savedConfig = defaultConfig;
      }
    }
    let socketUrl = "https://mcttemisocket.azurewebsites.net";
    const socket = io(socketUrl); // replace with your socket server url
    console.log("Connecting to the socket: ", socketUrl);
    console.log("Starting tour: ", "Howest MCT");

  
    return (
      <SocketContext.Provider value={socket}>
        {children}
      </SocketContext.Provider>
    );
  }
  