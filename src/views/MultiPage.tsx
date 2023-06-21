import React, { useCallback, useEffect, useState } from 'react';
import { Destination } from '../components';
import { useLocation } from '../context/LocationContext';
import { useSentenceContext } from '../context/SentenceContext';
import { useSocket } from '../context/SocketContext';
import { useStateContext } from '../context/StateContext';
import { AppState, iLocationData, SubState } from '../interfaces/interfaces';

interface MultiPageProps {
    destinations: iLocationData[];
    parentLocation?: iLocationData;
    nextLocation?: iLocationData;
    sendLocation: (locationName: string) => void;
}

const MultiPage: React.FC<MultiPageProps> = ({ destinations: initialDestinations, parentLocation, nextLocation, sendLocation }) => {

    // Make it possible to override the destinations
    const [destinations, setDestinations] = useState(initialDestinations);
    const [arrived, setArrived] = useState(false);
    const {
        setDestination,
        destination,
    } = useLocation();
    const socket = useSocket();
    const { setCurrentSentence, setSentenceCounter } = useSentenceContext();
    const { appState, setAppState, subState, setSubState } = useStateContext();

    // Calculate the class that's necessary to show the amount of destinations
    const destinationsClass = `destinations${destinations.length}`;

    // Check if all destinations have been visited
    const allVisited = destinations.every(destination => destination.visited);

    useEffect(() => {
        // Temi sends a message here when his movement is finished.
        if (subState == SubState.Multipage) {
            console.log("Temi has arrived again")
            setArrived(true);
            if (destination != null) {
                
                 // Create a new array with the updated 'visited' property
                const newDestinations = destinations.map((dest, i) => {
                    if (dest.name === destination.name) {
                        return { ...dest, visited: true };
                    }
                    return dest;
                });
                setDestinations(newDestinations);
                console.log("Setting new Destinations", newDestinations);

            }
        }
    }, [subState, destination]);

    if (allVisited) {
        return (
            <div className="multiDestinations destinations1">
                <Destination
                    onClickHandler={() => sendLocation(nextLocation.name)}
                    {...nextLocation}
                />
            </div>
        );
    }
   
   
    const sendMultiDestination = (location: iLocationData) => {
        if (location === undefined) return;
      
        if (location.move) {
            socket.emit("tts", `Volgt u me maar!`)
            // Make sure the robot actually moves to the location, then we will have to wait until he is there...
            socket.emit("message", location.alias);
            setCurrentSentence("Volgt u me maar!");
            setDestination(location);

            setAppState(AppState.Active); // Make sure the AppState is set back to active in case it was executed from the LastPage
            setSubState(SubState.Moving); // Temi is now moving, we can use this to show an extra field
    
            setArrived(false); // Not yet arrived, ofcourse
            console.log("Sending Temi to location: ", location);
    
        }

    };


    const handleDestinationClick = (index) => {
        // Log the destination name
        console.log("Moving to ", destinations[index].name);
        if (destinations[index].visited) {
            console.log("Already visited this location");
            return;
        }
        sendMultiDestination(destinations[index]);
       
        // Update the state with the new array
    }

    return (
        <>
            <div className={`multiDestinations ${destinationsClass}`}>
                {destinations.map((destination, index) => (
                    <Destination
                        key={index}
                        onClickHandler={() => handleDestinationClick(index)}
                        {...destination}
                    />
                ))}
            </div>
            <div className="lowerRight multiDestinations destinations1 destination-sm">
                <Destination
                    onClickHandler={() => sendLocation(nextLocation.name)}
                    {...nextLocation}
                />
            </div>
        </>

    );
}

export default MultiPage;

