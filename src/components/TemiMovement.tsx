import { useEffect, useState } from "react";
import { useLocation } from "../context/LocationContext";
import { useSentenceContext } from "../context/SentenceContext";
import { useSocket } from "../context/SocketContext";
import { useStateContext } from "../context/StateContext";
import { AppState, SubState } from "../interfaces/interfaces";

function TemiMovement({ }) {

    const socket = useSocket();
    const [temiMovementData, setTemiMovementData] = useState<string>("");

    const {
        setCurrentLocation,
        setNextLocation,
        locationData,
        stepperLocations,
        destination
    } = useLocation();

    const { setSubState, setAppState } = useStateContext();
    const { sentenceCounter, setSentenceCounter, currentSentence, setCurrentSentence } = useSentenceContext();




    // temi arrived
    useEffect(() => {

        if (temiMovementData === "") return;

        let locationIndex = locationData.findIndex(loc => loc.alias === temiMovementData);
        let loc = locationData[locationIndex];
        setCurrentLocation(loc);

        // Find if the arrived location is in the stepper
        let stepperLocationIndex = stepperLocations.findIndex(loc => loc.alias === temiMovementData);
        if (stepperLocationIndex !== -1) {
            // Make sure to set the next Location as well
            let nextLocationIndex = stepperLocationIndex + 1;
            if (nextLocationIndex < stepperLocations.length) {
                setNextLocation(stepperLocations[nextLocationIndex]);
            } else {
                // if there is no more location, we have reached the end of the route.
                setNextLocation(null);
                setAppState(AppState.NearlyLastPage);
            }
        }

        // Speaking part
        setSubState(SubState.Speaking);
        // setCurrentSentence("Ik ben gearriveerd aan " + loc.name);
        setSentenceCounter(0);

    }, [temiMovementData]);


    // Socket connection handlers
    useEffect(() => {

        // Temi sends a message here when his movement is finished.
        // Use it to reset the sentenceCounter and start speaking the first sentence of the arrived location.
        socket.on("temiMovementMessage", (data: any) => {
            // First line
            if (data.movementMessage["status"] === "complete") {
                console.log("Temi has arrived at", data.movementMessage["location"]);
                setTemiMovementData(data.movementMessage["location"]);
            }
        });

    }, [socket])

    return <></>;
}

export default TemiMovement;