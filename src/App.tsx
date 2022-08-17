import React, { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import { Wifi, WifiOff } from "@mui/icons-material";
import { pink, red } from "@mui/material/colors";
const socket = io("https://mcttemisocket.azurewebsites.net");

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
  });

  const sendMessage = () => {
    socket.emit("message", "home base");
  };
  const sendBank = () => {
    socket.emit("message", "bank");
  };
  const sendLocation = (location: string) => {
    socket.emit("message", location);
  };

  return (
    <div>
      <img src="/mctLogo.jpg" alt="mctLgo" className="lowerleft"></img>
      {isConnected ? (
        <Wifi className="topright" sx={{ fontSize: 40 }} />
      ) : (
        <WifiOff className="topright" sx={{ fontSize: 40, color: red[500] }} />
      )}
      <div className="App">
        <p>Connected: {"" + isConnected}</p>
        <button onClick={sendMessage}>Home Base</button>
        <button onClick={sendBank} className="buttonRight">
          Bank
        </button>
        <button
          onClick={() => window.location.reload()}
          className="buttonRight"
        >
          reload{" "}
        </button>
      </div>
    </div>
  );
}

export default App;
