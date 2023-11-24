/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */

// #region imports
import { createContext, useCallback, useContext, useEffect, useState } from "react";
import "./css/App.css";
import { iLocationData, NextStep, NextStepImpl, EmbedNextStep, ImageNextStep, AppState, SubState, NestedNextStep, BubbleNextStep } from "./interfaces/interfaces";

import { EmbedWebsite, EmbedImage, InteractableImage, TutorialVideo, NavAndTopBar, LocationStepper, Destination, Subtitle } from './components'
import { LastPage, MultiPage } from './views';
import { SocketProvider, useSocket } from './context/SocketContext';
import { LocationProvider, useLocation } from './context/LocationContext';
import { ErrorAnimation, LoadingAnimation } from './animations';
import { StateProvider, useStateContext } from "./context/StateContext";
import { SentenceProvider, useSentenceContext } from "./context/SentenceContext";
import TemiMovement from "./components/TemiMovement";

//#endregion


function App() {
  console.debug('App rendered');
  const socket = useSocket();
  const debugMode = false; // Don't forget to toggle this to false!!

  const { appState, setAppState, subState, setSubState } = useStateContext();
  const { sentenceCounter, setSentenceCounter, setCurrentSentence } = useSentenceContext();
  // Location info
  const {
    currentLocation,
    setCurrentLocation,
    nextLocation,
    destination,
    setDestination,

    stepperLocations,
    firstLocation,

    stepperCounter,
    setStepperCounter,
    locationData
  } = useLocation();

  const [nextMessage, setNextMessage] = useState<boolean>(false);
  const [temiMovementData, setTemiMovementData] = useState<string>("");
  const [multiDestinations, setMultiDestinations] = useState<iLocationData[]>([]);
  const [parentLocation, setParentLocation] = useState<iLocationData>(null);

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
        data = currentLocation.onNextStep;
        setSubState(SubState.Multipage);
        // Fetch locations from the names
        let locations = (data as NestedNextStep).locations.map((locationName: string) => {
          return locationData.find((location: iLocationData) => location.name === locationName);
        });
        setMultiDestinations(locations);
        setParentLocation(currentLocation);
        break;
      case NextStep.BUBBLE_TO_PARENT:
        data = currentLocation.onNextStep;
        setSubState(SubState.Multipage);
        let parentLocationName = (data as BubbleNextStep).parentLocation;
        let parentLocation = locationData.find((location: iLocationData) => location.name === parentLocationName);
        if (multiDestinations.length <= 0) {
          console.log("We don't have any destinations yet, so we will fetch them now ...")
          let locations = (parentLocation.onNextStep as NestedNextStep).locations.map((locationName: string) => {
            return locationData.find((location: iLocationData) => location.name === locationName);
          });
          setMultiDestinations(locations);
          setParentLocation(parentLocation);
        }
        break;

      default:
        console.log("Not doing anything now ...");
        break;
    }


  }

  const onClickHandler = useCallback(() => {
    console.log("App State is: ", appState.toString());
    // If the AppState is not NearlyLastPage, we can just go to the next location
    // Else, we should move to the LastPage
    if (appState === AppState.NearlyLastPage) {
      setAppState(AppState.LastPage);
      return;
    }
    sendLocation(nextLocation);
  }, [appState, nextLocation]);

  // #region Debugging

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
        if (destination) {

          socket.emit("temiMovement", {
            "status": "complete",
            "location": destination.alias
          })
        }
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
        <TemiMovement />
        <NavAndTopBar
          sendLocation={sendLocation}
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
                    afterFinishEvent={() => {
                      // Make this a property "firstLocation"
                      setSentenceCounter(-1);
                      sendLocation(firstLocation);
                    }}
                    afterFinishText="Stuur me terug naar start"
                  ></LastPage>
                case AppState.Active:
                case AppState.NearlyLastPage:
                  return <>
                    <LocationStepper />
                    {
                      (() => {
                        switch (subState) {
                          case SubState.Speaking:
                          case SubState.Moving:
                            return <Subtitle
                              handleFinish={handleFinish}
                            />
                          case SubState.Multipage:
                            return <MultiPage
                              destinations={multiDestinations}
                              parentLocation={parentLocation}
                              nextLocation={nextLocation}
                              sendLocation={() => sendLocation(nextLocation)}
                            />
                          default:
                            return (
                              <div className="multiDestinations destinations1">
                                <Destination
                                  onClickHandler={onClickHandler}
                                  {...nextLocation}
                                ></Destination>
                              </div>
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

}

const AppComponent = () => (
  <StateProvider>
    <SocketProvider>
      <SentenceProvider>
        <LocationProvider>
          <App />
        </LocationProvider>
      </SentenceProvider>
    </SocketProvider>
  </StateProvider>
);

export default AppComponent;
