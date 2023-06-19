// @ts-ignore @typescript-eslint/no-unused-vars
import React, { useState } from 'react';
import { useMouseDownTimer } from '../hooks/useMouseDownTimer';
import { useShutdown } from '../hooks/useShutdown';
import { Box } from '@mui/material';
import CancelIcon from '@mui/icons-material/Cancel';
import InfoIcon from '@mui/icons-material/Info';
import FastForwardIcon from '@mui/icons-material/SkipNext';

import ConfigPanel from './ConfigPanel';
import { blue, red } from '@mui/material/colors';

function InteractableImage({ buttonsToShow }) {
  // #region Shutdown
  const incrementShutdownCount = useShutdown();

  // Increment the shutdown counter whenever the image is clicked
  const handleImageClick = () => {
    incrementShutdownCount((prevCount) => prevCount + 1);
  };
  // #endregion

  // #region Config dialog
  const [showDialog, setShowDialog] = useState(false);
  
  const showDialogAfterDelay = () => {
    console.log("Dialog will be shown now")
    setShowDialog(true);
  };

  const [startTimer, stopTimer] = useMouseDownTimer(showDialogAfterDelay, 2000);

  const stopMovement = () => {
    console.log("Cancel the movement");
  };
  const skipMovement = () => {
    console.log("Skip the movement");
  };
  const showInfo = () => {
    console.log("Showing the info of Temi");
  };
  // #endregion

  return (
    <Box position="fixed" bottom={0} left={0} display="inline-flex">
      <img
        src="/assets/images/mctLogo.jpg"
        alt="mctLogo"
        style={{ width: "15rem", height: "15rem" }}
        onClick={handleImageClick} // Register the click handler
        onMouseDown={startTimer} 
        onMouseUp={stopTimer}
        onTouchStart={startTimer}
        onTouchEnd={stopTimer}
      />
      <Box 
        position="absolute" 
        top={0} 
        right={0} 
        display="flex" 
        gap={1}
        p={1}
      >
        {/* {buttonsToShow.cancel && <CancelIcon sx={{ fontSize: 30, color: red[500] }} onClick={stopMovement} />} */}
        {/* {buttonsToShow.skip && <FastForwardIcon sx={{ fontSize: 30, color: blue[500] }} onClick={skipMovement} />} */}
        {/* <InfoIcon sx={{ fontSize: 30, color: blue[500] }} onClick={showInfo}   /> */}
      </Box>
      <ConfigPanel isOpen={showDialog} onClose={() => setShowDialog(false)} />
    </Box>
  );
}

export default InteractableImage;
