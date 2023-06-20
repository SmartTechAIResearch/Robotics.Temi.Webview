import React from 'react';
import { Box, ListItemButton, ListItemText, Divider, SvgIcon } from '@mui/material';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ForumIcon from '@mui/icons-material/Forum';
import WcIcon from '@mui/icons-material/Wc';
import ElevatorIcon from '@mui/icons-material/Elevator';
import PowerIcon from '@mui/icons-material/Power';
import CancelIcon from '@mui/icons-material/Cancel';
import { useLocation } from '../context/LocationContext';
import { useStateContext } from '../context/StateContext';
import { SubState } from '../interfaces/interfaces';

const iconMapping = {
    AccountBalanceIcon: AccountBalanceIcon,
    ForumIcon: ForumIcon,
    WcIcon: WcIcon,
    ElevatorIcon: ElevatorIcon,
    PowerIcon: PowerIcon,
  };

function LocationList({ sendLocation }) {

  const {
    locationData,    
  } = useLocation();

  const { setNavbarOpen, setSubState } = useStateContext();

  return (
    <Box
      key="box"
      role="presentation"
      style={{ width: 250 }}
      onClick={() => setNavbarOpen(false)}
    >
      {locationData.map((item, index) => (
        <ListItemButton
          key={index}
          tabIndex={index}
          onClick={(event) => {
            sendLocation(item);
          }}
        >
          {
            <SvgIcon
            className="svgClass"
            component={iconMapping[item.icon] || CancelIcon}
          ></SvgIcon>
          }
          <ListItemText
            primaryTypographyProps={{ fontSize: "20px" }}
            primary={item.name}
          />
        </ListItemButton>
      ))}
      <Divider key="divider-1" />
      <Divider key="divider-2" />
      <Divider key="divider-3" />

      <ListItemButton onClick={() => setSubState(SubState.Tutorial)} key="tutorial">
        <ListItemText
          key={locationData.length + 1}
          tabIndex={locationData.length + 1}
          primaryTypographyProps={{ fontSize: "20px" }}
          primary={"Tutorial Video"}
        />
      </ListItemButton>
    </Box>
  );
}

export default LocationList;
