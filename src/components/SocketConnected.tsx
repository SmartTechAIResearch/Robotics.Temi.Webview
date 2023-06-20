import Wifi from "@mui/icons-material/Wifi";
import WifiOff from "@mui/icons-material/WifiOff";
import { red } from "@mui/material/colors";
import { useEffect, useState } from "react";

import { useSocket } from '../context/SocketContext';

export default function SocketConnected() {
  const socket = useSocket();
  const [isConnected, setIsConnected] = useState(socket.connected);


  useEffect(() => {
    //connction with socket true
    socket.on("connect", () => {
      setIsConnected(true);
    });
    //connection with socket false
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    socket.onAny((event, data) => {
        console.debug(event, data);
    })
}, [socket]);

    return isConnected ? (
        <Wifi className="topright" sx={{ fontSize: 40 }} />
    ) : (
        <WifiOff className="topright" sx={{ fontSize: 40, color: red[500] }} />
    );
}