import { useEffect, useState } from "react";
import "./css/App.css";
import { iLocationData } from "../interfaces/interfaces";
import { io } from "socket.io-client";
import { Menu, Wifi, WifiOff } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import {
  Box,
  Button,
  Divider,
  Drawer,
  ListItemButton,
  ListItemText,
} from "@mui/material";
//const socket = io("https://mcttemisocket.azurewebsites.net");
const socket = io("http://172.30.248.58:8453");

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [open, setOpen] = useState(false);
  const [locationData, setLocationData] = useState<Array<iLocationData>>([]);

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
        setLocationData(data);
      });

    const textAtLocation = (location: any) => {
      console.log(location);
      console.log(locationData);
      locationData.forEach((data) => {
        if (location === data.name) {
          console.log(data);
          var TextToSay = data.textList;
          socket.emit("tts", TextToSay[0]);
        }
      });
    };
    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    socket.on("temittsMessage", (data) => {
      console.log(data);
    });

    socket.on("temiMovementMessage", (data) => {
      console.log(data);
      console.log(data.movementMessage);
      if (data.movementMessage["status"] === "complete") {
        console.log("yee");
        textAtLocation(data.movementMessage["location"]);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    <Box
      role="presentation"
      style={{ width: 250 }}
      onClick={() => setOpen(false)}
    >
      {locationData!.map((item, index) => (
        <>
          <ListItemButton
            key={index}
            onClick={(event) => {
              console.log(item.name);
              sendLocation(item.name);
            }}
          >
            {/* <ListItemIcon>{item.icon}</ListItemIcon> */}
            <ListItemText
              primary={item.name.charAt(0).toUpperCase() + item.name.slice(1)}
            />
          </ListItemButton>
          <Divider />
        </>
      ))}
    </Box>
  );

  return (
    <div>
      <Drawer open={open} anchor={"left"} onClose={() => setOpen(false)}>
        {getList()}
      </Drawer>
      <img src="/mctLogo.jpg" alt="mctLgo" className="lowerleft"></img>
      <Button onClick={() => setOpen(true)}>
        <Menu className="topleft" sx={{ fontSize: 40, color: "black" }} />
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
