import React, { useEffect, useState } from 'react';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Menu from '@mui/icons-material/Menu';
import LocationList from './LocationList';
import ToggleTts from './ToggleTts';
import RefreshPage from './RefreshPage';
import SocketConnected from './SocketConnected';
import { useAppConfig } from '../hooks/useAppConfig';
import { AppState } from '../interfaces/interfaces';
import { useLocation } from '../context/LocationContext';
import { useStateContext } from '../context/StateContext';

function NavAndTopBar({ sendLocation }) {

    const { setAppState, navbarOpen, setNavbarOpen, apiUrl, setApiUrl, tour, setTour } = useStateContext();

    const [config] = useAppConfig();

    const {
        setLocationData,   
      } = useLocation();

    useEffect(() => {
      console.info("The saved config is:", config)
      setApiUrl(config.apiUri);
      setTour(config.tour);
    }, [config]);

    //  the default information and get the socket connection on!
  useEffect(() => {
    if (apiUrl === "" || tour === "") {
      console.warn("The config is not yet actively loaded, stopping here");
      return;
    }
    console.info(`Api and Tour have been updated: Api: ${apiUrl}, Tour: ${tour} `)

    //#region Fetch the default information
    //API call to get location information

    let url = `${apiUrl}/api/locations/${tour}`;
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
        console.debug("SetLocationData: ", data);
        setLocationData(data);
        setAppState(AppState.Active); // Set loading to false after data is fetched
      }).catch((error) => {
        console.error("The url you requested is not found: ", url, error);
        setAppState(AppState.Error); // Set loading to false after data is fetched
      });

    //#endregion

  }, [apiUrl, tour, setAppState, setLocationData]);


  return (
    <>
      <Drawer open={navbarOpen} anchor={"left"} onClose={() => setNavbarOpen(false)}>
        <LocationList
          sendLocation={sendLocation}
        />
      </Drawer>

      {/* The Top bar */}
      <div className="App">
        <Button id="HamburgerMenuButton" onClick={() => setNavbarOpen(true)}>
          <Menu className="topleft" sx={{ fontSize: 40, color: "black" }} />
        </Button>

        <div className="actions">
          <ToggleTts />
          <RefreshPage />
          <SocketConnected />
        </div>
      </div>
    </>
  );
}

export default NavAndTopBar;
