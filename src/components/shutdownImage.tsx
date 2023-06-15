import React, { useEffect, useState } from 'react';

function ShutdownImage({socket}) {
  const [shutdownCounter, setShutdownCounter] = useState(0);

  // Increment the shutdown counter whenever the image is clicked
  const handleImageClick = () => {
    setShutdownCounter((prevCount) => prevCount + 1);
  };

  // Emit the "shutdown" event when the counter reaches 15
  useEffect(() => {
    if (shutdownCounter === 15) {
        console.log("Shutting down the application");
        socket.emit("shutdown");
    }
  }, [shutdownCounter, socket]);

  return (
    <img
      src="/assets/images/mctLogo.jpg"
      alt="mctLogo"
      className="lowerleft"
      onClick={handleImageClick} // Register the click handler
    />
  );
}

export default ShutdownImage;
