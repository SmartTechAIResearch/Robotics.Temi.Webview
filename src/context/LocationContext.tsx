import React, { useContext, useEffect, useState } from 'react';
import { iLocationData } from '../interfaces/interfaces';

interface LocationContextType {
    currentLocation: iLocationData | null;
    nextLocation: iLocationData | null;
    destination: iLocationData | null;
    firstLocation: iLocationData | null;
    locationData: iLocationData[];
    stepperLocations: iLocationData[];
    stepperData: any[];
    stepperCounter: number;
    setCurrentLocation: (value: iLocationData | null) => void;
    setNextLocation: (value: iLocationData | null) => void;
    setDestination: (value: iLocationData | null) => void;
    setFirstLocation: (value: iLocationData | null) => void;
    setLocationData: React.Dispatch<React.SetStateAction<iLocationData[]>>;
    setStepperLocations: React.Dispatch<React.SetStateAction<iLocationData[]>>;
    setStepperData: React.Dispatch<React.SetStateAction<[]>>;
    setStepperCounter: React.Dispatch<React.SetStateAction<number>>;
  }

const LocationContext = React.createContext<LocationContextType>({
    currentLocation: null,
    nextLocation: null,
    destination: null,
    setCurrentLocation: () => {},
    setNextLocation: () => {},
    setDestination: () => {},

    locationData: null,
    stepperLocations: null,
    stepperData: null,
    setLocationData: () => {},
    setStepperLocations: () => {},
    setStepperData: () => {},

    stepperCounter: -1,
    setStepperCounter: () => {},

    firstLocation: null,
    setFirstLocation: () => {},
});

export default LocationContext;

export function useLocation() {
    return useContext(LocationContext);
}

export function LocationProvider({ children }) {
    const [locationData, setLocationData] = useState<Array<iLocationData>>([]);
    const [stepperLocations, setStepperLocations] = useState<Array<iLocationData>>([]);
    const [stepperData, setStepperData] = useState<Array<any>>(["START", "FINISH"]);
  
    const [currentLocation, setCurrentLocation] = useState<iLocationData>();
    const [nextLocation, setNextLocation] = useState<iLocationData>();
    const [destination, setDestination] = useState<iLocationData>();
    const [firstLocation, setFirstLocation] = useState<iLocationData>();

    const [stepperCounter, setStepperCounter] = useState(0);

    // Merge the stepperInfo into the LocationData
    useEffect(() => {
        if (stepperData.length === 0) return; // Still waiting for stepperData
        if (locationData.length === 0) return; // Still waiting for locationData

        // Set all the locationData stepIndexes to -1
        for (let i = 0; i < locationData.length; i++) {
        locationData[i].stepIndex = -1;
        }

        // Loop over the stepperData and append it to the LocationData if necessary
        for (let i = 0; i < stepperData.length; i++) {
        let stepperItem = stepperData[i];
        let locationIndex = locationData.findIndex(location => location.name === stepperItem);
        if (locationIndex !== -1) {
            // We found the location, append the stepperData to the locationData
            locationData[locationIndex].stepIndex = i;
        }
        }
        locationData.sort((a, b) => a.stepIndex - b.stepIndex);
        let activeLocations = locationData.filter(loc => loc.stepIndex !== -1);
        setStepperLocations(activeLocations);

        if (activeLocations.length > 0) {
        // Sort the locations by stepIndex
        console.log("The merged locations are: ", activeLocations);
        // Set the current location to the first location
        setCurrentLocation(activeLocations[0]);
        // Set the next location to the second location
        setNextLocation(activeLocations[1]);

        // Set first location
        setFirstLocation(activeLocations[0]);
        }

    }, [stepperData, locationData])

    return (
        <LocationContext.Provider value={{
            currentLocation,
            nextLocation,
            destination,
            setCurrentLocation,
            setNextLocation,
            setDestination,

            locationData,
            stepperLocations,
            stepperData,
            setLocationData,
            setStepperLocations,
            setStepperData,

            stepperCounter,
            setStepperCounter,

            firstLocation,
            setFirstLocation
          }}
        >
            {children}
        </LocationContext.Provider>
    );
}