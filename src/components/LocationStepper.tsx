import React, { useEffect, useState } from 'react';
import { Stepper, Step, StepLabel, Stack } from '@mui/material';
import StepperIcon, { StepperConnector } from './StepperIcon'; // make sure to import this from the correct path
import { useAppConfig } from '../hooks/useAppConfig'; // make sure to import this from the correct path
import { AppState } from '../interfaces/interfaces';
import { useLocation } from '../context/LocationContext';
import { useStateContext } from '../context/StateContext';

function LocationStepper() {
    const [config] = useAppConfig();

    const {
      stepperData,
      stepperCounter,
      setStepperData    
    } = useLocation();    

    const { setAppState, apiUrl, tour } = useStateContext();

    useEffect(() => {
        if (apiUrl === "" || tour === "") {
          console.warn("The config is not yet actively loaded, stopping here");
          return;
        }
        console.info(`Api and Tour have been updated: Api: ${apiUrl}, Tour: ${tour} `)

        let url = `${apiUrl}/api/stepper/${tour}`;
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
              setAppState(AppState.Active); // Set loading to false after data is fetched
              return response.json();
            }
          })
          .then((data) => {
            setAppState(AppState.Active); // Set loading to false after data is fetched
            setStepperData(data[0].stepsList);
            console.log("Setting data to", data)
          }).catch((error) => {
            console.error("The url you requested is not found: ", url, error);
            setAppState(AppState.Error); // Set loading to false after data is fetched
            // TODO: Show a custom error page
          });
    }, [apiUrl, tour, setAppState, setStepperData]);

    return (
      <div className="Stepper">
        <Stack sx={{ 
            minWidth: "100%", // Ensures the minimum width is 100% of the container
            maxWidth: "fit-content", // Allows the stack to expand beyond 100% if needed
            overflow: "auto", // Enables scrolling if the content overflows
            '&::-webkit-scrollbar': {
              display: 'none' // Hides the scrollbar for Webkit browsers
            },
            // For other browsers, use the following:
            msOverflowStyle: 'none', // For Internet Explorer and Edge
            scrollbarWidth: 'none', // For Firefox
            spacing: 4,
            '& .MuiStep-root': { // Targeting each Step component within the Stack
              minWidth: '150px', // Minimum width for each Step
            }
          }}
        spacing={4}
        >
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
