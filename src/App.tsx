import { useEffect, useState } from "react";
import "./css/App.css";
import { iLocationData } from "../interfaces/interfaces";
import { io } from "socket.io-client";
import { Menu, Wifi, WifiOff } from "@mui/icons-material";
import { blue, lightBlue, red } from "@mui/material/colors";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
  FormControlLabel,
  Step,
  StepLabel,
  Stepper,
  SvgIcon,
  Switch,
} from "@mui/material";
import StepConnector, {
  stepConnectorClasses,
} from "@mui/material/StepConnector";
import { StepIconProps } from "@mui/material/StepIcon";
import Stack from "@mui/material/Stack";
import Check from "@mui/icons-material/Check";
import CancelIcon from "@mui/icons-material/Cancel";

import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ForumIcon from "@mui/icons-material/Forum";
import WcIcon from "@mui/icons-material/Wc";
import ElevatorIcon from "@mui/icons-material/Elevator";
import PowerIcon from "@mui/icons-material/Power";
import { alpha, styled } from "@mui/material/styles";
import {
  Box,
  Button,
  Divider,
  Drawer,
  ListItemButton,
  ListItemText,
} from "@mui/material";

function App() {
  const steps = ["Reception", "1MCT", "The Core", "International"];
  const socket = io("https://mcttemisocket.azurewebsites.net");
  const [stepperCounter, setStepperCounter] = useState(0);
  const [ShutdownCounter, setShutdownCounter] = useState(0);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [open, setOpen] = useState(false);
  const [locationData, setLocationData] = useState<Array<iLocationData>>([]);
  const [stepperData, setStepperData] = useState<Array<any>>([".", ";"]);
  const [currentLocation, setCurrentLocation] = useState<iLocationData>();
  const [temiTtsData, setTemiTtsData] = useState<any>();
  const [temiMovementData, setTemiMovementData] = useState<any>();
  const [currentSentence, setCurrentSentence] = useState<string>("");
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [checked, setChecked] = useState(true);
  const [isAtCore, setIsAtCore] = useState<boolean>(false);
  const [coreLocations, setCoreLocation] = useState<Array<string>>([
    "ai",
    "iotinf",
    "smartxr",
    "nextweb",
  ]);
  const [timer, setTimer] = useState<any>();
  const [showInternational, setShowInternational] = useState<boolean>(false);

  useEffect(() => {
    //API call to get location information
    let stepperURL =
      "https://temitourapi.azurewebsites.net/api/stepper";
    let optionsURL: RequestInit = {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json;charset=UTF-8",
      },
    };
    fetch(stepperURL, optionsURL)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        console.log(data)
        setStepperData(data.stepsList);
      });

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
    //connction with socket true
    socket.on("connect", () => {
      setIsConnected(true);
    });
    //connection with socket false
    socket.on("disconnect", () => {
      setIsConnected(false);
    });
    //listen to temi response socket for TTS
    socket.on("temiTtsMessage", (data) => {
      setTemiTtsData(data);
    });
    //listen to temi response socket for movement
    socket.on("temiMovementMessage", (data) => {
      if (data.movementMessage["status"] === "complete") {
        setTemiMovementData(data.movementMessage["location"]);
      }
    });

  }, []);

  useEffect(() => {
    //search correct text and emit to temi TTS
    const textAtLocation = () => {
      locationData.forEach((data) => {
        if (temiMovementData === data.name) {
          setCurrentLocation(data);
          var TextToSay = data.textList;
          socket.emit("tts", TextToSay[0]);
          setCurrentSentence(TextToSay[0]);
        }
      });
    };
    textAtLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationData, temiMovementData]);

  useEffect(() => {
    //search next line of text & emit to temi
    const readNextTemiLine = () => {
      if (currentLocation !== undefined) {
        if (
          currentLocation.textList[
            currentLocation.textList.indexOf(temiTtsData.temiTtsMessage.text) +
              1
          ] !== undefined
        ) {
          socket.emit(
            "tts",
            currentLocation!.textList[
              currentLocation!.textList.indexOf(
                temiTtsData.temiTtsMessage.text
              ) + 1
            ]
          );
          setCurrentSentence(
            currentLocation!.textList[
              currentLocation!.textList.indexOf(
                temiTtsData.temiTtsMessage.text
              ) + 1
            ]
          );
        } else {
          setCurrentLocation(undefined);
          setCurrentSentence("");
        }
      }
    };
    readNextTemiLine();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temiTtsData]);

  useEffect(() => {
    //shutdown 
    if (ShutdownCounter === 15) {
      socket.emit("shutdown");
    }
  }, [ShutdownCounter, socket]);

  useEffect(() => {
    // check if location is core ai iotinf smartxr nextweb
    // to be able to go to each location and visit all choice modules
    if (currentLocation !== undefined) {
      if (
        currentLocation.name === "core" ||
        currentLocation.name === "ai" ||
        currentLocation.name === "iotinf" ||
        currentLocation.name === "smartxr" ||
        currentLocation.name === "nextweb"
      ) {
        setIsAtCore(true);
      } else {
        setIsAtCore(false);
      }
    }
  }, [currentLocation]);

  useEffect(() => {
    //reboot after 1 min of showing QR code in the end 
    if (isLastPage) {
      setTimeout(() => {
        console.log("here");
        socket.emit("reboot", "yes");
      }, 60000);
    }
  }, [isLastPage, socket]);

  //styling for stepper
  const StepperConnector = styled(StepConnector)(({ theme }) => {
    
    return {
      [`&.${stepConnectorClasses.alternativeLabel}`]: {
        top: 10,
        left: "calc(-50% + 16px)",
        right: "calc(50% + 16px)",
      },
      [`&.${stepConnectorClasses.active}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          borderColor: "#44c8f5",
        },
      },
      [`&.${stepConnectorClasses.completed}`]: {
        [`& .${stepConnectorClasses.line}`]: {
          borderColor: "#44c8f5",
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

  //stepper styling
  const QontoStepIconRoot = styled("div")<{ ownerState: { active?: boolean } }>(
    ({ theme, ownerState }) => ({
      color:
        theme.palette.mode === "dark" ? theme.palette.grey[700] : "#44c8f5",
      display: "flex",
      height: 22,
      alignItems: "center",

      ...(ownerState.active && {
        color: "#44c8f5",
        fontSize: "xx-large",
        fontWeight: 700,
      }),
      "& .QontoStepIcon-completedIcon": {
        color: "#44c8f5",
        zIndex: 1,
        fontSize: 32,
      },
      "& .QontoStepIcon-circle": {
        width: 16,
        height: 16,
        borderRadius: "50%",
        backgroundColor: "currentColor",
      },
    })
  );

  //stepper icons
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

  //send temi to specific location
  const sendLocation = (location: string) => {
    if (timer !== null) {
      clearTimeout(timer);
    }
    let timeState = setTimeout(() => {
      socket.emit("reboot", "yes");
    }, 60000);
    setTimer(timeState);
    if (stepperData.includes(location)) {
      setStepperCounter(stepperData.indexOf(location));
    } else if (stepperData.includes(convertName(location))) {
      setStepperCounter(stepperData.indexOf(convertName(location)));
    }
    socket.emit("message", location);
  };
  //fill drawer with locations from API
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
              primary={item.alias.charAt(0).toUpperCase() + item.alias.slice(1)}
            />
          </ListItemButton>
          <Divider />
        </>
      ))}
    </Box>
  );

  //convert alias to location name
  const convertAlias = (alias: any) => {
    for (let location of locationData) {
      if (location.alias === alias) return location.name;
    }
  };
  //convert location name to alias
  const convertName = (name: any) => {
    for (let location of locationData) {
      if (location.name === name) return location.alias;
    }
  };
  //switch tts to mute or unmute
  const switchChange = (e) => {
    console.log("switch");
    // console.log(e.target.checked);
    setChecked(e.target.checked);
    //emit mute
    if (checked === false) {
      socket.emit("mute", "false");
    } else {
      socket.emit("mute", "true");
    }
  };
  //styling for switch
  const GreenSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: blue[300],
      "&:hover": {
        backgroundColor: alpha(
          lightBlue[300],
          theme.palette.action.hoverOpacity
        ),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: blue[300],
    },
  }));
  //app html 
  return (
    <>
      <div className="">
        <Drawer open={open} anchor={"left"} onClose={() => setOpen(false)}>
          {getList()}
        </Drawer>
        <img src="/mctLogo.jpg" alt="mctLgo" className="lowerleft"></img>

        <div className="App">
          <Button id="HamburgerMenuButton" onClick={() => setOpen(true)}>
            <Menu className="topleft" sx={{ fontSize: 40, color: "black" }} />
          </Button>

          <div>
            <FormControlLabel
              id="switchLabel"
              value="end"
              control={
                <GreenSwitch
                  checked={checked}
                  onChange={switchChange}
                  defaultChecked
                />
              }
              label="Toggle TTS"
              labelPlacement="top"
            />
            <button id="refreshPage" onClick={() => window.location.reload()}>
              <RefreshIcon sx={{ fontSize: 40 }}></RefreshIcon>
            </button>
            {isConnected ? (
              <Wifi
                className="topright"
                sx={{ fontSize: 40 }}
                onClick={() => setShutdownCounter(ShutdownCounter + 1)}
              />
            ) : (
              <WifiOff
                className="topright"
                sx={{ fontSize: 40, color: red[500] }}
              />
            )}
          </div>
        </div>
        <div>
          <Stack sx={{ width: "100%" }} spacing={4}>
            <Stepper
              id="stepper"
              alternativeLabel
              activeStep={stepperCounter}
              connector={<StepperConnector />}
            >
              {stepperData.map((label) => (
                <Step key={label}>
                  <StepLabel StepIconComponent={QontoStepIcon}>
                    {label}
                  </StepLabel>
                </Step>
              ))}
            </Stepper>
          </Stack>
        </div>
        <div className="test">
          {isLastPage ? (
            <>
              <div id="currentLocation">
                <h1>Feedback</h1>
              </div>
              <img src="/qr.jpg" id="qr" alt="mctLgo"></img>
            </>
          ) : (
            <>
              {isAtCore ? (
                <>
                  {showInternational ? (
                    <>
                      <button className="hidden" id="cancelButton">
                        <CancelIcon
                          sx={{ fontSize: 100, color: red[500] }}
                        ></CancelIcon>
                      </button>
                      <button
                        id="GoToNextLocation"
                        onClick={() => {
                          setStepperCounter(stepperCounter + 1);
                          if (stepperCounter < stepperData.length - 1) {
                            sendLocation(
                              convertAlias(stepperData[stepperCounter + 1])
                            );
                          } else {
                            setIsLastPage(true);
                          }
                        }}
                      >
                        Go to{" "}
                        {stepperCounter >= stepperData.length - 1
                          ? "finish"
                          : stepperData[stepperCounter + 1]}
                      </button>
                    </>
                  ) : (
                    <div className="multipleOptions">
                      {coreLocations.map((label) => (
                        <button
                          id="GoToNextLocation"
                          onClick={() => {
                            console.log(coreLocations);
                            if (coreLocations.length === 1) {
                              sendLocation(label);
                              setShowInternational(true);
                            } else {
                              setCoreLocation(
                                coreLocations.filter((e) => e !== label)
                              );
                              setStepperCounter(stepperCounter);

                              sendLocation(label);
                            }
                          }}
                        >
                          Go to {" " + convertName(label)}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <div id="title">
                  <button className="hidden" id="cancelButton">
                    <CancelIcon
                      sx={{ fontSize: 100, color: red[500] }}
                    ></CancelIcon>
                  </button>
                  <button
                    id="GoToNextLocation"
                    onClick={() => {
                      setStepperCounter(stepperCounter + 1);
                      if (stepperCounter < stepperData.length - 1) {
                        sendLocation(convertAlias(stepperData[stepperCounter + 1]));
                      } else {
                        setIsLastPage(true);
                        socket.emit("message", "finish");
                      }
                    }}
                  >
                    Go to{" "}
                    {stepperCounter >= stepperData.length - 1
                      ? "finish"
                      : stepperData[stepperCounter + 1]}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
        <div id="ttsDiv">
          <p className="">{currentSentence}</p>
        </div>
      </div>
    </>
  );
}

export default App;
