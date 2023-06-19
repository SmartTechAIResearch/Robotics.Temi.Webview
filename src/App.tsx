/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

// #region imports
import { useEffect, useState } from "react";
import "./css/App.css";
import { iLocationData, NextStep, NextStepImpl, EmbedNextStep, ImageNextStep, AppState, SubState } from "./interfaces/interfaces";

import { EmbedWebsite, EmbedImage, InteractableImage, TutorialVideo, NavAndTopBar, LocationStepper, Location, Subtitle } from './components'
import { LastPage } from './views';
import { SocketProvider, useSocket } from './context/SocketContext';
import { LocationProvider, useLocation } from './context/LocationContext';
import { useAppConfig } from './hooks/useAppConfig';
import { ErrorAnimation, LoadingAnimation } from './animations';

//#endregion

function App() {
  console.debug('App rendered');
  const [api, setApi] = useState("");
  const [tour, setTour] = useState("");
  const socket = useSocket();

  const [config, saveConfig] = useAppConfig();

  useEffect(() => {
    console.log("The saved config is:", config)
    setApi(config.apiUri);
    setTour(config.tour);
  }, [config])

  const debugMode = false; // Don't forget to toggle this to false!!

  const [appState, setAppState] = useState(AppState.Loading); // initial state is Loading
  const [subState, setSubState] = useState(SubState.Idle); // initial state is Loading
  const [open, setOpen] = useState(false);

  const [sentenceCounter, setSentenceCounter] = useState(-1);

  // Location info
  const {
    currentLocation,
    nextLocation,
    destination,
    setCurrentLocation,
    setNextLocation,
    setDestination,

    locationData,
    stepperLocations,
    stepperData,

    stepperCounter,
    setStepperCounter
  } = useLocation();   

  const [nextMessage, setNextMessage] = useState<boolean>(false);
  const [temiMovementData, setTemiMovementData] = useState<string>("");
  const [currentSentence, setCurrentSentence] = useState<string>("");

  // Finish info
  const [iframeUrl, setIframeUrl] = useState("http://mct.be");
  const [imagePath, setImagePath] = useState("");

  // What to do after a finish at a location
  const handleFinish = () => {
    console.log(`We are finished with the location "${currentLocation.name}" we can do something else now ...`);
    if (currentLocation.onNextStep == null || currentLocation.onNextStep.type === NextStep.DEFAULT) {
      console.debug("This location doesn't contain anything nextStep");
      setSubState(SubState.Idle);
      setCurrentSentence(null); // Clear the subtitles
      return;
    }

    console.log(`The next thing to do is:`, currentLocation.onNextStep)
    let data: NextStepImpl;

    switch (currentLocation.onNextStep.type) {
      case NextStep.EMBED:
        data = currentLocation.onNextStep;
        console.log("The website we will embed now is: " + (data as EmbedNextStep).url);
        setIframeUrl((data as EmbedNextStep).url);
        setSubState(SubState.Embed);
        break;
      case NextStep.IMAGE:
        data = currentLocation.onNextStep;
        setImagePath("assets/images/" + (data as ImageNextStep).url);
        setSubState(SubState.Image);
        break;
      case NextStep.NESTED:
        console.log("We should show a new page of nested items next...");
        break;
      default:
        console.log("Not doing anything now ...");
        break;
    }


  }

  // temi arrived
  useEffect(() => {

    if (temiMovementData === "") return;
    
    let locationIndex = locationData.findIndex(loc => loc.alias === temiMovementData);
    let loc = locationData[locationIndex];
    setCurrentLocation(loc);
    
    let stepperLocationIndex = stepperLocations.findIndex(loc => loc.alias === temiMovementData);
    if (stepperLocationIndex !== -1) {
      let nextLocationIndex = stepperLocationIndex + 1;
      if (nextLocationIndex < stepperLocations.length) {
        setNextLocation(stepperLocations[nextLocationIndex]);
      }
    }

    // Speaking part
    setSubState(SubState.Speaking);
    // setCurrentSentence("Ik ben gearriveerd aan " + loc.name);
    setSentenceCounter(0);

  }, [temiMovementData]);

  

  // Socket connection handlers
  useEffect(() => {

    //listen to temi response socket for TTS
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
  }, [socket])

  // #region Debugging

  // useEffect(() => {
  //   if (currentLocation) {
  //     console.log("The current location is: ", currentLocation);
  //   }
  // }, [currentLocation])

  // useEffect(() => {
  //   if (nextLocation) {
  //     console.log("The next location is: ", nextLocation);
  //   }
  // }, [nextLocation])

  useEffect(() => {
    const handleKeyPress = (event) => {
      // Call the setTemiMovementData method with a parameter when the 't' key is pressed
      if (event.key === "n") {
        setStepperCounter(stepperCounter + 1);
      }
      else if (event.key === "s") {
        console.log("Forcing to show the next message");
        setSentenceCounter(sentenceCounter + 1);
        setNextMessage(true);
      }
      else if (event.key === "f") {
        console.log("Automatically forcing the movement to the next location:", destination);
        if (destination) setTemiMovementData(destination.alias);
      }
    };

    // Attach the handleKeyPress function to the document's keypress event
    document.addEventListener("keypress", handleKeyPress);

  });

  // #endregion

  //send temi to specific location
  const sendLocation = (location: iLocationData) => {
    if (location === undefined) return;

    setAppState(AppState.Active); // Make sure the AppState is set back to active in case it was executed from the LastPage
    setSubState(SubState.Moving); // Temi is now moving, we can use this to show an extra field

    // Move the stepper to the correct location
    let stepperLocationIndex = stepperLocations.findIndex(loc => loc.alias === location.alias);
    setStepperCounter(stepperLocationIndex);

    console.log("Sending Temi to location: ", location);

    if (location.move && !debugMode) {
      socket.emit("tts", `Volgt u me maar!`)
      // Make sure the robot actually moves to the location, then we will have to wait until he is there...
      socket.emit("message", location.alias);
      setCurrentSentence("Volgt u me maar!");
      setDestination(location);
      // We will have to wait for the `temiMovementMessage` socket event to be received
    } else {
      console.log("Temi doesn't have to move, because he's stationary");
      setTemiMovementData(location.alias); // Set temi to have moved already
    }

  };


  // #region App


  //app html
  return (
    <>
      <div key="main">
        <NavAndTopBar 
          setAppState={setAppState}
          setOpen={setOpen}
          open={open}
          sendLocation={sendLocation}
          setOpenTutorial={() => setSubState(SubState.Tutorial)}
        />
        {/* The Howest Logo */}
        <InteractableImage buttonsToShow={{
            cancel: currentLocation !== undefined,
            skip: currentLocation !== undefined,
          }}
        ></InteractableImage>
        <div className="Main">
            {
              (() => {
                switch (appState) {
                  case AppState.Loading:
                      return <LoadingAnimation show={appState === AppState.Loading} />;
                  case AppState.Error:
                      return <ErrorAnimation show={true} />;
                  case AppState.LastPage:
                      return <LastPage
                      sendLocation={sendLocation}
                      afterFinishEvent={(event) => {
                        // Make this a property "firstLocation"
                        sendLocation(locationData.find((location) => location.name === stepperData[0])[0]);
                      }}
                      afterFinishText="Stuur me terug naar start"
                    ></LastPage>
                  case AppState.Active:
                  case AppState.NearlyLastPage:
                      return <>
                          <LocationStepper
                            setAppState={setAppState}
                          ></LocationStepper>
                          {
                            (() => {
                              switch (subState) {
                                case SubState.Speaking:
                                case SubState.Moving:
                                  return <Subtitle
                                    currentSentence={currentSentence}
                                    setCurrentSentence={setCurrentSentence}
                                    sentenceCounter={sentenceCounter}
                                    setSentenceCounter={setSentenceCounter}
                                    currentLocation={currentLocation}
                                    handleFinish={handleFinish}
                                  />
                                default:
                                  return (
                                    <Location
                                      onClickHandler={() => {
                                          // If the AppState is not NearlyLastPage, we can just go to the next location
                                          sendLocation(nextLocation)
                                          // Else, we should move to the LastPage
                                        }
                                      }
                                    ></Location>
                                  )
                              }
                            })()
                          }
                        </>
                  default:
                      return null; // Or some default state
                }
              })()
            }
          </div>
          
      </div>
      <TutorialVideo openTutorial={subState === SubState.Tutorial} handleClose={() => setSubState(SubState.Idle)}></TutorialVideo>
      <EmbedWebsite showIframe={subState === SubState.Embed} closeIframe={() => setSubState(SubState.Idle)} url={iframeUrl} />
      <EmbedImage showImagePopup={subState === SubState.Image} closeImagePopup={() => setSubState(SubState.Idle)} imagePath={imagePath} />
    </>
  );

  // #endregion
}

const AppComponent = () => (
  <SocketProvider>
    <LocationProvider>
      <App />
    </LocationProvider>
  </SocketProvider>
);

export default AppComponent;
