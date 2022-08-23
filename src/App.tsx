import { useEffect, useState } from "react";
import "./css/App.css";
import { iLocationData } from "../interfaces/interfaces";
import { io } from "socket.io-client";
import { Menu, Wifi, WifiOff } from "@mui/icons-material";
import { red } from "@mui/material/colors";
import RefreshIcon from "@mui/icons-material/Refresh";
import { Step, StepLabel, Stepper, styled } from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import Stack from "@mui/material/Stack";
import Check from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";
import {
  Box,
  Button,
  Divider,
  Drawer,
  ListItemButton,
  ListItemText,
} from "@mui/material";
//const socket = io("http://172.30.248.58:8453");

function App() {
  const socket = io("https://mcttemisocket.azurewebsites.net");

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [open, setOpen] = useState(false);
  const [locationData, setLocationData] = useState<Array<iLocationData>>([]);
  const [currentLocation, setCurrentLocation] = useState<iLocationData>();
  const [temiTtsData, setTemiTtsData] = useState<any>();
  const [temiMovementData, setTemiMovementData] = useState<any>();

  useEffect(() => {
    // const textAtLocation = (location: any) => {
    //   console.log(location);
    //   console.log(locationData);
    //   locationData.forEach((data) => {
    //     if (location === data.name) {
    //       setCurrentLocation(data);
    //       console.log(data);
    //       var TextToSay = data.textList;
    //       console.log(TextToSay);
    //       socket.emit("tts", TextToSay[0]);

    //       // TextToSay.forEach((text) => {
    //       //   socket.emit("tts", text);
    //       // });
    //     }
    //   });
    // };
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

    socket.on("connect", () => {
      setIsConnected(true);
    });
    socket.on("disconnect", () => {
      setIsConnected(false);
    });

    socket.on("temiTtsMessage", (data) => {
      setTemiTtsData(data);
      // if (currentLocation !== undefined) {
      //   console.log(data);
      //   console.log(currentLocation.textList.indexOf(data.temiTtsMessage.text));
      //   if (
      //     currentLocation.textList[
      //       currentLocation.textList.indexOf(data.temiTtsMessage.text) + 1
      //     ] !== undefined
      //   ) {
      //     console.log(
      //       currentLocation!.textList[
      //         currentLocation!.textList.indexOf(data.temiTtsMessage.text) + 1
      //       ]
      //     );
      //     socket.emit(
      //       "tts",
      //       currentLocation!.textList[
      //         currentLocation!.textList.indexOf(data.temiTtsMessage.text) + 1
      //       ]
      //     );
      //   }
      // }
    });
    socket.on("temiMovementMessage", (data) => {
      console.log(data);
      console.log(data.movementMessage);
      if (data.movementMessage["status"] === "complete") {
        console.log("yee");
        // textAtLocation(data.movementMessage["location"]);
        setTemiMovementData(data.movementMessage["location"]);
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const textAtLocation = () => {
      console.log(temiMovementData);
      console.log(locationData);
      locationData.forEach((data) => {
        if (temiMovementData === data.name) {
          setCurrentLocation(data);
          console.log(data);
          var TextToSay = data.textList;
          console.log(TextToSay);
          socket.emit("tts", TextToSay[0]);

          // TextToSay.forEach((text) => {
          //   socket.emit("tts", text);
          // });
        }
      });
    };
    textAtLocation();
  }, [locationData, temiMovementData]);

  useEffect(() => {
    console.log("I am here!!");
    const readNextTemiLine = () => {
      if (currentLocation !== undefined) {
        console.log(temiTtsData);
        console.log(
          currentLocation.textList.indexOf(temiTtsData.temiTtsMessage.text)
        );
        if (
          currentLocation.textList[
            currentLocation.textList.indexOf(temiTtsData.temiTtsMessage.text) +
              1
          ] !== undefined
        ) {
          console.log(
            currentLocation!.textList[
              currentLocation!.textList.indexOf(
                temiTtsData.temiTtsMessage.text
              ) + 1
            ]
          );
          socket.emit(
            "tts",
            currentLocation!.textList[
              currentLocation!.textList.indexOf(
                temiTtsData.temiTtsMessage.text
              ) + 1
            ]
          );
        } else {
          setCurrentLocation(undefined);
        }
      }
    };
    readNextTemiLine();
  }, [temiTtsData]);

  const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
    ({ theme, ownerState }) => ({
      color:
        theme.palette.mode === "dark" ? theme.palette.grey[700] : "#eaeaf0",
      display: "flex",
      height: 22,
      alignItems: "center",
      ...(ownerState.active && {
        color: "#784af4",
      }),
      "& .QontoStepIcon-completedIcon": {
        color: "#784af4",
        zIndex: 1,
        fontSize: 18,
      },
      "& .QontoStepIcon-circle": {
        width: 8,
        height: 8,
        borderRadius: "50%",
        backgroundColor: "currentColor",
      },
    })
  );

  function QontoStepIcon(props: StepIconProps) {
    const { active, completed, className } = props;

    return (
      <QontoStepIconRoot ownerState={{ active }} className={className}>
        {completed ? (
          <Check className="QontoStepIcon-completedIcon" />
        ) : (
          <div className="QontoStepIcon-circle" />
        )}
      </QontoStepIconRoot>
    );
  }

  const QontoConnector = styled(StepConnector)(({ theme }) => {
    return {
      [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: "calc(-50% + 16px)",
        right: "calc(50% + 16px)",
      },
      [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          borderColor: "#784af4",
        },
      },
      [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          borderColor: "#784af4",
        },
      },
      [`& .${stepConnectorClasses.line}`]: {
        borderColor:
          theme.palette.mode === "dark" ? theme.palette.grey[800] : "#eaeaf0",
        borderTopWidth: 3,
        borderRadius: 1,
      },
    };
  });

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
  const steps = ["Reception", "Project-One", "Core", "the end"];
  return (
    <div>
      <Drawer open={open} anchor={"left"} onClose={() => setOpen(false)}>
        {getList()}
      </Drawer>
      <img src="/mctLogo.jpg" alt="mctLgo" className="lowerleft"></img>

      <div className="App">
        <Button id="HamburgerMenuButton" onClick={() => setOpen(true)}>
          <Menu className="topleft" sx={{ fontSize: 40, color: "black" }} />
        </Button>
        <Stack sx={{ width: "70%" }} spacing={4}>
          <Stepper
            id="stepper"
            alternativeLabel
            activeStep={1}
            connector={<QontoConnector />}
          >
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel StepIconComponent={QontoStepIcon}>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>
        <div>
          <button id="refreshPage" onClick={() => window.location.reload()}>
            <RefreshIcon sx={{ fontSize: 40 }}></RefreshIcon>
          </button>
          {isConnected ? (
            <Wifi className="topright" sx={{ fontSize: 40 }} />
          ) : (
            <WifiOff
              className="topright"
              sx={{ fontSize: 40, color: red[500] }}
            />
          )}
        </div>
      </div>
      <div>
        <div id="currentLocation">
          <h1>Project-One</h1>
        </div>
        <button id="cancelButton">
          <CancelIcon sx={{ fontSize: 100, color: red[500] }}></CancelIcon>
        </button>
        <button id="GoToNextLocation">Go to the core</button>
      </div>
      <div id="ttsText">
        <p>
          We arrived at the core, here you can look into the Choice-trajects
        </p>
      </div>
    </div>
  );
}

export default App;
