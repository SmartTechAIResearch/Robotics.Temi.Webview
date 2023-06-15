import React from "react";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { styled } from "@mui/system";


const CloseButton = styled(IconButton)({
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "#44c8f5",
    color: "white",
    fontWeight: "bold",
    "&:hover": {
      backgroundColor: "#44c8f5",
    },
  });

function EmbedImage({showImagePopup, closeImagePopup, imagePath}) {

  return (
    <div>
      {showImagePopup && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
          <div style={{ position: "relative", height: "90%", width: "90%", maxWidth: "720px", overflow: "auto", margin: "5% auto", backgroundColor: "white" }}>
          <CloseButton onClick={closeImagePopup}>
              <CloseIcon />
            </CloseButton>
            <img src={imagePath} alt="Overlay" style={{ width: "100%"}} />
          </div>
        </div>
      )}
    </div>
  );
}

export default EmbedImage;
