import React, { useEffect, useState } from "react";
import "./App.css";
import { io } from "socket.io-client";
import {
  CheckBoxOutlineBlankOutlined,
  DraftsOutlined,
  HomeOutlined,
  InboxOutlined,
  MailOutline,
  ReceiptOutlined,
  Wifi,
  WifiOff,
} from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { red } from "@mui/material/colors";
import {
  Button,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
const socket = io("https://mcttemisocket.azurewebsites.net");
//const socket = io("http://172.30.251.250:8453");


const data = [
  {
    name: "Home",
    icon: <HomeOutlined />,
  },
  { name: "Inbox", icon: <InboxOutlined /> },
  { name: "Outbox", icon: <CheckBoxOutlineBlankOutlined /> },
  { name: "Sent mail", icon: <MailOutline /> },
  { name: "Draft", icon: <DraftsOutlined /> },
  { name: "Trash", icon: <ReceiptOutlined /> },
];


function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [open, setOpen] = useState(false);
  const [locationData, setLocationData] = useState<any>();

  useEffect(() => {
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    socket.on("temittsMessage", data =>{
      console.log(data)
    });
    socket.on("temiMovementMessage", data =>{
      console.log(data)
    });
  });

  

  useEffect(() => {
    let url =
      "https://temitourapi.azurewebsites.net/api/locations/getlocations";
    let options: RequestInit = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    };
    fetch(url, options)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data);
        setLocationData(data.body);
      });
  }, []);

  const sendMessage = () => {
    socket.emit("message", "home base");
  };
  const sendBank = () => {
    socket.emit("message", "bank");
  };
  const sendLocation = (location: string) => {
    socket.emit("message", location);
  };
  const getList = () => (
    <div style={{ width: 250 }} onClick={() => setOpen(false)}>
      {data.map((item, index) => (
        <ListItem button key={index}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.name} />
        </ListItem>
      ))}
    </div>
  );

  return (
    <div>
      <Drawer open={open} anchor={"left"} onClose={() => setOpen(false)}>
        {getList()}
      </Drawer>
      <img src="/mctLogo.jpg" alt="mctLgo" className="lowerleft"></img>
      <Button onClick={() => setOpen(true)}>
        <MenuIcon className="topleft" sx={{ fontSize: 40, color: "black" }} />
      </Button>
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
