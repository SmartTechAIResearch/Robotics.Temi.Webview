import { createContext, useContext } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext(null);

export function useSocket() {
  return useContext(SocketContext);
}

export function SocketProvider({ children }) {
    // const savedConfig = localStorage.getItem('appConfig');
    // let socketUrl: string;
    // if (savedConfig) {
    //     let conf = JSON.parse(savedConfig);
    //     socketUrl = conf.socketUri;
    // }
    const conf = {
      socketUri: 'https://mcttemisocket.azurewebsites.net',
      apiUri: 'https://temi.azurewebsites.net',
      tour: 'Meets The Industry',
      empty: false
  };
  let socketUrl = conf.socketUri;
    const socket = io(socketUrl); // replace with your socket server url
    console.debug("Connecting to the socket: ", socketUrl);

  
    return (
      <SocketContext.Provider value={socket}>
        {children}
      </SocketContext.Provider>
    );
  }
  