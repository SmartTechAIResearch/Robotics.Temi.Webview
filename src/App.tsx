import React, { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";

const socket = io("http://172.30.248.58:8453");

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

  return (
    <div className="App">
      <p>Connected: {"" + isConnected}</p>
      <button onClick={sendMessage}>Home Base</button>
      <button onClick={sendBank} className="buttonRight">
        Bank
      </button>
    </div>
  );
}

export default App;
