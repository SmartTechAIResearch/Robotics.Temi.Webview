import { alpha, FormControlLabel, styled, Switch } from "@mui/material";
import { blue, lightBlue } from "@mui/material/colors";
import { useState } from "react";

import { useSocket } from '../context/SocketContext';

export default function SocketConnected() {
  const socket = useSocket();

  const [checked, setChecked] = useState(false);

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

  const switchChange = (e) => {
    // console.log(e.target.checked);
    setChecked(e.target.checked);
    //emit mute
    if (checked === false) {
      console.log("Unmuting Temi");
      socket.emit("mute", "false");
    } else {
      console.log("Muting Temi");
      socket.emit("mute", "true");
    }
  };

    return (
      <FormControlLabel
        id="switchLabel"
        value="end"
        control={
          <GreenSwitch checked={checked} onChange={switchChange} />
        }
        label="Toggle TTS"
        labelPlacement="top"
      />
    )
}