import React, { useEffect, useState } from "react";
import { iLocationData } from "../interfaces/interfaces";

import "./css/App.css";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ForumIcon from "@mui/icons-material/Forum";
import WcIcon from "@mui/icons-material/Wc";
import ElevatorIcon from "@mui/icons-material/Elevator";
import CancelIcon from "@mui/icons-material/Cancel";

import PowerIcon from "@mui/icons-material/Power";
import {
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  SvgIcon,
  TextField,
} from "@mui/material";
import { io, Socket } from "socket.io-client";

export function Admin() {
  const [locationData, setLocationData] = useState<Array<iLocationData>>([]);
  const [ttsInput, setTtsInput] = useState<string>("");
  const sendLocation = (location: string) => {
    socket!.emit("message", location);
  };
  const [socket, setSocket] = useState<Socket>();
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
        setLocationData(data);
      });
    setSocket(io("https://mcttemisocket.azurewebsites.net"));
  }, []);
  const sendTTS = () => {
    socket!.emit("tts", ttsInput);
  };

  const updateTts = (event: any) => {
    setTtsInput(event.target.value);
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ width: "100%", bgcolor: "background.paper" }}>
        <nav aria-label="main mailbox folders">
          <List>
            {locationData!.map((item, index) => (
              <>
                <ListItemButton
                  key={index}
                  onClick={(event) => {
                    if (item.icon === "CancelIcon") {
                    }
                    sendLocation(item.name);
                  }}
                >
                  {
                    <SvgIcon
                      className="svgClass"
                      component={
                        item.icon === "AccountBalanceIcon"
                          ? AccountBalanceIcon
                          : item.icon === "ForumIcon"
                          ? ForumIcon
                          : item.icon === "WcIcon"
                          ? WcIcon
                          : item.icon === "ElevatorIcon"
                          ? ElevatorIcon
                          : item.icon === "PowerIcon"
                          ? PowerIcon
                          : CancelIcon
                      }
                    ></SvgIcon>
                  }
                  <ListItemText
                    primaryTypographyProps={{ fontSize: "20px" }}
                    primary={
                      item.alias.charAt(0).toUpperCase() + item.alias.slice(1)
                    }
                  />
                </ListItemButton>
                <Divider />
              </>
            ))}
          </List>
          <div className="buttonGroup">
            <TextField
              id="ttsText"
              label="TTS Message"
              variant="outlined"
              onChange={updateTts}
            />
            <Button variant="contained" onClick={sendTTS}>
              Send TTS
            </Button>
          </div>
        </nav>
      </Box>
    </Container>
  );
}
