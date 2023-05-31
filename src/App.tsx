/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

// #region imports
import { Player } from '@lottiefiles/react-lottie-player';
import { useEffect, useState } from "react";
import "./css/App.css";
import { iLocationData } from "../interfaces/interfaces";
import { io } from "socket.io-client";
import { Menu, Wifi, WifiOff } from "@mui/icons-material";
import { blue, lightBlue, red } from "@mui/material/colors";
import RefreshIcon from "@mui/icons-material/Refresh";
import { useLocation } from "react-router-dom";
import {
  FormControlLabel,
  Modal,
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
const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  // width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

//#endregion

function App() {
  // const steps = ["Reception", "1MCT", "The Core", "International"];
  const query = new URLSearchParams(useLocation().search);
  const socketVersion = query.get("socket") ?? "";
  // If socketVersion is specified, use a different Socket URL
  let socketUrl: string;
  if (socketVersion !== "") {
    socketUrl = "https://mcttemitour" + socketVersion + ".azurewebsites.net";
  } else {
    socketUrl = "https://mcttemisocket.azurewebsites.net";
  }
  const socket = io(socketUrl);
  const api = "https://temiapi.azurewebsites.net";
  // Fetch the tour from the queryString property "?tour="
  const tour = query.get("tour") ?? "Howest MCT";
  console.log("Tour:", tour);
  console.log("Socket:", socketUrl);
  const [stepperCounter, setStepperCounter] = useState(0);
  const [ShutdownCounter, setShutdownCounter] = useState(0);
  const [sentenceCounter, setSentenceCounter] = useState(-1);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [open, setOpen] = useState(false);
  const [checked, setChecked] = useState(false);
  const [openTutorial, setOpenTutorial] = useState<boolean>(false);
  const [isLastPage, setIsLastPage] = useState<boolean>(false);
  const [startSpeaking, setStartSpeaking] = useState<boolean>(false);
  const [nextMessage, setNextMessage] = useState<boolean>(false);

  const [locationData, setLocationData] = useState<Array<iLocationData>>([]);
  const [stepperData, setStepperData] = useState<Array<any>>(["START", "FINISH"]);
  const [currentLocation, setCurrentLocation] = useState<iLocationData>();
  const [temiMovementData, setTemiMovementData] = useState<string>("");
  const [currentSentence, setCurrentSentence] = useState<string>("");
  const [subtitleHistory, setSubtitleHistory] = useState<Array<string>>([]);
  
  const [isAtCore, setIsAtCore] = useState<boolean>(false);
  const [coreLocations, setCoreLocation] = useState<Array<string>>([
    "aiengineer",
    "infra",
    "xrdev",
    "nextweb",
    "creativetech"
  ]);
  const [timer, setTimer] = useState<any>();
  const [showInternational, setShowInternational] = useState<boolean>(false);
  
  const handleOpen = () => setOpenTutorial(true);
  const handleClose = () => setOpenTutorial(false);

  const test = () => {
    console.log(sentenceCounter, temiMovementData, currentLocation);
  
    // Start the counter from 0 and up
    if (sentenceCounter >= 0) {
      // If we have any locations, we continue
      if (locationData.length > 0) {
        if (currentLocation) {
          // Get the sentence Temi should speak
          let sentence = currentLocation.textList[sentenceCounter]
          if (sentence) {
            // Send the sentence to Temi, we then await the response to show the subtitles
            socket.emit("tts", sentence)
          }
        }
      }
    }
  }

  useEffect(() => {
    let loc = locationData.filter(location => location.alias === temiMovementData);
    setCurrentLocation(loc[loc.length - 1]);

    if (temiMovementData !== "") {
      setSubtitleHistory([]); // Clear the history of subtitles
      setStartSpeaking(true);
      setSentenceCounter(0);
    }
    // Start speaking by setting the SentenceCounter to 0
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temiMovementData]);
  
  useEffect(() => {
    // console.log("Speaking texts from location", temiMovementData)
    test();
    // if (locationData) {
    //   let data = locationData.filter(location => location.alias === temiMovementData);
    //   if (data.length > 0) {
    //     let locationData = data[data.length - 1];
    //     if (locationData) {
    //       let sentence = locationData.textList[sentenceCounter]
    //       if (sentence) {
    //         socket.emit("tts", sentence)
    //       }
    //     }
    //   }
    // }
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sentenceCounter, startSpeaking]);

  useEffect(() => {
    if (startSpeaking) console.log("We will start speaking now!");
  }, [startSpeaking])

  useEffect(() => {
    if (nextMessage) {
      console.log("Showing next message!")
      if (currentLocation) {
        if (sentenceCounter < currentLocation.textList.length - 1) {
          console.log("Current Sentence: ", currentSentence);
          console.log("Current Sentence Counter: ", sentenceCounter);
          setSentenceCounter(sentenceCounter + 1);
        } else {
          setCurrentSentence("");
          setSentenceCounter(-1);
          setStartSpeaking(false);
          setCurrentLocation(undefined);
        }
      }
      setNextMessage(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextMessage])

  // Fetch the default information and get the socket connection on!
  useEffect(() => {
    //#region Fetch the default information
    //API call to get location information
    let stepperURL = `${api}/api/stepper/${tour}`;
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
        setStepperData(data[0].stepsList);
      });

    let url = `${api}/api/locations/getByRegion/${tour}`;
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
        console.log("SetLocationData: ", data);
        setLocationData(data);
      });

      //#endregion

    //connction with socket true
    socket.on("connect", () => {
      setIsConnected(true);
    });
    //connection with socket false
    socket.on("disconnect", () => {
      setIsConnected(false);
    });


    //listen to temi response socket for TTS
    socket.on("ttsMessage", (data) => {
      // TODO: Make sure the subtitles move asynchronously from the TTS
      setCurrentSentence(data.ttsMessage)
      subtitleHistory.push(data.ttsMessage);
    });

    socket.on("temiTtsMessage", (data) => {
      // Go to the next message!
      setNextMessage(true);
    });

    // Temi sends a message here when his movement is finished.
    // Use it to reset the sentenceCounter and start speaking the first sentence of the arrived location.
    socket.on("temiMovementMessage", (data) => {
      // First line
      if (data.movementMessage["status"] === "complete") {
        setTemiMovementData(data.movementMessage["location"]); 
      }
    });

    socket.onAny((event, data) => {
      console.debug(event, data);
    })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Call the setTemiMovementData method with a parameter when the 't' key is pressed
      if (event.key === "n") {
        console.log("Debugging")
        setStepperCounter(stepperCounter + 1);
      }
      else if (event.key === "c") {
        let location = nameToAlias(stepperData[stepperCounter]);
        console.log("Finish: ", location)
        setTemiMovementData(location)
      }
      else if (event.key === "s") {
        setNextMessage(true);
      }
      else if (event.key === "d") {
        setIsAtCore(true);
      }
    };

    // Attach the handleKeyPress function to the document's keypress event
    document.addEventListener("keypress", handleKeyPress);

    return () => {
      // Remove the handleKeyPress function from the document's keypress event
      document.removeEventListener("keypress", handleKeyPress);
    };
  }, [stepperCounter, stepperData]);

  // useEffect(() => {
  //   //search correct text and emit to temi TTS
  //   (() => {

  //     let loc = locationData.filter(location => location.alias === temiMovementData);
  //     if (loc !== undefined) {
  //       // let data = loc[0]; // Get the first item, which should be the only one
  //       // if (data) speak(data)
  //     }
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [locationData, temiMovementData]);

  // useEffect(() => {
  //   //search next line of text & emit to temi
  //   (() => {
  //     if (currentLocation !== undefined) {
        
  //       let sentence =
  //         currentLocation!.textList[
  //           sentenceCounter
  //         ]

          
  //         if (sentence !== undefined ) {
  //         console.log(sentenceCounter + ": " + sentence)
          
  //         // Pause the speech
  //         if (sentence === "...") {
  //           setTimeout(() => {
  //             console.log("Waiting for a second")
  //             setCurrentSentence("...");
  //           }, 500)
  //         } else {
  //           socket.emit( "tts", sentence);
  //         }
  //       } else {

  //         setCurrentLocation(undefined);
  //         setCurrentSentence("");
  //       }
  //     }
  //   })();
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [sentenceCounter]);

  // useEffect(() => {
  //   //shutdown
  //   if (ShutdownCounter === 15) {
  //     socket.emit("shutdown");
  //   }
  // }, [ShutdownCounter, socket]);

  useEffect(() => {
    // check if location is core ai infra xrdev nextweb
    // to be able to go to each location and visit all choice modules
    if (currentLocation !== undefined) {
      if (
        currentLocation.alias === "core" ||
        currentLocation.alias === "aiengineer" ||
        currentLocation.alias === "infra" ||
        currentLocation.alias === "xrdev" ||
        currentLocation.alias === "nextweb" ||
        currentLocation.alias === "creativetech"
      ) {
        setIsAtCore(true);
      } else {
        setIsAtCore(false);
      }
    }
  }, [currentLocation]);

  // useEffect(() => {
  //   //reboot after 1 min of showing QR code in the end
  //   if (isLastPage) {
  //     setTimeout(() => {
  //       socket.emit("reboot", "yes");
  //     }, 60000);
  //   }
  // }, [isLastPage, socket]);

  //send temi to specific location
  const sendLocation = (location: string, name: string) => {

    setIsLastPage(false);
    
    // if (timer !== null) {
    //   clearTimeout(timer);
    // }

    // // Reboot if needed
    // let timeState = setTimeout(() => {
    //   socket.emit("reboot", "yes");
    // }, 600000);
    // setTimer(timeState);

    // Move the stepper one step further
    if (stepperData.includes(name)) {
      let index = stepperData.indexOf(name)
      setStepperCounter(index);
    }

    console.log(locationData)
    console.log(name)

    const LocationObj = locationData.filter(loc => loc.alias === name)[0];

    if (LocationObj.move) {
      console.log("Temi is moving to location", location)
      socket.emit("tts", `Volgt u me maar!`)
      // Make sure the robot actually moves to the location, then we will have to wait until he is there...
      socket.emit("message", location);
      // We will have to wait for the `temiMovementMessage` socket event to be received
    } else {
      setTemiMovementData(location); 
    }

   


    // setTemiMovementData(location); // DEBUGGING
  };

  // #region App

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


  //fill drawer with locations from API
  const getList = () => (
    <Box
      key="box"
      role="presentation"
      style={{ width: 250 }}
      onClick={() => setOpen(false)}
    >
      {locationData.map((item, index) => (
          <ListItemButton
            key={index}
            tabIndex={index}
            onClick={(event) => {
              setIsLastPage(false);
              sendLocation(item.alias, item.name);
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
              primary={item.name.split("-").join(" ")}
            />
          </ListItemButton>
      ))}
      <Divider key="divider-1" />
      <Divider key="divider-2" />
      <Divider key="divider-3" />

      <ListItemButton onClick={handleOpen} key="tutorial">
        <ListItemText
          key={locationData!.length + 1}
          tabIndex={locationData!.length + 1} 
          primaryTypographyProps={{ fontSize: "20px" }}
          primary={"Tutorial Video"}
        />
      </ListItemButton>
    </Box>
  );

  // //convert alias to location name
  const aliasToName = (alias: any) => {
    for (let location of locationData) {
      if (location.alias === alias) return location.name;
    }
  };
  //convert location name to alias
  const nameToAlias = (name: any) => {
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
      <div key="main">
        <Drawer open={open} anchor={"left"} onClose={() => setOpen(false)}>
          {getList()}
        </Drawer>
        <img src="/mctLogo.jpg" alt="mctLgo" className="lowerleft" 
        // Uncomment this during debugging
        // onClick={() => setSentenceCounter(sentenceCounter + 1)}
        ></img>

        <div className="App">
          <Button id="HamburgerMenuButton" onClick={() => setOpen(true)}>
            <Menu className="topleft" sx={{ fontSize: 40, color: "black" }} />
          </Button>

          <div>
            <FormControlLabel
              id="switchLabel"
              value="end"
              control={
                <GreenSwitch checked={checked} onChange={switchChange} />
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
                <Step key={label} id={label}>
                  <StepLabel StepIconComponent={QontoStepIcon}>
                    {label.split('-').join(' ')}
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
              <p>Wat vond je van deze rondleiding? <br />
                Laat gerust een opmerking achter bij mijn menselijke collega's!</p>
              </div>
              <div className="lowerRight">
              <button
                className="btn-next"
                onClick={(event) => {
                  sendLocation(
                    nameToAlias(stepperData[0]),
                    stepperData[0]
                  );
                }} 
              >
                Stuur terug naar start
                </button>
              </div>
              {/* <img src="/qr.jpg" id="qr" alt="mctLgo"></img> */}
            </>
          ) : ''}

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
                            let name = stepperData[stepperCounter + 1]
                            let alias = nameToAlias(name);
                            sendLocation(
                              // Convert to the alias, which is the Temi location
                              alias,
                              name
                            );
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
                    </>
                  ) : (
                    <div className="multipleOptions">
                      {coreLocations.map((alias) => (
                        <button
                          id="GoToNextLocation"
                          onClick={() => {
                            console.log(coreLocations);
                            if (coreLocations.length === 1) {
                              let name = aliasToName(alias)
                              sendLocation(alias, name);
                              setShowInternational(true);
                            } else {
                              setCoreLocation(
                                coreLocations.filter((e) => e !== alias)
                              ); // Remove the one you just selected
                                
                              let name = aliasToName(alias)
                              sendLocation(alias, name);
                            }
                          }}
                        >
                          Ga naar {" " + aliasToName(alias)}
                        </button>
                      ))}
                    </div>
                  )}
                </>
              ) : ( "" ) } 

        { currentSentence !== "" ? (
              <>
              <Player
              className='c-lottie'
              autoplay={true}
              loop={true}
              controls={false}
              keepLastFrame={true}
              src={`${window.location.origin}/assets/lottie/loading.json`}
              style={{ height: '22rem', width: '22rem', position: 'fixed', right: 0, bottom: 0 }}
            ></Player>
            </>
            ) : '' }

          { currentSentence === "" && !isLastPage ? (
            <>
              <div id="title">
                  <button className="hidden" id="cancelButton">
                    <CancelIcon
                      sx={{ fontSize: 100, color: red[500] }}
                    ></CancelIcon>
                  </button>
                  <button
                    id="GoToNextLocation"
                    onClick={() => {
                      console.log("stepperCounter: ", stepperCounter);
                      console.log("StepperData ", stepperData);
                      if (stepperCounter < stepperData.length - 1) {
                        let name = stepperData[stepperCounter + 1]
                        let alias = nameToAlias(name);
                        
                        console.log(stepperCounter + ": " + stepperData[stepperCounter + 1])
                        sendLocation(
                          // Convert to the alias, which is the Temi location
                          alias,
                          name
                        );
                      } else if (stepperData.length === 1) {
                        let name = stepperData[0]
                        let alias = nameToAlias(name);
                        
                        console.log(stepperCounter + ": " + name)
                        sendLocation(
                          // Convert to the alias, which is the Temi location
                          alias,
                          name
                        );
                      } else {
                        setIsLastPage(true);
                        socket.emit("message", "finish");
                      }
                    }}
                  >
                    {
                    stepperData.length === 1
                    ? "Welkom in " + stepperData[0]
                    :
                      stepperCounter >= stepperData.length - 1
                        ? "Ga naar einde"
                        : "Ga naar " + stepperData[stepperCounter + 1].split('-').join(" ")
                        
                    }
                  </button>
                </div>
            </>
          ) : '' }
        </div>
        <div id="ttsDiv">
          <p>{currentSentence}</p>
        </div>
      </div>
      <div key="modal">
        <Modal
          open={openTutorial}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <iframe
              width="1120"
              height="630"
              src="https://www.youtube.com/embed/_FNKdQrZekk"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            />
          </Box>
        </Modal>
      </div>
    </>
  );

  // #endregion
}

export default App;
