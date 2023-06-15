import React, { useState } from 'react';
import { useMouseDownTimer } from '../hooks/useMouseDownTimer';
import { useShutdown } from '../hooks/useShutdown';

import ConfigPanel from './configPanel';


function InteractableImage() {
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
  // #endregion

  return (
    <div>
    <img
      src="/assets/images/mctLogo.jpg"
      alt="mctLogo"
      className="lowerleft"
      onClick={handleImageClick} // Register the click handler
      onMouseDown={startTimer} 
      onMouseUp={stopTimer} 
    />
      <ConfigPanel isOpen={showDialog} onClose={() => setShowDialog(false)} />
    </div>
  );
}

export default InteractableImage;
