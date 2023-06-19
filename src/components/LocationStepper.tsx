import React, { useEffect, useState } from 'react';
import { Stepper, Step, StepLabel, Stack } from '@mui/material';
import StepperIcon, { StepperConnector } from './StepperIcon'; // make sure to import this from the correct path
import { useAppConfig } from '../hooks/useAppConfig'; // make sure to import this from the correct path
import { AppState } from '../interfaces/interfaces';
import { useLocation } from '../context/LocationContext';

function LocationStepper({setAppState}) {
    const [api, setApi] = useState("");
    const [tour, setTour] = useState("");
    const [config, ] = useAppConfig();

    const {
      stepperData,
      stepperCounter,
      setStepperData    
    } = useLocation();    

    useEffect(() => {
      console.debug("The saved config is:", config)
      setApi(config.apiUri);
      setTour(config.tour);
    }, [config]);

    useEffect(() => {
        if (api === "" || tour === "") {
          console.warn("The config is not yet actively loaded, stopping here");
          return;
        }
        console.debug(`Api and Tour have been updated: Api: ${api}, Tour: ${tour} `)

        let stepperURL = `${api}/api/stepper/${tour}`;
        let optionsURL = {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json;charset=UTF-8",
          },
        };
        fetch(stepperURL, optionsURL)
          .then((response) => {
            if (response.ok) {
              setAppState(AppState.Active); // Set loading to false after data is fetched
              return response.json();
            }
          })
          .then((data) => {
            setAppState(AppState.Active); // Set loading to false after data is fetched
            setStepperData(data[0].stepsList);
          }).catch((error) => {
            console.error("The url you requested is not found: ", stepperURL, error);
            setAppState(AppState.Error); // Set loading to false after data is fetched
            // TODO: Show a custom error page
          });
    }, [api, tour, setAppState, setStepperData]);

    return (
      <div className="Stepper">
        <Stack sx={{ width: "100%" }} spacing={4}>
          <Stepper
            id="stepper"
            alternativeLabel
            activeStep={stepperCounter}
            connector={<StepperConnector />}
          >
            {stepperData.map((label) => (
              <Step key={label} id={label}>
                <StepLabel StepIconComponent={StepperIcon}>
                  {label.split('-').join(' ')}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>
      </div>
    );
}

export default LocationStepper;
